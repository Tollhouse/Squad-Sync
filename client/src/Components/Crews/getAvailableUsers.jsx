export async function getAvailableUsers(crew_id) {
  try {
    const [rotationsRes, schedulesRes] = await Promise.all([
      fetch("http://localhost:8080/crew_rotations"),
      fetch("http://localhost:8080/users/schedule"),
    ]);

    const [rotations, schedules] = await Promise.all([
      rotationsRes.json(),
      schedulesRes.json(),
    ]);

    // Get crew rotation dates
    const rotation = rotations.find((r) => r.crew_id === crew_id);
    if (!rotation) return [];

    const rotationStart = new Date(rotation.date_start);
    const rotationEnd = new Date(rotation.date_end);

    // Return users with no conflicts
    const availableUserIds = schedules
      .filter((user) => {
        return user.dates.every((event) => {
          const eventStart = new Date(event.date_start);
          const eventEnd = new Date(event.date_end);
          return eventEnd < rotationStart || eventStart > rotationEnd;
        });
      })
      .map((user) => user.user_id);

    return availableUserIds;
  } catch (err) {
    console.error("Error finding available crew members:", err);
    return [];
  }
}