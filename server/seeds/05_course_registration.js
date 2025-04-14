const registeredUsers = [];
const numberOfUsers = 25;
const numberOfCourses = 3;

for (let i = 0; i < numberOfUsers; i++) {
  let registeredCourse = {};
  registeredCourse.course_id = Math.ceil(Math.random() * numberOfCourses);
  registeredCourse.user_id = Math.ceil(Math.random() * numberOfUsers);
  registeredCourse.in_progress = 'scheduled';
  registeredCourse.cert_earned = true;
  registeredCourse.user_id = Math.ceil(Math.random() * numberOfUsers)
  registeredUsers.push(registeredCourse);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('course_registration').del()
  await knex('course_registration').insert(registeredUsers);
};
