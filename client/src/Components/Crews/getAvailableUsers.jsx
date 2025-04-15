export async function getAvailableUsers(crew_id, role) {
try{
    const [rotationsRes, schedulesRes, usersRes, certRes] = await Promise.all([
      fetch("http://localhost:8080/crew_rotations"),
      fetch("http://localhost:8080/users/schedule"),
      fetch("http://localhost:8080/users"),
      fetch("http://localhost:8080/users/user/schedule"),
    ]);

    const [rotations, schedules, users, certs] = await Promise.all([
      rotationsRes.json(),
      schedulesRes.json(),
      usersRes.json(),
      certRes.json()
    ]);

    const rotation = rotations.find((r) => r.crew_id === crew_id);
      if (!rotation) {
        console.log(`No rotation found for crew_id: ${crew_id}`);
        return [];
      }

      const rotationStart = new Date(rotation.date_start);
      const rotationEnd = new Date(rotation.date_end);

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
        return eventEnd >= rotationStart && eventStart <= rotationEnd
      })
      return !hasConflict
    })

    const flattenedCerts = certs.flatMap((cert) => cert.courseDates?.map((course) => ({
      user_id: course.user_id,
      cert_granted: course.cert_granted
    })) || [])

    const certifiedRoles = ["Crew Commander", "Crew Chief", "Operator"]
    const certifiedUsers = availableUsers.filter((user)=>{
      return flattenedCerts.some((cert) =>
        cert.user_id === user.id && cert.cert_granted === role
    )
    })

    return certifiedUsers
  } catch (err) {
    console.error("Error finding available crew members:", err)
    return []
  }

}
