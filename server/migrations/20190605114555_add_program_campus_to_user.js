exports.up = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.text('campus');
    table.text('program');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.dropColumn('campus');
    table.dropColumn('program');
  });};
