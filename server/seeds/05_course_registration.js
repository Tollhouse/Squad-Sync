const registeredUsers = [];
const numberOfUsers = 25;

for (let i = 0; i < numberOfUsers; i++) {
  let registeredCourse = {};
  if (i % 5 == 0) {
    registeredCourse.course_id = 2;
    registeredCourse.user_id = i + 1;
    registeredCourse.in_progress = 'completed';
    registeredCourse.cert_earned = true;
    registeredUsers.push(registeredCourse);
  } else if ((i - 1) % 5 == 0) {
    registeredCourse.course_id = 3;
    registeredCourse.user_id = i + 1;
    registeredCourse.in_progress = 'completed';
    registeredCourse.cert_earned = true;
    registeredUsers.push(registeredCourse);
  }
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
