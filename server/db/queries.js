const knex = require('./knex');

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
        .returning(['id','email', "first_name", "last_name"])
        .insert({
          email: user.email,
          password: password,
          first_name: user.first_name,
          last_name: user.last_name
        });
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

    cleanupTestUsers: function() {
      if (process.env.NODE_ENV !== 'test') {
        return
      };
      return knex('user').del()
    }
};
