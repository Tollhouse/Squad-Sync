import React, { useEffect, useState } from "react";
import './Dashboard.css';

export default function Dashboard() {
  const mockUser = {
    id: 1,
    first_name: "Brian",
    last_name: "Davis",
    role: "Commander",
  };

  const mockUserStats = {
    red: 2,
    yellow: 3,
    green: 5,
  };

  const mockCourses = [
    { id: 1, course_name: "Cyber Basics", cert_earned: true },
    { id: 2, course_name: "Safety Protocol", cert_earned: false },
    { id: 3, course_name: "Advanced Tactics", cert_earned: true },
  ];

  const mockShifts = [
    { id: 1, name: "Bravo", assigned: 3 },
    { id: 2, name: "Alpha", assigned: 2 },
  ];

  const [user, setUser] = useState({});
  const [userStats, setUserStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [crewShifts, setCrewShifts] = useState([]);

  useEffect(() => {
    setUser(mockUser);
    setUserStats(mockUserStats);
    setCourses(mockCourses);
    setCrewShifts(mockShifts);

    localStorage.setItem("userId", mockUser.id);
    localStorage.setItem("userRole", mockUser.role);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="heading">Welcome, {user.first_name}!</h1>
      <h2 className="subheading">Role: {user.role}</h2>

      <div>
        <div className="section">
          <h3 className="section-title">🧭 Commander Dashboard</h3>
          <p className="section-subtext">Experience Level Breakdown:</p>
          <ul>
            <li>🟥 <strong>Red</strong>: {userStats.red} — Not Ready</li>
            <li>🟨 <strong>Yellow</strong>: {userStats.yellow} — Partially Ready</li>
            <li>🟩 <strong>Green</strong>: {userStats.green} — Fully Ready</li>
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">📘 Training Progress</h3>
          <ul>
            {courses.map((c) => (
              <li key={c.id}>
                {c.cert_earned ? "✅" : "🕒"} {c.course_name}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">👩🏽‍💼👨🏽‍💼 Crew Assignment Overview</h3>
          <ul>
            {crewShifts.map((s) => (
              <li key={s.id}>
                {s.name} Shift: {s.assigned} members assigned
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
