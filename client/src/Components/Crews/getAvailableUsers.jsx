export async function getAvailableUsers(crew_id) {
  try {
    const [rotationsRes, schedulesRes, usersRes] = await Promise.all([
      fetch("http://localhost:8080/crew_rotations"),
      fetch("http://localhost:8080/users/userSchedule"),
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

    console.log("Schedules", schedules);

    const certifiedUsers = users.filter((user) => {
      user.certifications.includes(role)
    })

    const availableUserIds = schedules
      .filter((user) => {
        return user.dates.every((event) => {
          const eventStart = new Date(event.date_start);
          const eventEnd = new Date(event.date_end);
          return eventEnd < rotationStart || eventStart > rotationEnd;
        });
      })
      .map((user) => user.user_id);

    return certifiedUsers.filter((user) => availableUserIds.includes(user.user_id))
      .map((user) => ({
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        certifications: user.certifications
      }));
  } catch (err) {
    console.error("Error finding available crew members:", err);
    return [];
  }
}