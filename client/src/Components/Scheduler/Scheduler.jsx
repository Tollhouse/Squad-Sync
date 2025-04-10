import React, { useEffect, useState } from "react";
import Crews from '../Crews/Crews';
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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

  const registeredUserIds = new Set(registrations.map((r) => r.user_id));
  const crewedUserIds = new Set(rotations.map((r) => r.user_id));
  const availableUsers = users.filter(
    (user) => !registeredUserIds.has(user.id) && !crewedUserIds.has(user.id)
  );

  const soonToBeCertifiedSet = new Set(); // for duplicate filtering

  // Function to calculate how many days until certification
  const calculateDaysUntilCertification = (certDate) => {
    const today = new Date();
    return Math.ceil((new Date(certDate) - today) / (1000 * 3600 * 24));
  };

  // Sorting certifications by due date
  const upcomingCertifications = registrations
    .filter((r) => {
      const course = courses.find((c) => c.id === r.course_id);
      return course && !r.cert_earned && new Date(course.date_end) > new Date();
    })
    .map((r) => {
      const user = users.find((u) => u.id === r.user_id);
      const course = courses.find((c) => c.id === r.course_id);
      return { user, course, daysLeft: calculateDaysUntilCertification(course.date_end) };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: 700 }}>
        🗓️ Scheduler Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Available Members for Crews */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 350, overflowY: 'auto' }}>
            <Typography variant="h6"><GroupIcon sx={{ mr: 1 }} />Available for Course/Crew</Typography>
            <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'lightgray' }}>
              ✅ Users listed here are not enrolled in any course AND not assigned to a crew.
            </Typography>
            <Divider sx={{ my: 1 }} />
            <ul>
              {availableUsers.map((user) => (
                <li key={user.id}>
                  {user.first_name} {user.last_name} — {user.role}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Upcoming Certifications */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 350, overflowY: 'auto' }}>
            <Typography variant="h6"><HourglassTopIcon sx={{ mr: 1 }} />Soon to be Certified</Typography>
            <Divider sx={{ my: 1 }} />
            <ul>
              {upcomingCertifications.map(({ user, course, daysLeft }, index) => {
                // Urgency coloring based on days until certification
                let urgencyColor = 'inherit';
                if (daysLeft <= 7) urgencyColor = 'red';
                else if (daysLeft <= 10) urgencyColor = 'orange';

                return (
                  <li key={index} style={{ color: urgencyColor }}>
                    {user.first_name} {user.last_name} — {course.course_name} by{" "}
                    {new Date(course.date_end).toLocaleDateString()}{" "}
                    {daysLeft <= 7 && <span style={{ fontWeight: 'bold' }}>⚠️ Urgent!</span>}
                  </li>
                );
              })}
            </ul>
          </Paper>
        </Grid>

        {/* Certified Members */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 350, overflowY: 'auto' }}>
            <Typography variant="h6"><CheckCircleIcon sx={{ mr: 1 }} />Already Certified</Typography>
            <Divider sx={{ my: 1 }} />
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

        {/* Certified Members & Their Certifications */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6"><WorkspacePremiumIcon sx={{ mr: 1 }} />Certified Members & Their Certifications</Typography>
            <Divider sx={{ my: 1 }} />
            <ul>
              {users.map((user) => {
                const earnedCourses = registrations
                  .filter((r) => r.user_id === user.id && r.cert_earned)
                  .map((r) => {
                    const course = courses.find((c) => c.id === r.course_id);
                    return course ? course.course_name : null;
                  })
                  .filter(Boolean);

                return earnedCourses.length > 0 ? (
                  <li key={user.id}>
                    <strong>{user.first_name} {user.last_name}</strong>: {earnedCourses.join(", ")}
                  </li>
                ) : null;
              })}
            </ul>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Crews Section Below the Main Dashboard */}
      <Box mt={6}>
        <Crews /> {/* Crews component added here */}
      </Box>
    </Box>
  );
}