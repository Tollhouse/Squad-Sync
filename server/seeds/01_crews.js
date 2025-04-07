/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE crews CASCADE');
  await knex('crews').del()
  await knex('crews').insert([
    {crew_name: 'Alpha'},
    {crew_name: 'Bravo'},
    {crew_name: 'Charlie'},
    {crew_name: 'Delta'},
    {crew_name: 'Echo'},
    {crew_name: 'Foxtrot'}
  ]);
};
