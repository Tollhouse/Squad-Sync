import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';
// const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 12;
    return hashSync(password, saltRounds);
};

const numberOfUsers = 25;
const numberOfCrews = 6;
const roles = ['Crew Commander', 'Crew Chief', 'Operator'];
const experience = ['green', 'yellow', 'red'];
const userArray = [];

for (let i = 0; i < numberOfUsers; i++) {
  let inputItem = {};
  inputItem.first_name = faker.person.firstName();
  inputItem.last_name = faker.person.firstName();
  inputItem.user_name = inputItem.first_name;
  let hashedPassword = hashPassword(inputItem.last_name).then((password) => inputItem.password = password);
  inputItem.crew_id = Math.ceil(Math.random() * numberOfCrews);
  inputItem.role = roles[Math.floor(Math.random() * roles.length)];
  inputItem.experience_type = experience[Math.floor(Math.random() * experience.length)];
  userArray.push(inputItem);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert(userArray);
}

// export default { seed };
