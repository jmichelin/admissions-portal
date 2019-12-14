const knex = require('./knex');

import { CAMPUSES_SEI_18WK } from '../constants';

module.exports = {
  getAllUsers: function() {
    return knex('user');
  },

  getUserbyEmail: function(email) {
    return knex('user')
      .where('email', email)
      .first();
  },

  getUserById: function(id) {
    return knex('user')
      .where('id', id)
      .first();
  },

  addNewUser: function(user, password) {
    return knex('user')
      .returning(['id','email', "first_name", "last_name", "salesforce_id", "salesforce_type"])
      .insert({
        email: user.email.toLowerCase(),
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
        salesforce_id: user.salesforceUser.Id,
        salesforce_type: user.salesforceUser.attributes.type
      });
  },

  updateSalesforceUserAttrs: function(userEmail, salesforceUser) {
    return knex('user')
      .update({
        salesforce_id: salesforceUser ? salesforceUser.Id : null,
        salesforce_type: salesforceUser ? salesforceUser.attributes.type : null
      })
      .where('email', userEmail).returning('*');
  },

  updateUserPasswordToken: function(user, token) {
    return knex('user')
      .update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000
      })
      .where('email', user.email);
  },

  getUserbyToken: function(token) {
    return knex('user')
      .where('resetPasswordToken', token)
      .andWhere('resetPasswordExpires', '>', Date.now())
      .first();
  },

  updateUserPassword: function(user, password) {
    return knex('user')
      .update({ password })
      .where('email', user.email);
  },

  getUserLatestAssessment: function(user_id) {
    return knex('assessment')
      .distinct(knex.raw('ON (snippet_id) answer, created_at, status, test_results, snippet_id'))
      .where({user_id: user_id, snippet_id: 3})
      .orWhere({user_id: user_id, snippet_id: 4})
      .orderByRaw('snippet_id asc, created_at desc')
  },

  addNewAssessment: function(assessment) {
    return knex('assessment')
      .insert({
        snippet_id: assessment.snippet_id,
        answer: assessment.answer,
        status: assessment.status,
        test_results: assessment.test_results,
        user_id: assessment.user_id,
        created_at: knex.fn.now()
      })
      .returning('*')
  },

  updateAssessment: function(id, test_results, status) {
    return knex('assessment')
      .update({
        status: status,
        test_results: test_results,
        updated_at: knex.fn.now()
      })
      .where("id", id)
      .returning('*')
  },

  getAssessment: function(id) {
    return knex('assessment')
      .select('*')
      .where("id", id).first()
  },

  getProcessingAssessments: function(user_id) {
    return knex('assessment')
      .count('*')
      .where({"user_id": user_id, status: "processing"})
  },

  errorOutStaleAssessments: function(user_id) {
    return knex('assessment')
      .update({
        status: "error",
        updated_at: knex.fn.now()
      })
      .where({user_id: user_id, status: 'processing'})
      .where('created_at', '<=', new Date( Date.now() - 1000 * 60 ))
  },

  createCampus: function(campus) {
    const courses = _filterCourses(campus.courses)

    return knex('campus')
      .insert({
        name: campus.campus,
        offerrings: JSON.stringify(courses)
      })
  },

  updateCampus: function(campus) {
    const courses = _filterCourses(campus.courses)

    return knex('campus')
      .update({ offerrings: JSON.stringify(courses) })
      .where({name: campus.campus})
  },

  getCampus: function(campus) {
    return knex('campus')
      .select('*')
      .where("name", campus).first()
  },

  getCampuses: function() {
    return knex('campus').select('*')
  },

  getCourseByName: function(courseName) {
     return knex.raw(`SELECT all_offerings.off FROM (SELECT jsonb_array_elements(offerrings) as off FROM campus) as all_offerings WHERE all_offerings.off->>'courseName' = '${courseName}' LIMIT 1;`)
    },

  getApplication: function(id) {
    return knex('application')
      .select('*')
      .where("id", id).first()
  },

  getUserApplications: async function(userId) {
    let apps = await knex('application')
      .select('*')
      .where('user_id', userId)
      .where('complete', null)
      .orderByRaw('created_at DESC')
    return apps.map(app => { app.type = 'application'; return app })
  },

  updateApplication: async function(application) {
    let realCourseType = _checkIf18wkCourseType(application.values.Campus__c, application.courseType, application.courseProduct);
    const foundApp = await knex('application')
      .select('*')
      .where({id: application.id})
      .first()
    if (foundApp !== undefined && application.user_id == foundApp.user_id) {
      let app = await knex('application')
        .update({
          course_type: realCourseType,
          values: application.values,
          updated_at: knex.fn.now(),
          complete: application.complete,
        })
        .where({id: application.id})
        .returning('*')
      app[0].type = 'application';
      return app
    } else {
      return undefined
    }
  },

  findOrCreateApplication: async function(courseType, courseProduct, userId, values) {
    const realCourseType = _checkIf18wkCourseType(values.Campus__c, courseType, courseProduct);
    const foundApp = await knex('application')
      .select('*')
      .where({
        course_type: realCourseType,
        course_product: courseProduct,
        user_id: userId,
        complete: null,
      })
      .orderByRaw('created_at DESC')
      .first();
    if (foundApp !== undefined) return foundApp;

    const [newApp] = await knex('application')
      .insert({
        course_type: realCourseType,
        course_product: courseProduct,
        user_id: userId,
        values: values,
        created_at: knex.fn.now()
      })
      .returning('*');

    newApp.type = 'application';
    return newApp;
  },

  deleteApplication: async function(applicationID) {
    await knex('application')
      .where('id', applicationID)
      .del();
  },

  addNewPlacementAssessment: function(assessmentObj) {
    return knex('placement_assessment')
      .insert({
        result: assessmentObj.assessmentResults,
        user_id: assessmentObj.userId,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      })
      .returning('*')
  },

  getUnrankedPlacementAssessment: function() {
    return knex('placement_assessment_prompts')
    .where({
      difficulty_rank: 0
    })
    .select()
  },

  getPlacementAssessmentPrompt: function(currentSkillRating, promptsUses) {
    // TODO
    // filter prompts
    // by promptsUses
    // by currentSkillRating
    // return prompt object from db
  }
};

function _filterCourses(courses) {
  return courses.filter(course => {
    return course.courseType && Date.parse(course.startDate) > Date.now() && course.courseType.includes('Immersive') && !course.courseType.includes('Specialty Immersive');
  }).sort((a,b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
}

function _checkIf18wkCourseType(campus, courseType, courseProduct) {
  if (courseProduct === 'Full Stack' && CAMPUSES_SEI_18WK.includes(campus)) {
    return '18 Week Full-Time Immersive';
  }

  return courseType;
}
