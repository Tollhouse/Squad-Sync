// Code written by Essence

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
  const [filterCrew, setFilterCrew] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [currentView, setCurrentView] = useState("month");

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
    const shiftTimeMap = {
      day: "6AM–2PM",
      swing: "2PM–10PM",
      night: "10PM–6AM"
    };

    const registrationEvents = registrations.map((r) => {
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

    const crewEvents = rotations.map((rotation) => {
      const emojiMap = {
        green: "🟢",
        yellow: "🟡",
        red: "🔴",
      };


      const emoji = emojiMap[rotation.experience_type?.toLowerCase()] || "⚪";

      const startDate = new Date(rotation.date_start);
      const endDate = new Date(rotation.date_end);
      // console.log("rotation", rotation);
      return {
        title: `${rotation.crew_name} Crew - ${rotation.shift_type} ${emoji}`,
        start: startDate,
        end: endDate,
        allDay: true,
        cert_earned: null,
        experience_type: rotation.experience_type,
        shift_type: rotation.shift_type,
        crew_id: rotation.crew_id,
      };
    });

    setCalendarEvents([...registrationEvents, ...crewEvents]);
  }, [registrations, courses, users, rotations]);

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

  const filteredEvents = calendarEvents.filter((event) => {
    const matchCrew = filterCrew === "all" || event.crew_id === Number(filterCrew);
    const matchShift = filterShift === "all" || event.shift_type === filterShift;
    return matchCrew && matchShift;
  });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: 700 }}>
        🗓️ Scheduler Dashboard
      </Typography>

      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
        <Tab label="Available for Course/Crew" />
        <Tab label="Soon to be Certified" />
        <Tab label="Certified Members & Their Certifications" />
        {/* <Tab label="Crews" /> */}
      </Tabs>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6"><GroupIcon sx={{ mr: 1 }} />Available for Course/Crew</Typography>
          <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'gray' }}>
            ✅ Users listed here are not enrolled in any course AND not assigned to a crew.
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    {availableUsers.map((user) => (
      <li key={user.id}>
        {user.first_name} {user.last_name} — {user.role}
      </li>
    ))}
  </ul>
</Box>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6"><HourglassTopIcon sx={{ mr: 1 }} />Soon to be Certified</Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    {upcomingCertifications.map(({ user, course, daysLeft }, index) => {
      let urgencyColor = 'inherit';
      if (daysLeft <= 7) urgencyColor = 'red';
      else if (daysLeft <= 10) urgencyColor = 'orange';
      return (
        <li key={index} style={{ color: urgencyColor }}>
          {user.first_name} {user.last_name} — {course.course_name} by{" "}
          {new Date(course.date_end).toLocaleDateString()}
          {daysLeft <= 7 && <strong> ⚠️ Urgent!</strong>}
        </li>
      );
    })}
  </ul>
</Box>
        </Paper>
      )}

      {tabIndex === 2 && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6"><WorkspacePremiumIcon sx={{ mr: 1 }} />Certified Members & Their Certifications</Typography>
          <Divider sx={{ my: 1 }} />
          <ul>
            {users.map((user) => {
              const earnedCourses = registrations
                .filter((r) => r.user_id === user.id && r.cert_earned)
                .map((r) => courses.find((c) => c.id === r.course_id)?.course_name)
                .filter(Boolean);
              return earnedCourses.length > 0 ? (
                <li key={user.id}><strong>{user.first_name} {user.last_name}</strong>: {earnedCourses.join(", ")}</li>
              ) : null;
            })}
          </ul>
        </Paper>
      )}

      {tabIndex === 3 && <Crews />}

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
        <label>
          Filter by Crew:
          <select value={filterCrew} onChange={(e) => setFilterCrew(e.target.value)}>
            <option value="all">All</option>
            {[...new Set(rotations.map(r => r.crew_id))].map(id => (
              <option key={id} value={id}>Crew {id}</option>
            ))}
          </select>
        </label>
        <label>
          Filter by Shift Type:
          <select value={filterShift} onChange={(e) => setFilterShift(e.target.value)}>
            <option value="all">All</option>
            <option value="day">Day</option>
            <option value="swing">Swing</option>
            <option value="night">Night</option>
          </select>
        </label>
        <label>
          View:
          <select value={currentView} onChange={(e) => setCurrentView(e.target.value)}>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </label>
      </Box>

      <Box>
        <div style={{ height: '600px' }}>
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            popup
            style={{ height: '100%' }}
            onSelectEvent={(event) => setSelectedEvent(event)}
            min={new Date(2025, 0, 1, 6, 0)}
            max={new Date(2025, 0, 1, 23, 59)}
            eventPropGetter={(event) => {
              const shiftColors = {
                green: "#4caf50",
                yellow: "#fdd835",
                red: "#f44336",
                day: "#81c784",
                swing: "#ffb74d",
                night: "#9575cd",
                rest: "#4dd0e1"
              };
              const bgColor = event.cert_earned === null
              ? shiftColors[event.shift_type?.toLowerCase()]     // prefer shift_type
                || shiftColors[event.experience_type?.toLowerCase()]
                || "#90a4ae" // fallback gray
              : "#1976d2";
              return {
                style: {
                  backgroundColor: bgColor,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                  whiteSpace: "normal",
                  textAlign: "center",
                }
              };
            }}
          />
        </div>
      </Box>

      {selectedEvent && (
        <Box sx={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          backgroundColor: "#1e1e1e",
          color: "white",
          borderRadius: 2,
          padding: 3,
          minWidth: 300,
          boxShadow: 24
        }}>
          <Typography variant="h6" gutterBottom>📋 Event Details</Typography>
          <Typography><strong>Title:</strong> {selectedEvent.title}</Typography>
          <Typography><strong>Start:</strong> {selectedEvent.start.toString()}</Typography>
          <Typography><strong>End:</strong> {selectedEvent.end.toString()}</Typography>
          {selectedEvent.cert_earned !== null && (
            <Typography>
              <strong>Certification Earned:</strong> {selectedEvent.cert_earned ? "✅ Yes" : "❌ No"}
            </Typography>
          )}
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