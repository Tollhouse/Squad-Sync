const { RRule } = require('rrule');
const dayjs = require('dayjs');

const createSchedule = () => {
  const schedule = [];
  const shiftChanges = 3;
  const numberOfWeeks =4;
  let weekCount = 0;

  // Generate weekly dates using rrule
  const startDates = new RRule({
    freq: RRule.WEEKLY,
    count: numberOfWeeks * shiftChanges,
    dtstart: new Date(Date.UTC(2025, 3, 8)) // April 8, 2025
  }).all();

  for (i = 0; i < shiftChanges; i++) {
    for (j = 0; j < numberOfWeeks; j++) {
      const dateStart = dayjs(startDates[weekCount]);
      const dateEnd = dateStart.add(3, 'day'); // 4-day shift span (Mon–Thu)

      // weekend shift (added as a fixed offset of +4 days from start)
      const weekendStartDate = dateStart.add(4, 'day');
      const weekendEndDate = dateStart.add(6, 'day');
      schedule.push(
        {crew_id: ((i + 1) % 6) + 1, date_start: weekendStartDate.format('YYYY-MM-DD'), date_end: weekendEndDate.format('YYYY-MM-DD'), shift_type: 'Night', shift_duration: 12, experience_type: 'green'},
        {crew_id: ((i + 2) % 6) + 1, date_start: dateStart.format('YYYY-MM-DD'), date_end: dateEnd.format('YYYY-MM-DD'), shift_type: 'Night', shift_duration: 8, experience_type: 'red'},
        {crew_id: ((i + 3) % 6) + 1, date_start: dateStart.format('YYYY-MM-DD'), date_end: dateEnd.format('YYYY-MM-DD'), shift_type: 'Swing', shift_duration: 8, experience_type: 'yellow'},
        {crew_id: ((i + 4) % 6) + 1, date_start: dateStart.format('YYYY-MM-DD'), date_end: dateEnd.format('YYYY-MM-DD'), shift_type: 'Day', shift_duration: 8, experience_type: 'green'},
        {crew_id: ((i + 5) % 6) + 1, date_start: weekendStartDate.format('YYYY-MM-DD'), date_end: weekendEndDate.format('YYYY-MM-DD'), shift_type: 'Day', shift_duration: 12, experience_type: 'green'},
      )
      weekCount += 1;
    }
  }
  return schedule;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function seed(knex) {
  // Deletes ALL existing entries
  const newSchedule = createSchedule();
  await knex('crew_rotations').del();
  await knex('crew_rotations').insert(newSchedule);
};

module.exports = { seed };
