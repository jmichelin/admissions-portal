
exports.up = function(knex, Promise) {
  return knex.schema.createTable('application', function(table) {
    table.increments();
    table.text('program').notNullable();
    table.jsonb('values').notNullable();
    table.timestamp('complete');
    table.integer('user_id').unsigned().references('user.id').onDelete('CASCADE').notNullable();
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('application')
};
