exports.up = function(knex, _Promise) {
  return knex.schema.createTable('campus', function(table) {
    table.increments();
    table.text('name').notNullable().unique();
    table.jsonb('offerrings');
  });
};

exports.down = function(knex, _Promise) {
  return knex.schema.dropTable('campus');
};
