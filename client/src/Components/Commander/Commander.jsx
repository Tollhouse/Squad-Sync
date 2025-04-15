// Code written by Essence

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Fade,
  Divider,
  Stack,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Commander() {
  const location = useLocation();
  const user = location.state?.user;

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [crewRotations, setCrewRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();

  const today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) { dd='0'+dd; }
  if(mm<10) { mm='0'+mm; }
  const todaysDate = yyyy + '-' + mm + '-' + dd;
  // console.log(todaysDate);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, coursesRes, regRes, crewRes] = await Promise.all([
          fetch("http://localhost:8080/users"),
          fetch("http://localhost:8080/courses"),
          fetch("http://localhost:8080/course_registration"),
          fetch("http://localhost:8080/crew_rotations"),
        ]);

        const [usersData, coursesData, regData, crewData] = await Promise.all([
          usersRes.json(),
          coursesRes.json(),
          regRes.json(),
          crewRes.json(),
        ]);

        setUsers(usersData);
        setCourses(coursesData);
        setRegistrations(regData);
        setCrewRotations(crewData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching commander data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const certifiedCount = registrations.filter((reg) => reg.cert_earned).length;
  const crewCount = [...new Set(users.map((user) => user.crew_id))].length;
  const experienceStats = {
    red: users.filter((u) => u.experience_type === "Red").length,
    yellow: users.filter((u) => u.experience_type === "Yellow").length,
    green: users.filter((u) => u.experience_type === "Green").length,
  };

  const chartData = {
    labels: ["Red", "Yellow", "Green"],
    datasets: [
      {
        label: "Experience Level Distribution",
        data: [experienceStats.red, experienceStats.yellow, experienceStats.green],
        backgroundColor: ["#f44336", "#ffeb3b", "#4caf50"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
            weight: "bold",
          },
          beginAtZero: true,
        },
      },
    },
  };
  return (
    <Fade in={!loading}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🧭 Commander Dashboard
        </Typography>

        {/* Summary Panel */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">🎓 Certified Users</Typography>
                <Typography variant="h5" align="center">{certifiedCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">👥 Total Crews</Typography>
                <Typography variant="h5" align="center">{crewCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => {
                // console.log(newIndex)
                setTabIndex(newIndex)}}
              variant="scrollable"
              scrollButtons="auto"
              centered
            >
              <Tab label="👥 Squadron Personnel" />
              <Tab label="📘 Training Courses" />
              <Tab label="🎓 Course Assignments" />
              <Tab label="🕓 Crew Construct" />
            </Tabs>

            {/* Tab Panels */}
            <Box sx={{ mt: 2 }}>
              {tabIndex === 0 && (
                <Grid container spacing={2}>
                  {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                      <Chip
                        label={`${user.first_name} ${user.last_name} — ${user.role} (${user.experience_type})`}
                        color="default"
                        variant="outlined"
                        role='chip'
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {tabIndex === 1 && (
                <Stack spacing={1}>
                  {courses.filter((course) => (course.date_end > todaysDate))
                  .map((course) => (
                    <Box key={course.id}>
                      <Typography variant="body1">
                        {course.course_name}{" "}
                        <Typography component="span" color="text.secondary">
                          (Start: {course.date_start}, End: {course.date_end})
                        </Typography>
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Stack>
              )}

              {tabIndex === 2 && (
                <Box
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Stack spacing={1}>
                    {registrations.map((reg) => {
                      const user = users.find((u) => u.id === reg.user_id);
                      const course = courses.find((c) => c.id === reg.course_id);
                      return user && course ? (
                        <Box key={reg.id}>
                          <Typography variant="body2">
                            {user.first_name} {user.last_name} is {reg.in_progress} for{" "}
                            {course.course_name} —{" "}
                            {reg.cert_earned ? "✅ Certified" : "🕒 Not Yet Certified"}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                        </Box>
                      ) : null;
                    })}
                  </Stack>
                </Box>
              )}

              {tabIndex === 3 && (
                <Stack spacing={1}>
                  {crewRotations.map((shift) => (
                    <Box key={shift.id}>
                      <Typography variant="body2">
                        Crew #{shift.crew_id} — <strong>{shift.shift_type}</strong> shift from{" "}
                        {shift.date_start} to {shift.date_end} | Duration: {shift.shift_duration} hrs | Experience:{" "}
                        {shift.experience_type}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" align="center">📊 Experience Distribution</Typography>
            <Box sx={{ height: 400 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              <Chip label="Red = Low Experience" style={{ backgroundColor: "#f44336", color: "white" }} />
              <Chip label="Yellow = Medium Experience" style={{ backgroundColor: "#ffeb3b", color: "black" }} />
              <Chip label="Green = High Experience" style={{ backgroundColor: "#4caf50", color: "white" }} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Fade>
  );
}