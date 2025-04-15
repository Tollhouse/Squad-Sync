export async function getAvailableUsers(crew_id, role) {
  try {
    const [rotationsRes, schedulesRes, usersRes] = await Promise.all([
      fetch("http://localhost:8080/crew_rotations"),
      fetch("http://localhost:8080/users/schedule"),
      fetch("http://localhost:8080/users"),
    ]);

    const [rotations, schedules, users] = await Promise.all([
      rotationsRes.json(),
      schedulesRes.json(),
      usersRes.json(),
    ]);

    // console.log("Rotations:", rotations);
    // console.log("Schedules:", schedules);
    // console.log("Users:", users);

    const rotation = rotations.find((r) => r.crew_id === crew_id);
    if (!rotation) {
      console.log(`No rotation found for crew_id: ${crew_id}`);
      return [];
    }

    const rotationStart = new Date(rotation.date_start);
    const rotationEnd = new Date(rotation.date_end);

    const certifiedUsers = users.filter((user) => {
      const extractUserIds = (obj) => {
        let userIds = [];
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            userIds = userIds.concat(extractUserIds(obj[key]));
          } else if (key === "id") {
            userIds.push(obj[key]);
          }
        }
        return userIds;
      };

      const userIds = extractUserIds(user);

      console.log(`User IDs for user ${user.id}:`, userIds);

      const userSchedule = schedules.find((schedule) => {
        const crewDatesUserIds = schedule.crewDates?.map((entry) => entry.user_id) || [];
        const courseDatesUserIds = schedule.courseDates?.map((entry) => entry.user_id) || [];
        const allUserIds = [...crewDatesUserIds, ...courseDatesUserIds];
        return userIds.some((id) => allUserIds.includes(id));
      });

      if (!userSchedule) {
        console.log(`No schedule found for user ${user.id}`);
        return false;
      }

      const crewCerts = userSchedule.crewDates
        ?.filter((entry) => entry.user_id === user.id)
        .map((entry) => entry.cert_granted) || [];
      const courseCerts = userSchedule.courseDates
        ?.filter((entry) => entry.user_id === user.id)
        .map((entry) => entry.cert_granted) || [];
      const allCerts = [...crewCerts, ...courseCerts];

      const uniqueCerts = [...new Set(allCerts)];

      console.log(`Unique Certifications for user ${user.id}:`, uniqueCerts);

      return uniqueCerts.includes(role);
    });

    const availableUserIds = schedules
      .filter((userSchedule) => {
        const crewDates = userSchedule.crewDates || []
        const courseDates = userSchedule.courseDates || []
        const allDates = [...crewDates, ...courseDates]

        return allDates.every((event) => {
          const eventStart = new Date(event.date_start);
          const eventEnd = new Date(event.date_end);
          return eventEnd < rotationStart || eventStart > rotationEnd;
        });
      })
      .map((userSchedule) => userSchedule.user_id);

    const availableUsers = certifiedUsers.filter((user) =>
      availableUserIds.includes(user.user_id)
    );

    console.log(`Available Users :`, availableUsers);

    return availableUsers;
  } catch (err) {
    console.error("Error finding available crew members:", err);
    return [];
  }
}