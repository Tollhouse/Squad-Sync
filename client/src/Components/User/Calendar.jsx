//Authored by Curtis
import React, { useEffect, useState } from "react";
import Crews from '../Crews/Crews';
import { Box, Typography, Paper, Divider, Tabs, Tab } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useParams } from 'react-router-dom'

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const { id } = useParams()
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [crews, setCrews] = useState([]);
  const [filterCrew, setFilterCrew] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [currentView, setCurrentView] = useState("month");

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, userRes, regRes, rotRes, crewsRes] = await Promise.all([
          fetch(`http://localhost:8080/courses`),
          fetch(`http://localhost:8080/users/${id}`),
          fetch(`http://localhost:8080/course_registration/${id}`),
          fetch(`http://localhost:8080/crew_rotations`),
          fetch(`http://localhost:8080/crews`),
        ]);

        const coursesData = await courseRes.json();
        const usersData = await userRes.json();
        const regData = await regRes.json();
        const rotData = await rotRes.json();
        const crewsData = await crewsRes.json();

        setCourses(coursesData);
        setUsers([usersData]);
        setRegistrations(Array.isArray(regData) ? regData : []);
        setRotations(rotData);
        setCrews(crewsData);
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
    }

    const flattenedRegistrations = registrations.flat();
    const flattenedUsers = Array.isArray(users) ? users.flat() : [];

    const flattenedCourses = courses.flat();
    const courseEvents = flattenedRegistrations.map((r) => {
      const user = flattenedUsers.find((u) => u.id === r.user_id);
      const course = flattenedCourses.find((c) => c.id === r.course_id);

      return {
        title: `${users[0].first_name} ${users[0].last_name} - ${course.course_name}`,
        start: new Date(course?.date_start),
        end: new Date(course?.date_end),
        allDay: true,
        cert_earned: r.cert_earned,
      };
    });

    const flattenedRotations = rotations.flat();
    flattenedRotations.forEach((rotation) => {
      if (!rotation.crew_id) {
        console.warn(`Rotation ID ${rotation.id} is missing a crew_id.`);
      }
    });

    const crewEvents = flattenedRotations.map((rotation) => {
      const crew = users.find((u) => u.crew_id === rotation.crew_id);
      if (!crew) {
        return null;
      }

      const emojiMap = {
        green: "🟢",
        yellow: "🟡",
        red: "🔴",
      };

      const experienceMapping = rotation.experience_type?.toLowerCase();
      const emoji = emojiMap[experienceMapping] || "⚪";

      const shiftMapping = rotation.shift_type?.toLowerCase();
      const timeRange = shiftTimeMap[shiftMapping] || "N/A";

      const startDate = new Date(rotation.date_start);
      const endDate = new Date(rotation.date_end);

      let shiftStart = new Date(startDate);
      let shiftEnd = new Date(endDate);

      if (rotation.shift_type === "day") {
        shiftStart.setHours(6, 0, 0);
        shiftEnd.setHours(14, 0, 0);
      } else if (rotation.shift_type === "swing") {
        shiftStart.setHours(14, 0, 0);
        shiftEnd.setHours(22, 0, 0);
      } else if (rotation.shift_type === "night") {
        shiftStart.setHours(22, 0, 0);
        shiftEnd.setDate(shiftEnd.getDate() + 1); // Extend to the next day
        shiftEnd.setHours(6, 0, 0);
      }

      return {
        title: `${crew.crew_name} - ${rotation.shift_type} (${timeRange}) ${emoji}`,
        start: shiftStart,
        end: shiftEnd,
        allDay: false,
        cert_earned: null,
        experience_type: rotation.experience_type,
        shift_type: rotation.shift_type,
        crew_id: rotation.crew_id,
      };
    });

    const allEvents = [...courseEvents, ...crewEvents].filter((event) => event !== null);
    setCalendarEvents(allEvents);
  }, [registrations, courses, users, rotations, crews]);

  const filteredEvents = calendarEvents.filter((event) => {
    const matchCrew = filterCrew === "all" || event.crew_id === Number(filterCrew);
    const matchShift = filterShift === "all" || event.shift_type === filterShift;
    return matchCrew && matchShift;
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '97vw',
          height: '100vh',
          overflow: 'hidden',
        }}
        >
        <div style={{ flexGrow: 1, width: '100%', height: '100%' }}>
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

              const experienceColor = shiftColors[event.experience_type?.toLowerCase()];
              const shiftColor = shiftColors[event.shift_type?.toLowerCase()];

              const bgColor =
                event.cert_earned === null
                  ? experienceColor || shiftColor || "#90a4ae"
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
    </>
  )

}
