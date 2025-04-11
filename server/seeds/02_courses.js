/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('courses').del()
  await knex('courses').insert([
    {course_name: 'Crew Commander', date_start: '06-01-2025', date_end: '12-01-2025', cert_granted: 'Crew Commander'},
    {course_name: 'Crew Chief', date_start: '07-01-2025', date_end: '11-01-2025', cert_granted: 'Crew Chief'},
    {course_name: 'Operator', date_start: '05-01-2025', date_end: '10-01-2025', cert_granted: 'Operator'},
  ]);
};
