exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table) {
    table.increments();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('first_name').notNullable()
    table.text('last_name').notNullable()
    table.text('resetPasswordToken')
    table.text('resetPasswordExpires')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
