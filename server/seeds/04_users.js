import { faker } from '@faker-js/faker';

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
  inputItem.password = inputItem.last_name;
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
};
