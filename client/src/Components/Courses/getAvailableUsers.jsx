export async function getAvailableUsers( course_id, role) {

try{
    const [courseRes, schedulesRes, usersRes, certRes] = await Promise.all([
      fetch("http://localhost:8080/courses"),
      fetch("http://localhost:8080/users/schedule"),
      fetch("http://localhost:8080/users"),
      fetch("http://localhost:8080/users/user/schedule"),
    ]);

    const [courses, schedules, users, certs] = await Promise.all([
      courseRes.json(),
      schedulesRes.json(),
      usersRes.json(),
      certRes.json()
    ]);

    const course = courses.find((c) => c.id === course_id);
      if (!course) {
        console.log(`No course found for course_id: ${course_id}`);
        return [];
      }

      const courseStart = new Date(courses.date_start);
      const courseEnd = new Date(courses.date_end);

      console.log("course", course);
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

    const flattenedCerts = certs.flatMap((cert) => cert.courseDates?.map((course) => ({
      user_id: course.user_id,
      cert_granted: course.cert_granted
    })) || [])

    const certifiedRoles = ["Crew Commander", "Crew Chief", "Operator", "Instructor", "Delta Exercise"]
    const certifiedUsers = availableUsers.filter((user)=>{
      return flattenedCerts.some((cert) =>
        cert.user_id === user.id && cert.cert_granted !== role
    )
    })

    return certifiedUsers

  } catch (err) {
    console.error("Error finding available crew members:", err)
    return []
  }

}
