// const createCourses = () => {
//   let courses = [];
//   const startDates = ['2025-03-17', '2025-04-14', '2025-05-12', '2025-06-09', '2025-07-07', '2025-08-01'];
//   const endDates = ['2025-03-28', '2025-04-25', '2025-05-23', '2025-06-20', '2025-07-18'];
//   for (i = 0; i < endDates.length; i++) {
//     courses.push(
//       {course_name: 'Systems Engineer', description: 'Training required to operate all parts of the system.', seats: 10, date_start: startDates[i], date_end: endDates[i], cert_granted: 'Systems Engineer'},
//       {course_name: 'Crew Commander', description: 'Training teaches how to supervise and how to oversee all crew requirements.', seats: 10, date_start: startDates[i], date_end: endDates[i], cert_granted: 'Crew Commander'},
//       {course_name: 'Crew Chief', description: 'Training teaches how to supervise and how to oversee all enlisted crew requirements.', seats: 10, date_start: startDates[i], date_end: endDates[i], cert_granted: 'Crew Chief'},
//       {course_name: 'Instructor', description: 'Required to teach and oversee new crew members.', seats: 10, date_start: startDates[i], date_end: endDates[i], cert_granted: 'Instructor'},
//       {course_name: 'Delta Exercise', description: 'Perform Delta ops and evaluate efficiency.', seats: 25, date_start: endDates[i], date_end: startDates[i + 1], cert_granted: 'Delta Exercise'},
//     )
//   }
//   return courses;
// }

const simplifiedCourses = [
  {course_name: 'Crew Commander', description: 'Training teaches how to supervise and how to oversee all crew requirements.', seats: 10, date_start: '2024-03-01', date_end: '2024-03-31', cert_granted: 'Crew Commander'},
  {course_name: 'Crew Chief', description: 'Training teaches how to supervise and how to oversee all enlisted crew requirements.', seats: 10, date_start: '2024-04-01', date_end: '2024-04-30', cert_granted: 'Crew Chief'},

  {course_name: 'Systems Engineer', description: 'Training required to operate all parts of the system.', seats: 10, date_start: '2025-02-01', date_end: '2025-02-28', cert_granted: 'Systems Engineer'},
  {course_name: 'Crew Commander', description: 'Training teaches how to supervise and how to oversee all crew requirements.', seats: 10, date_start: '2025-03-01', date_end: '2025-03-31', cert_granted: 'Crew Commander'},
  {course_name: 'Crew Chief', description: 'Training teaches how to supervise and how to oversee all enlisted crew requirements.', seats: 10, date_start: '2025-04-01', date_end: '2025-04-30', cert_granted: 'Crew Chief'},
  {course_name: 'Instructor', description: 'Required to teach and oversee new crew members.', seats: 10, date_start: '2025-05-01', date_end: '2025-05-31', cert_granted: 'Instructor'},

  {course_name: 'Delta Exercise', description: 'Perform Delta ops and evaluate efficiency.', seats: 25, date_start: '2025-06-01', date_end: '2025-07-31', cert_granted: 'Delta Exercise'},

  {course_name: 'Systems Engineer', description: 'Training required to operate all parts of the system.', seats: 10, date_start: '2025-08-01', date_end: '2025-08-31', cert_granted: 'Systems Engineer'},
  {course_name: 'Crew Commander', description: 'Training teaches how to supervise and how to oversee all crew requirements.', seats: 10, date_start: '2025-09-01', date_end: '2025-10-31', cert_granted: 'Crew Commander'},
  {course_name: 'Crew Chief', description: 'Training teaches how to supervise and how to oversee all enlisted crew requirements.', seats: 10, date_start: '2025-11-01', date_end: '2025-11-30', cert_granted: 'Crew Chief'},
  {course_name: 'Instructor', description: 'Required to teach and oversee new crew members.', seats: 10, date_start: '2025-12-01', date_end: '2025-12-31', cert_granted: 'Instructor'}
]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // const newCourses = createCourses();
  await knex('courses').del()
  // await knex('courses').insert(newCourses);
  await knex('courses').insert(simplifiedCourses);
};
