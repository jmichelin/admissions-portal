exports.up = function(knex, Promise) {
  return knex.schema.createTable('placement_assessment', function(table) {
    table.increments();
    table.uuid('uuid').notNullable
    table.json('content').notNullable()
    table.integer('difficulty_rank').notNullable();
    table.text('status').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('placement_assessment');
};
