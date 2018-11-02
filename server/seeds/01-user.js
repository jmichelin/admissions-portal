exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "user"; ALTER SEQUENCE user_id_seq RESTART WITH 1;')
    .then(function() {
      const user = [{
        email:'test@test.com',
        password: 'Testing123!',
        first_name: 'Tom',
        last_name: 'Jones'
      }];
      return knex('user').insert(user);
    });
};
