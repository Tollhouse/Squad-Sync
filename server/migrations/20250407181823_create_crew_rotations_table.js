/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('crew_rotations', table => {
    table.increments('id');
    table.integer('crew_id')
    table.foreign('crew_id').references('crews.id').onDelete('CASCADE');
    table.date('date_start').notNullable();
    table.date('date_end').notNullable();
    table.string('shift_type').notNullable();
    table.integer('shift_duration').notNullable();
    table.string('experience_type').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('crew_rotations', table => {
    table.dropForeign('crew_id');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('crew_rotations');
    })
};
