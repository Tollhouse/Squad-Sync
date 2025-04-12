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
        setRegistrations(regData);
        setRotations(rotData);
        setCrews(crewsData);
        setLoading(false);
        console.log("registrations", regData);
      } catch (err) {
        console.error("Error loading scheduler data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {

    const flattenedRegistrations = registrations.flat();
    const flattenedUsers = users.flat();

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
        // console.warn(`No crew found for rotation ID: ${rotation.id}`);
        return null;
      }
        return {
          title: `${crew.crew_name} - ${rotation.shift_type}`,
          start: new Date(rotation.date_start),
          end: new Date(rotation.date_end),
          allDay: true,
        };
      });

    const allEvents = [...courseEvents, ...crewEvents].filter((event) => event !== null);
    setCalendarEvents(allEvents);
  }, [registrations, courses, users, rotations, crews]);

  return (
    <>
     <Box mt={6}>
            <div style={{ height: '500px' }}>
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '1200px' }}
                views={['month']}
                popup={true}
                onSelectEvent={(event) => setSelectedEvent(event)}
              />
            </div>
          </Box>
    </>
  )

}
