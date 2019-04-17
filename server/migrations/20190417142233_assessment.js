exports.up = function(knex, Promise) {
  return knex.schema.createTable('assessment', function(table) {
    table.increments();
    table.timestamps([true], [true]);
    table.text('answer').notNullable()
    table.integer('snippet_id').notNullable();
    table.text('status').notNullable();
    table.text('test_results').notNullable();
    table.integer('user_id').unsigned().references('user.id').onDelete('CASCADE').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('assessment');
};
