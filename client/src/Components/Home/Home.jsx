// Incomplete code, need to determin how to store username
// Code written by Harman
// MUI styling by Lorena

import React, { useEffect, useState } from "react";
import "./Home.css";
import Footer from "../Footer/Footer.jsx";
// import { Container, Box, Typography, Button, Stack } from "@mui/material";

export default function Home() {
  // const username = localStorage.getItem("username");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [courseRes] = await Promise.all([
            fetch("http://localhost:8080/courses"),
          ]);

          if (!courseRes.ok) {
            throw new Error("Failed to fetch data");
          }

          const courseData = await courseRes.json();

          const sortedCourses = courseData.sort(
            (a, b) => new Date(b.date_start) - new Date(a.date_start)
          );

          const latestCourses = sortedCourses.slice(0, 2);

          setCourses(latestCourses);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

  return (
    <>
      <div className="pageConatiner">
        {/* <h1>Welcome to Squad Sync, {username ? username + '!' : 'Guest'}</h1> */}
        <h1>Welcome to Squad Sync!</h1>

        <div className="NavContainer">
          <div className="homeContainer">
            <div className="news">
              <h3>News</h3>
              {courses.length > 0 ? (
                <>
                  <h4>New Courses Available!</h4>
                  <ul>
                    {courses.map((course, index) => (
                      <li key={index}>{course.course_name} - Start date: {course.date_start}</li>
                    ))}
                  </ul>
                  <p>Contact your Training Manager for more information.</p>
                </>
              ) : (
                <p>No new courses available at this time, check back soon!</p>
              )}

            </div>


            <div className="featureSection">

            <div className="featuresGrid">
              <div className="featureCard">
                <img src="/images/crew-schedule.png" alt="Schedule" />
                <h4>Crew Schedules</h4>
                <p>Manage your crew assignment and rotation.</p>
              </div>
              <div className="featureCard">
                <img src="/images/calendar.jpg" alt="Calendar" />
                <h4>Training Calendar</h4>
                <p>Stay informend with upcoming training dates.</p>
              </div>
              <div className="featureCard">
                <img src="/images/feedback.png" alt="Feedback" />
                <h4>Feedback</h4>
                <p>Tell us what’s working—and what you'd like to see added!</p>
              </div>
            </div>

            </div>

          </div>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  );
}