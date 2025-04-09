import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

export default function Scheduler() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, userRes, regRes, rotRes] = await Promise.all([
          fetch("http://localhost:8080/courses"),
          fetch("http://localhost:8080/users"),
          fetch("http://localhost:8080/course_registration"),
          fetch("http://localhost:8080/crew_rotations"),
        ]);

        const coursesData = await courseRes.json();
        const usersData = await userRes.json();
        const regData = await regRes.json();
        const rotData = await rotRes.json();

        setCourses(coursesData);
        setUsers(usersData);
        setRegistrations(regData);
        setRotations(rotData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading scheduler dashboard:", err);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Typography>Loading scheduler data...</Typography>;

  // 🧠 Compute available users (not in course or crew)
  const registeredUserIds = new Set(registrations.map((r) => r.user_id));
  const crewedUserIds = new Set(rotations.map((r) => r.user_id));

  const availableUsers = users.filter(
    (user) => !registeredUserIds.has(user.id) && !crewedUserIds.has(user.id)
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📅 Scheduler Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Available Courses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Available Courses</Typography>
            <ul>
              {courses.map((course) => (
                <li key={course.id}>{course.course_name}</li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Available Users */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Available for Course/Crew</Typography>
            <ul>
              {availableUsers.map((user) => (
                <li key={user.id}>
                  {user.first_name} {user.last_name} — {user.role}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Already Certified */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">🟢 Already Certified</Typography>
            <ul>
              {registrations
                .filter((r) => r.cert_earned)
                .map((reg) => {
                  const user = users.find((u) => u.id === reg.user_id);
                  const course = courses.find((c) => c.id === reg.course_id);
                  return (
                    user &&
                    course && (
                      <li key={reg.id}>
                        {user.first_name} {user.last_name} — {course.course_name}
                      </li>
                    )
                  );
                })}
            </ul>
          </Paper>
        </Grid>

        {/* Soon-to-be Certified */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">🔜 Soon to be Certified</Typography>
            <ul>
              {registrations
                .filter(
                  (r) =>
                    !r.cert_earned &&
                    new Date(r.date_end) > new Date()
                )
                .map((reg) => {
                  const user = users.find((u) => u.id === reg.user_id);
                  const course = courses.find((c) => c.id === reg.course_id);
                  return (
                    user &&
                    course && (
                      <li key={reg.id}>
                        {user.first_name} {user.last_name} — {course.course_name} by{" "}
                        {new Date(reg.date_end).toLocaleDateString()}
                      </li>
                    )
                  );
                })}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}