const { faker } = require('@faker-js/faker');
const { hash } = require('bcryptjs');

/** Generate user data with hashed passwords */
async function generateUsers() {
  const numberOfUsers = 30;
  const numberOfNewUsers = 5;
  const roles = ['Crew Commander', 'Crew Chief', 'Operator'];
  const experience = ['green', 'yellow', 'red'];
  const userArray = [];
  const hashes = 2;

  let crew = 0;
  for (let i = 0; i < numberOfUsers; i++) {
    let crewRole = roles[2];
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const user_name = first_name;
    const password = await hash(last_name, hashes);
    let experience_type = 'green';
    if (i % 5 == 0) {
      crew += 1;
      crewRole = roles[0];
    } else if ((i - 1) % 5 == 0) {
      crewRole = roles[1];
    } else if ((i - 3) % 5 == 0) {
      experience_type = 'yellow';
    } else if ((i - 4) % 5 == 0) {
      experience_type = 'red';
    }

    const user = {
      first_name,
      last_name,
      user_name,
      password,
      crew_id: crew,
      role: crewRole,
      experience_type: experience_type,
      privilege: 'user',
      flight: 'DOO'
    };

    userArray.push(user);
  }
  for (let i = 0; i < numberOfNewUsers; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const user_name = first_name;
    const password = await hash(last_name, hashes);

    const user = {
      first_name,
      last_name,
      user_name,
      password,
      crew_id: 7,
      role: 'Training',
      experience_type: 'red',
      privilege: 'user',
      flight: 'DOO'
    };

    userArray.push(user);
  }
  userArray.push(
    {
      first_name: faker.person.firstName(),
      last_name: 'Sally',
      user_name: 'Sally',
      password: await hash('Sally', hashes),
      crew_id: 7,
      role: 'Scheduler',
      experience_type: 'green',
      privilege: 'scheduler',
      flight: 'DOU'
    },
    {
      first_name: faker.person.firstName(),
      last_name: 'Curtis',
      user_name: 'Curtis',
      password: await hash('Curtis', hashes),
      crew_id: 7,
      role: 'Commander',
      experience_type: 'yellow',
      privilege: 'commander',
      flight: 'DOU'
    },
    {
      first_name: faker.person.firstName(),
      last_name: 'Tory',
      user_name: 'Tory',
      password: await hash('Tory', hashes),
      crew_id: 7,
      role: 'Training Manager',
      experience_type: 'green',
      privilege: 'training_manager',
      flight: 'DOT'
      }
  )

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
