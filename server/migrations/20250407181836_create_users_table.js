/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('user_name').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('password').notNullable();
    table.integer('crew_id');
    table.foreign('crew_id').references('crews.id').onDelete('CASCADE');
    table.string('role').notNullable();
    table.string('experience_type').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropForeign('crew_id');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('users');
  });
};
