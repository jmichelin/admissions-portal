const knex = require('./knex');

module.exports = {
    getUserbyEmail: function(email) {
        return knex('user')
        .where('email', email)
        .first();
    },

    addNewUser: function(user, password) {
      return knex('user')
        .insert({
          email: user.email,
          password: password,
          first_name: user.first_name,
          last_name: user.last_name
        })
    }
};
