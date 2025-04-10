import React, { useEffect, useState } from "react";
import Crews from '../Crews/Crews';
import { Box, Typography, Paper, Divider, Tabs, Tab } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Scheduler() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        console.error("Error loading scheduler data:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const events = registrations.map((r) => {
      const user = users.find((u) => u.id === r.user_id);
      const course = courses.find((c) => c.id === r.course_id);
      return {
        title: `${user?.first_name} ${user?.last_name} - ${course?.course_name}`,
        start: new Date(course?.date_start),
        end: new Date(course?.date_end),
        allDay: true,
        cert_earned: r.cert_earned,
      };
    });
    setCalendarEvents(events);
  }, [registrations, courses, users]);

  if (loading) return <Typography>Loading scheduler data...</Typography>;

  const registeredUserIds = new Set(registrations.map((r) => r.user_id));
  const crewedUserIds = new Set(rotations.map((r) => r.user_id));
  const availableUsers = users.filter(
    (user) => !registeredUserIds.has(user.id) && !crewedUserIds.has(user.id)
  );

  const calculateDaysUntilCertification = (certDate) => {
    const today = new Date();
    return Math.ceil((new Date(certDate) - today) / (1000 * 3600 * 24));
  };

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

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: 700 }}>
        🗓️ Scheduler Dashboard
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Available for Course/Crew" />
        <Tab label="Soon to be Certified" />
        <Tab label="Certified Members & Their Certifications" />
        <Tab label="Crews" />
      </Tabs>

      <Box sx={{ display: tabIndex === 0 ? "block" : "none" }}>
        <Paper elevation={3} sx={{ p: 2, minHeight: 350, maxHeight: '350px', overflowY: 'auto' }}>
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
      </Box>

      <Box sx={{ display: tabIndex === 1 ? "block" : "none" }}>
        <Paper elevation={3} sx={{ p: 2, minHeight: 350, maxHeight: '350px', overflowY: 'auto' }}>
          <Typography variant="h6"><HourglassTopIcon sx={{ mr: 1 }} />Soon to be Certified</Typography>
          <Divider sx={{ my: 1 }} />
          <ul>
            {upcomingCertifications.map(({ user, course, daysLeft }, index) => {
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
      </Box>

      <Box sx={{ display: tabIndex === 2 ? "block" : "none" }}>
        <Paper elevation={3} sx={{ p: 2, minHeight: 350, maxHeight: '350px', overflowY: 'auto' }}>
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
      </Box>

      <Box sx={{ display: tabIndex === 3 ? "block" : "none" }}>
        <Crews />
      </Box>

      <Box mt={6}>
        <div style={{ height: '500px' }}>
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month']}
            popup={true}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        </div>
      </Box>

      {selectedEvent && (
        <Box mt={2} sx={{ p: 3, backgroundColor: "#1e1e1e", borderRadius: 2, color: "white" }}>
          <Typography variant="h6" gutterBottom>📋 Event Details</Typography>
          <Typography><strong>Title:</strong> {selectedEvent.title}</Typography>
          <Typography><strong>Start:</strong> {selectedEvent.start.toDateString()}</Typography>
          <Typography><strong>End:</strong> {selectedEvent.end.toDateString()}</Typography>
          <Typography><strong>Certification Earned:</strong> {selectedEvent.cert_earned ? "✅ Yes" : "❌ No"}</Typography>
          <Box mt={2}>
            <button
              style={{
                padding: "6px 12px",
                backgroundColor: "#444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </Box>
        </Box>
      )}
    </Box>
  );
}