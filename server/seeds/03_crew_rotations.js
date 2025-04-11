/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('crew_rotations').del()
  await knex('crew_rotations').insert([
    {crew_id: 1, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Day', shift_duration: 8, experience_type: 'green'},
    {crew_id: 2, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Swing', shift_duration: 8, experience_type: 'yellow'},
    {crew_id: 3, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Night', shift_duration: 8, experience_type: 'red'},
    {crew_id: 4, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Day', shift_duration: 12, experience_type: 'green'},
    {crew_id: 5, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Night', shift_duration: 12, experience_type: 'green'},
    {crew_id: 6, date_start: '05-01-2025', date_end: '05-04-2025', shift_type: 'Rest', shift_duration: 8, experience_type: 'green'},
  ]);
};
