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
        <h1>Welcome to Squad Sync</h1>

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
                </>
              ) : (
                <p>No new courses available at this time, check back soon!</p>
              )}
              <p>Contact your Training Manager for more information.</p>
            </div>

            <div className="topSection">
              <div className="mission">
                <h3>Our Mission</h3>
                <p>Enable combat mission effectiveness through streamlined planning and assignment of personnel to crews and rotations, and registering for training courses while providing accurate and up-to-date personnel information to Command teams.</p>
              </div>
              <div className="vision">
                <h3>Our Vision</h3>
                <p>To provide a one stop, scalable solution that provides command and user dashboards for monitoring and tracking as well as the ability for the scheduling lead to easily track availability, monitor gaps in mission support and mitigate those issues within a combat reliable timeframe.</p>
              </div>
            </div>

            <div className="roles">
              <h3>Role Based Actions</h3>
              <p>This application breaks down users into various roles based on personnel assignment within the squadron.</p>

              <div className="roleGrid">
                <div className="role">
                  <h4>Commander</h4>
                  <p>The Commander role provides access to the Dashboard tool, enabling at-a-glance overviews of how experienced the unit is as a whole, personnel crew assignments, training status, and more.</p>
                </div>
                <div className="role">
                  <h4>Scheduler</h4>
                  <p>The Scheduler role gives Unit Schedulers the ability to view which training courses are available, which personnel are in need of training, and projections of when personnel will receive certifications. This information aids the Scheduler in building mission-ready crews by filtering and assigning only qualified personnel.</p>
                </div>
                <div className="role">
                  <h4>Training Manager</h4>
                  <p>The Training Manager role aids Training Managers in coordinating with the Schedulers to be able to list new available courses and course dates that will be reflected in tracking personnel certifications and mission status.</p>
                </div>
                <div className="role">
                  <h4>User</h4>
                  <p>The User role is designed for all other personnel in the unit to be able to keep track of upcoming training courses they are registered for, as well as reflecting their current crew assignment and rotation.</p>
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

// return (
//   <Container maxWidth="sm">
//     <Box sx={{ mt: 4, textAlign: "center" }}>
//       <Typography variant="h3" gutterBottom>
//         Welcome to Home Page
//       </Typography>
//       <Stack
//         spacing={2}
//         direction="row"
//         justifyContent="center"
//         sx={{ my: 2 }}
//       >
//         <Button
//           variant="contained"
//           component={Link}
//           to="/login"
//         >
//           User Log In
//         </Button>
//         <Button
//           variant="outlined"
//           component={Link}
//           to="/signup"
//         >
//           New User Sign Up
//         </Button>
//       </Stack>
//       <Box sx={{ mt: 3 }}>
//         {username ? (
//           <Typography variant="h6">
//             Welcome, {username}!
//           </Typography>
//         ) : (
//           <Typography variant="h6">
//             Guest
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   </Container>
// );
// }
