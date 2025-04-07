/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('courses').del()
  await knex('courses').insert([
    {course_name: 'Systems Engineer', date_start: '06-01-2025', date_end: '12-01-2025', cert_granted: 'Systems Engineer'},
    {course_name: 'Network Engineer', date_start: '07-01-2025', date_end: '11-01-2025', cert_granted: 'Network Engineer'},
    {course_name: 'Instructor', date_start: '05-01-2025', date_end: '10-01-2025', cert_granted: 'Instructor'},
  ]);
};
