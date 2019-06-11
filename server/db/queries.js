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

    addNewUser: function(user, password) {
      return knex('user')
        .returning(['id','email', "first_name", "last_name", "salesforce_id", "salesforce_type"])
        .insert({
          email: user.email,
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
        salesforce_id: salesforceUser.Id,
        salesforce_type: salesforceUser.attributes.type
      })
      .where('email', userEmail);
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
        .update({
          password: password
        })
        .where('email', user.email);
    },

    getUserLatestAssessment: function(user_id) {
      return knex('assessment')
       .distinct(knex.raw('ON (snippet_id) answer, created_at, status, test_results, snippet_id'))
       .where('user_id', user_id)
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
      return knex('assessment').select('*')
      .where("id", id).first()
    },

    getProcessingAssessments: function(user_id) {
      return knex('assessment').count('*')
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
      let courses = _filterCourses(campus.courses)
      return knex('campus')
      .insert({
        name: campus.campus,
        offerrings: JSON.stringify(courses)
      })
    },

    updateCampus: function(campus) {
      return knex('campus')
      .update({
        offerrings: JSON.stringify(campus.courses)
      })
      .where({name: campus.campus})
    },

    getCampus: function(campus) {
      return knex('campus').select('*')
      .where("name", campus).first()
    },

    getCampuses: function() {
      return knex('campus').select('*')
    },

    getApplication: function(id) {
      return knex('application').select('*')
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
      const foundApp = await knex('application').select('*')
        .where({id: application.id})
        .first()
      if (foundApp !== undefined && application.user_id == foundApp.user_id) {
        let app = await knex('application').update({
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
      let realCourseType = _checkIf18wkCourseType(values.Campus__c, courseType, courseProduct);
      let foundApp = await knex('application')
        .select('*')
        .where({
          course_type: realCourseType,
          course_product: courseProduct,
          user_id: userId,
          complete: null,
        })
        .orderByRaw('created_at DESC').first();

      if (foundApp !== undefined) return foundApp;

      let [newApp] = await knex('application')
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
};

function _filterCourses(courses) {
  return courses.filter(course => {
    // filter course by campus and subsequent course type and course product, and course with start date in future
    return course;
  });
}

function _checkIf18wkCourseType(campus, courseType, courseProduct) {
  if (courseProduct === 'Full Stack') {
    if (CAMPUSES_SEI_18WK.includes(campus) && (courseType = '18 Week Full-Time Immersive')) {
    return '18 Week Full-Time Immersive';
  }
  return '12 Week Full-Time Immersive';
  }
  return courseType;
}
