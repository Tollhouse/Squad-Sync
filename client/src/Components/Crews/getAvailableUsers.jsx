export async function getAvailableUsers(crew_id) {
  try {
    const [rotationsRes, schedulesRes, usersRes] = await Promise.all([
      fetch("http://localhost:8080/crew_rotations"),
      fetch("http://localhost:8080/users/schedule"),
      fetch("http://localhost:8080/users")
    ]);

    const [rotations, schedules, users] = await Promise.all([
      rotationsRes.json(),
      schedulesRes.json(),
      usersRes.json()
    ]);

    // Get crew rotation dates
    const rotation = rotations.find((r) => r.crew_id === crew_id);
    if (!rotation) return [];

    const rotationStart = new Date(rotation.date_start);
    const rotationEnd = new Date(rotation.date_end);

    const certifiedUsers = users.filter((user) => {
      const userSchedule = schedules.find((schedule) => schedule.user_id === user.id);
      const courseCerts = userSchedule?.courseDates?.map((user) => {
      const courseDatesData = user.courseDates?.map((u) => u.cert_granted) || [];
      const flattenedCourseData = [...courseCerts].flat();
      return flattenedCourseData.includes(user.role);
      })
    })

    const availableUserIds = schedules
      .filter((userSchedule) => {
        const dates = userSchedule.dates || [];
        return dates.every((event) => {
          const eventStart = new Date(event.date_start);
          const eventEnd = new Date(event.date_end);
          return eventEnd < rotationStart || eventStart > rotationEnd;
        });
      })
      .map((userSchedule) => userSchedule.user_id);

    return certifiedUsers.filter((user) => availableUserIds.includes(user.user_id))
      .map((user) => ({
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        certifications: user.cert_granted
      }));
  } catch (err) {
    console.error("Error finding available crew members:", err);
    return [];
  }
}