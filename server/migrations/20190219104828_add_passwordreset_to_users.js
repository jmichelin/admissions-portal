exports.up = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.text('resetPasswordToken');
    table.text('resetPasswordExpires');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.dropColumn('resetPasswordToken');
    table.dropColumn('resetPasswordExpires');
  });};
