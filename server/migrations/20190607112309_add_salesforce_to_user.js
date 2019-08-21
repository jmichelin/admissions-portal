exports.up = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.text('salesforce_id');
    table.text('salesforce_type');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', function(table) {
    table.dropColumn('salesforce_id');
    table.dropColumn('salesforce_type');
  });};
