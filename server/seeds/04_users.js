const { faker } = require('@faker-js/faker');
const { hash } = require('bcryptjs');

/** Generate user data with hashed passwords */
async function generateUsers(numberOfUsers = 25, numberOfCrews = 6) {
  const roles = ['Crew Commander', 'Crew Chief', 'Operator'];
  const experience = ['green', 'yellow', 'red'];
  const userArray = [];
  const hashes = 2;
  userArray.push(
    {
      first_name: faker.person.firstName(),
      last_name: 'Sally',
      user_name: 'Sally',
      password: await hash('Sally', hashes),
      crew_id: Math.ceil(Math.random() * numberOfCrews),
      role: 'Scheduler',
      experience_type: experience[Math.floor(Math.random() * experience.length)],
      privilege: 'scheduler',
      flight: 'DOU'
    },
    {
      first_name: faker.person.firstName(),
      last_name: 'Curtis',
      user_name: 'Curtis',
      password: await hash('Curtis', hashes),
      crew_id: Math.ceil(Math.random() * numberOfCrews),
      role: 'Commander',
      experience_type: experience[Math.floor(Math.random() * experience.length)],
      privilege: 'commander',
      flight: 'DOU'
    },
    {
      first_name: faker.person.firstName(),
      last_name: 'Tory',
      user_name: 'Tory',
      password: await hash('Tory', hashes),
      crew_id: Math.ceil(Math.random() * numberOfCrews) + 1,
      role: 'Training Manager',
      experience_type: experience[Math.floor(Math.random() * experience.length)],
      privilege: 'training_manager',
      flight: 'DOT'
      }
  )

  for (let i = 0; i < numberOfUsers; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const user_name = first_name;
    const password = await hash(last_name, hashes);

    const user = {
      first_name,
      last_name,
      user_name,
      password,
      crew_id: Math.ceil(Math.random() * numberOfCrews) + 1,
      role: roles[Math.floor(Math.random() * roles.length)],
      experience_type: experience[Math.floor(Math.random() * experience.length)],
      privilege: 'user',
      flight: 'DOO'
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
