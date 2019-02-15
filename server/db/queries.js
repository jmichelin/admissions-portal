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

    updateUserPasswordToken: function(token) {
      return knex('user')
        .update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000
        });
    }
};
