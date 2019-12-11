exports.up = function(knex, Promise) {
  return knex.schema.createTable('placement_assessment_prompts', function(table) {
    table.increments();
    table.json('content').notNullable();
    table.integer('difficulty_rank');
    table.text('status').defaultTo('unsorted').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('placement_assessment_prompts');
};
