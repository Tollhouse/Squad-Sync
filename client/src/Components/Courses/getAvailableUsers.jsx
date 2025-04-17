export async function getAvailableUsers( course_id, role) {

try{
    const [courseRes, schedulesRes, usersRes] = await Promise.all([
      fetch("http://localhost:8080/courses"),
      fetch("http://localhost:8080/users/schedule"),
      fetch("http://localhost:8080/users"),
    ]);

    const [courses, schedules, users] = await Promise.all([
      courseRes.json(),
      schedulesRes.json(),
      usersRes.json(),
    ]);

    const course = courses.find((c) => c.id === course_id);
      if (!course) {
        console.log(`No course found for course_id: ${course_id}`);
        return [];
      }

      const courseStart = new Date(course.date_start);
      const courseEnd = new Date(course.date_end);

    const flattenedSchedules = schedules.flatMap((schedule) => schedule)

    const availableUsers = users.filter((user) => {

      const userSchedule = flattenedSchedules.find(
        (schedule) => schedule.user_id === user.id)

      if (!userSchedule || !userSchedule.dates) {
        return true;
      }

      const hasConflict = userSchedule.dates.some((event) => {
        const eventStart = new Date(event.date_start)
        const eventEnd = new Date(event.date_end)
        return eventEnd >= courseStart && eventStart <= courseEnd
      })
      return !hasConflict
    })

    return availableUsers

  } catch (err) {
    console.error("Error finding available crew members:", err)
    return []
  }

}
