// const registeredUsers = [];
// const numberOfUsers = 30;

// for (let i = 0; i < numberOfUsers; i++) {
//   let registeredCourse = {};
//   if (i % 5 == 0) {
//     registeredCourse.course_id = 2;
//     registeredCourse.user_id = i + 1;
//     registeredCourse.in_progress = 'completed';
//     registeredCourse.cert_earned = true;
//     registeredUsers.push(registeredCourse);
//   } else if ((i - 1) % 5 == 0) {
//     registeredCourse.course_id = 3;
//     registeredCourse.user_id = i + 1;
//     registeredCourse.in_progress = 'completed';
//     registeredCourse.cert_earned = true;
//     registeredUsers.push(registeredCourse);
//   } else if ((i - 3) % 5 == 0 && i < 20) {
//     registeredCourse.course_id = i + 6;
//     registeredCourse.user_id = i + 1;
//     registeredCourse.in_progress = 'scheduled';
//     registeredCourse.cert_earned = false;
//     registeredUsers.push(registeredCourse);
//   } else if ((i - 4) % 5 == 0 && i < 20) {
//     registeredCourse.course_id = i + 2;
//     registeredCourse.user_id = i + 1;
//     registeredCourse.in_progress = 'scheduled';
//     registeredCourse.cert_earned = false;
//     registeredUsers.push(registeredCourse);
//   }
// }

const simplifiedCourseRegistration = [
  { course_id: 1, user_id: 1, in_progress: 'completed', cert_earned: true },
  { course_id: 1, user_id: 6, in_progress: 'completed', cert_earned: true },
  { course_id: 1, user_id: 11, in_progress: 'completed', cert_earned: true },
  { course_id: 1, user_id: 16, in_progress: 'completed', cert_earned: true },
  { course_id: 1, user_id: 21, in_progress: 'completed', cert_earned: true },
  { course_id: 1, user_id: 26, in_progress: 'completed', cert_earned: true },

  { course_id: 2, user_id: 2, in_progress: 'completed', cert_earned: true },
  { course_id: 2, user_id: 7, in_progress: 'completed', cert_earned: true },
  { course_id: 2, user_id: 12, in_progress: 'completed', cert_earned: true },
  { course_id: 2, user_id: 17, in_progress: 'completed', cert_earned: true },
  { course_id: 2, user_id: 22, in_progress: 'completed', cert_earned: true },
  { course_id: 2, user_id: 27, in_progress: 'completed', cert_earned: true },

  { course_id: 3, user_id: 20, in_progress: 'completed', cert_earned: true },
  { course_id: 3, user_id: 25, in_progress: 'completed', cert_earned: true },
  { course_id: 3, user_id: 30, in_progress: 'completed', cert_earned: true },

  { course_id: 6, user_id: 19, in_progress: 'scheduled', cert_earned: false },
  { course_id: 6, user_id: 24, in_progress: 'scheduled', cert_earned: false },
  { course_id: 6, user_id: 29, in_progress: 'scheduled', cert_earned: false },

  { course_id: 8, user_id: 5, in_progress: 'scheduled', cert_earned: false },
  { course_id: 8, user_id: 10, in_progress: 'scheduled', cert_earned: false },
  { course_id: 8, user_id: 15, in_progress: 'scheduled', cert_earned: false },

  { course_id: 11, user_id: 4, in_progress: 'scheduled', cert_earned: false },
  { course_id: 11, user_id: 9, in_progress: 'scheduled', cert_earned: false },
  { course_id: 11, user_id: 14, in_progress: 'scheduled', cert_earned: false },
]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('course_registration').del()
  await knex('course_registration').insert(simplifiedCourseRegistration);
};
