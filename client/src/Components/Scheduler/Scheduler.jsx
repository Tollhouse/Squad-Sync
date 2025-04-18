// Code written by Essence

import React, { useEffect, useState } from "react";
import Crews from "../Crews/Crews";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Scheduler.css"

const localizer = momentLocalizer(moment);

export default function Scheduler() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCrew, setFilterCrew] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [currentView, setCurrentView] = useState("month");
  const [crewsWithOnlyRed, setCrewsWithOnlyRed] = useState([]);
  const [overlapWarnings, setOverlapWarnings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, userRes, regRes, rotRes, crewRes] = await Promise.all(
          [
            fetch("http://localhost:8080/courses"),
            fetch("http://localhost:8080/users"),
            fetch("http://localhost:8080/course_registration"),
            fetch("http://localhost:8080/crew_rotations"),
            fetch("http://localhost:8080/crews"),
          ]
        );

        const coursesData = await courseRes.json();
        const usersData = await userRes.json();
        const regData = await regRes.json();
        const rotData = await rotRes.json();
        const crewData = await crewRes.json();

        setCourses(coursesData);
        setUsers(usersData);
        setRegistrations(regData);
        setRotations(rotData);
        setCrews(crewData);
        setLoading(false);

        const crewExperience = {};
        usersData.forEach((user) => {
          if (!crewExperience[user.crew_id])
            crewExperience[user.crew_id] = new Set();
          crewExperience[user.crew_id].add(user.experience_type?.toLowerCase());
        });

        const onlyRedCrews = crewData.filter((crew) => {
          const experiences = crewExperience[crew.id];
          return (
            experiences && experiences.size === 1 && experiences.has("red")
          );
        });

        setCrewsWithOnlyRed(onlyRedCrews);
      } catch (err) {
        console.error("Error loading scheduler data:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const registrationEvents = registrations.map((r) => {
      const user = users.find((u) => u.id === r.user_id);
      const course = courses.find((c) => c.id === r.course_id);
      return {
        title: `${user?.first_name} ${user?.last_name} - ${course?.course_name}`,
        start: new Date(`${course?.date_start}T12:00:00`),
        end: new Date(`${course?.date_end}T12:00:00`),
        allDay: true,
        cert_earned: r.cert_earned,
        tooltip: `${user?.first_name} ${user?.last_name}\n${
          course?.course_name
        }\n${moment(course?.date_start).format("h:mm A")} – ${moment(
          course?.date_end
        ).format("h:mm A")}`,
      };
    });

    const crewEvents = [];
    const shiftMap = {};
    const conflictMap = {};

    rotations.forEach((rotation) => {
      const emojiMap = {
        green: "🟢",
        yellow: "🟡",
        red: "🔴",
      };

      const crew = crews.find((c) => c.id === rotation.crew_id);
      const crewName = crew?.crew_name || "Unknown";
      const current = new Date(`${rotation.date_start}T12:00:00`);
      const end = new Date(`${rotation.date_end}T12:00:00`);

      while (current <= end) {
        // const start = new Date(current);
        const eventStart = new Date(current);
        const eventEnd = new Date(current);

        switch (rotation.shift_type?.toLowerCase()) {
          case "day":
            eventStart.setHours(6, 0, 0);
            eventEnd.setHours(14, 0, 0);
            break;
          case "swing":
            eventStart.setHours(14, 0, 0);
            eventEnd.setHours(22, 0, 0);
            break;
          case "night":
            eventStart.setHours(22, 0, 0);
            eventEnd.setDate(eventEnd.getDate() + 1);
            eventEnd.setHours(6, 0, 0);
            break;
          case "rest":
            eventStart.setHours(8, 0, 0);
            eventEnd.setHours(16, 0, 0);
            break;
          default:
            eventStart.setHours(6, 0, 0);
            eventEnd.setHours(14, 0, 0);
        }

        const event = {
          title: `${crewName} Crew - ${rotation.shift_type}`,
          start: eventStart,
          end: eventEnd,
          cert_earned: null,
          experience_type: rotation.experience_type,
          shift_type: rotation.shift_type,
          crew_id: rotation.crew_id,
          tooltip: `${crewName} Crew\n${rotation.shift_type} Shift\n${moment(eventStart).format("h:mm A")} – ${moment(eventEnd).format("h:mm A")}`,
        };

        const key = `${eventStart.toDateString()}-${rotation.shift_type}`;
        if (!shiftMap[key]) shiftMap[key] = [];

        for (let e of shiftMap[key]) {
          const overlapping =
            (eventStart < e.end && eventEnd > e.start) ||
            (eventStart.getTime() === e.start.getTime() && eventEnd.getTime() === e.end.getTime());

          if (overlapping) {
            const crewA = crewName;
            const crewB = e.crewName;
            const dateStr = eventStart.toDateString();

            if (e.crewId === rotation.crew_id && e.shiftType !== rotation.shift_type) {
              const key = `${crewA}|${e.shiftType}|${rotation.shift_type}`;
              if (!conflictMap[key]) conflictMap[key] = [];
              conflictMap[key].push(dateStr);
            }

            if (e.crewId !== rotation.crew_id && e.shiftType === rotation.shift_type) {
              const key = `${crewA} Crew (${rotation.shift_type}) overlaps with ${crewB} Crew (${e.shiftType})`;
              if (!conflictMap[key]) conflictMap[key] = [];
              conflictMap[key].push(dateStr);
            }
          }
        }

        shiftMap[key].push({
          start: eventStart,
          end: eventEnd,
          crewName,
          crewId: rotation.crew_id,
          shiftType: rotation.shift_type,
        });

        crewEvents.push(event);
        current.setDate(current.getDate() + 1);
      }
    });

    const formattedWarnings = Object.entries(conflictMap).map(([key, dates]) => {
      const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);
      const startDate = sortedDates[0].toDateString();
      const endDate = sortedDates[sortedDates.length - 1].toDateString();

      if (key.includes("overlaps with")) {
        return `${key} from ${startDate} to ${endDate}`;
      }

      const [crewName, shiftA, shiftB] = key.split("|");
      return `${crewName} Crew has overlapping ${shiftA.toLowerCase()} and ${shiftB.toLowerCase()} shifts from ${startDate} to ${endDate}`;
    });

    setOverlapWarnings(formattedWarnings);
    setCalendarEvents([...registrationEvents, ...crewEvents]);
  }, [registrations, courses, users, rotations, crews]);

  if (loading) return <Typography>Loading scheduler data...</Typography>;

  const registeredUserIds = new Set(registrations.map((r) => r.user_id));
  const NOT_ASSIGNED_CREW_ID = 7; // Update if your unassigned ID is different

  const availableUsers = users.filter(
    (user) =>
      !registeredUserIds.has(user.id) &&
      (user.crew_id === null || user.crew_id === NOT_ASSIGNED_CREW_ID)
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
      return {
        user,
        course,
        daysLeft: calculateDaysUntilCertification(course.date_end),
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const filteredEvents = calendarEvents.filter((event) => {
    const matchCrew =
      filterCrew === "all" || event.crew_id === Number(filterCrew);
    const matchShift =
      filterShift === "all" || event.shift_type === filterShift;
    return matchCrew && matchShift;
  });

  return (
    <div className="body">
    <Box p={4}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: 700 }}
      >
        🗓️ Scheduler Dashboard
      </Typography>

      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
        <Tab label="Available for Course/Crew" />
        <Tab label="Soon to be Certified" />
        <Tab label="Certified Members & Their Certifications" />
        {/* <Tab label="Crews" /> */}
      </Tabs>

      {crewsWithOnlyRed.length > 0 && (
        <Paper
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "#801313",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            ⚠️ Urgent: Crews With No Experience
          </Typography>
          <Typography variant="body2">
            These crews only have members with no experience (🔴 Red):
          </Typography>
          {crewsWithOnlyRed.map((crew, i) => (
            <Typography key={i} variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {crew.crew_name}
            </Typography>
          ))}
        </Paper>
      )}

      {overlapWarnings.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            my: 2,
            borderLeft: "5px solid orange",
            backgroundColor: "#332000",
          }}
        >
          <Typography variant="h6" color="warning.main">
            ⚠️ Shift Overlap Warning
          </Typography>
          <ul
            style={{ margin: 0, padding: 0, listStyle: "none", color: "white" }}
          >
            {overlapWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Paper>
      )}
      <div className="tabs">

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">
            <GroupIcon sx={{ mr: 1 }} />
            Available for Course/Crew
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontStyle: "italic", color: "gray" }}
          >
            ✅ Users listed here are not enrolled in any course AND not assigned
            to a crew.
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
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
          <Typography variant="h6">
            <HourglassTopIcon sx={{ mr: 1 }} />
            Soon to be Certified
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {upcomingCertifications.map(
                ({ user, course, daysLeft }, index) => {
                  let urgencyColor = "inherit";
                  if (daysLeft <= 7) urgencyColor = "red";
                  else if (daysLeft <= 10) urgencyColor = "orange";
                  return (
                    <li key={index} style={{ color: urgencyColor }}>
                      {user.first_name} {user.last_name} — {course.course_name}{" "}
                      by {new Date(course.date_end).toLocaleDateString()}
                      {daysLeft <= 7 && <strong> ⚠️ Urgent!</strong>}
                    </li>
                  );
                }
              )}
            </ul>
          </Box>
        </Paper>
      )}

      {tabIndex === 2 && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">
            <WorkspacePremiumIcon sx={{ mr: 1 }} />
            Certified Members & Their Certifications
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {users.map((user) => {
                const earnedCourses = registrations
                  .filter((r) => r.user_id === user.id && r.cert_earned)
                  .map(
                    (r) =>
                      courses.find((c) => c.id === r.course_id)?.course_name
                  )
                  .filter(Boolean);
                return earnedCourses.length > 0 ? (
                  <li key={user.id}>
                    <strong>
                      {user.first_name} {user.last_name}
                    </strong>
                    : {earnedCourses.join(", ")}
                  </li>
                ) : null;
              })}
            </ul>
          </Box>
        </Paper>
      )}
      </div>
      <div className="calendar">

      {tabIndex === 3 && <Crews />}

      <Box sx={{ display: "flex", gap: 2, mt: 4, mb: 2 }}>
        <label>
          Filter by Crew:
          <select
            value={filterCrew}
            onChange={(e) => setFilterCrew(e.target.value)}
          >
            <option value="all">All</option>
            {[...new Set(rotations.map((r) => r.crew_id))].map((id) => (
              <option key={id} value={id}>
                Crew {id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Filter by Shift Type:
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Day">Day</option>
            <option value="Swing">Swing</option>
            <option value="Night">Night</option>
          </select>
        </label>
        <label>
          View:
          <select
            value={currentView}
            onChange={(e) => setCurrentView(e.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </label>
      </Box>
      <div className="bigCalendar">
      <Box>
        <div style={{ height: "800px" }}>
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            popup
            style={{ height: "100%" }}
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
                rest: "#4dd0e1",
              };
              const bgColor =
                event.cert_earned === null
                  ? shiftColors[event.shift_type?.toLowerCase()] || // prefer shift_type
                    shiftColors[event.experience_type?.toLowerCase()] ||
                    "#90a4ae" // fallback gray
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
                },
              };
            }}
            components={{
              event: ({ event }) => (
                <Tooltip
                  title={
                    <span style={{ whiteSpace: "pre-line" }}>
                      {event.tooltip}
                    </span>
                  }
                  arrow
                >
                  <div>{event.title}</div>
                </Tooltip>
              ),
            }}
          />
        </div>
      </Box>

      {selectedEvent && (
        <>
        {/* Backdrop */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1500,
          }}
          onClick={() => setSelectedEvent(null)}
        />
    
        {/* Modal */}
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1600,
            backgroundColor: "#fefefe",
            color: "#333",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "380px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            fontSize: "0.9rem",
            transition: "all 0.3s ease-in-out",
            animation: "fadeIn 0.3s ease-in-out",
            maxHeight: "90vh",
            height: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            📋 Event Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Title:</strong> {selectedEvent.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Start:</strong>{" "}
            {new Date(selectedEvent.start).toLocaleString("en-US", {
              timeZoneName: "short",
            })}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>End:</strong>{" "}
            {new Date(selectedEvent.end).toLocaleString("en-US", {
              timeZoneName: "short",
            })}
          </Typography>
          {selectedEvent.cert_earned !== null && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Certification Earned:</strong>{" "}
              {selectedEvent.cert_earned ? "✅ Yes" : "❌ No"}
            </Typography>
          )}

          {selectedEvent.crew_id && (
            <>
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                <strong>Assigned Crew Members:</strong>
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  textAlign: "center",
                }}
              >
                {users
                  .filter((u) => u.crew_id === selectedEvent.crew_id)
                  .map((member) => {
                    const emojiMap = {
                      green: "🟢",
                      yellow: "🟡",
                      red: "🔴",
                    };
                    const exp = member.experience_type?.toLowerCase();
                    return (
                      <Typography
                        key={member.id}
                        variant="body2"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          mb: 0.5,
                          width: "100%",
                        }}
                      >
                        <span>{emojiMap[exp] || "⚪"}</span>
                        <span>
                          {member.first_name} {member.last_name} — {member.role}
                        </span>
                      </Typography>
                    );
                  })}
              </Box>
            </>
          )}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <button
              style={{
                backgroundColor: "#333",
                color: "white",
                padding: "6px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
                transition: "background-color 0.2s",
              }}
              onClick={() => setSelectedEvent(null)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}


            >
              Close
            </button>
          </Box>
        </Box>
        </>
      )}
      </div>
      </div>
    </Box>
    </div>
  );
}
