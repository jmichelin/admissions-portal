exports.up = function(knex, Promise) {
  return knex.schema.createTable('placement_assessment', function(table) {
    table.increments();
    table.float('skill_level', 4, 2);
    table.json('result').notNullable();
    table.timestamps(true, true);
    table.integer('user_id').unsigned().references('user.id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('placement_assessment');
};
