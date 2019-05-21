exports.up = function(knex, _Promise) {
  return knex.schema.createTable('course', function(table) {
    table.increments();
    table.text('campus').notNullable().unique();
    table.jsonb('offerrings');
  });
};

exports.down = function(knex, _Promise) {
  return knex.schema.dropTable('course');
};
