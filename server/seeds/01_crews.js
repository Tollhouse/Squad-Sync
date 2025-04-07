/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE crews CASCADE');
  await knex('crews').del()
  await knex('crews').insert([
    {id: 1, crew_name: 'Alpha'},
    {id: 2, crew_name: 'Bravo'},
    {id: 3, crew_name: 'Charlie'},
    {id: 4, crew_name: 'Delta'},
    {id: 5, crew_name: 'Echo'},
    {id: 6, crew_name: 'Foxtrot'}
  ]);
};
