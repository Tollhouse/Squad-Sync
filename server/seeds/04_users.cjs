const { faker } = require('@faker-js/faker');
const { hash } = require('bcryptjs');

/** Generate user data with hashed passwords */
async function generateUsers(numberOfUsers = 25, numberOfCrews = 6) {
  const roles = ['Crew Commander', 'Crew Chief', 'Operator'];
  const experience = ['green', 'yellow', 'red'];
  const userArray = [];

  for (let i = 0; i < numberOfUsers; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.firstName();
    const user_name = first_name;
    // const password = await hash(last_name, 12);
    const password = await hash(last_name, 2);

    const user = {
      first_name,
      last_name,
      user_name,
      password,
      crew_id: Math.ceil(Math.random() * numberOfCrews),
      role: roles[Math.floor(Math.random() * roles.length)],
      experience_type: experience[Math.floor(Math.random() * experience.length)],
    };

    userArray.push(user);
  }

  return userArray;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function seed(knex) {
  const users = await generateUsers();
  await knex('users').del();
  await knex('users').insert(users);
}

module.exports = { seed };
