/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('crew_rotations').del()
  await knex('crew_rotations').insert([
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'day', shift_duration: 8, experience_type: 'green'},
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'swing', shift_duration: 8, experience_type: 'yellow'},
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'night', shift_duration: 8, experience_type: 'red'},
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'rest', shift_duration: 8, experience_type: 'green'},
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'rest', shift_duration: 8, experience_type: 'green'},
    {date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'rest', shift_duration: 8, experience_type: 'green'},
  ]);
};
