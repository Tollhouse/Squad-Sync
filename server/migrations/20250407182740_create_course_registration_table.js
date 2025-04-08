/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('course_registration', table => {
    table.increments('id');
    table.integer('user_id')
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.integer('course_id')
    table.foreign('course_id').references('courses.id').onDelete('CASCADE');
    table.string('in_progress').notNullable();
    table.boolean('cert_earned').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('course_registration', table => {
    table.dropForeign('user_id');
    table.dropForeign('course_id');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('course_registration');
    })
};