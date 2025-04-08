/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('courses', table => {
    table.increments('id');
    table.string('course_name').notNullable();
    table.date('date_start').notNullable();
    table.date('date_end').notNullable();
    table.string('cert_granted').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('courses');
};
