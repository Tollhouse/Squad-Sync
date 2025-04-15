import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import CoursePersonnel from "./CoursePersonnel";

export default function Courses() {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, regRes, userRes] = await Promise.all([
          fetch("http://localhost:8080/courses"),
          fetch("http://localhost:8080/course_registration"),
          fetch("http://localhost:8080/users"),
        ]);

        if (!courseRes.ok || !regRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const courseData = await courseRes.json();
        const registrationData = await regRes.json();
        const userData = await userRes.json();

        setCourses(courseData);
        setRegistrations(registrationData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  const registeredUsers = registrations
    .filter((reg) => reg.course_id === selectedCourseId)
    .map((reg) => {
      const user = users.find((u) => u.id === reg.user_id);
      return {
        ...reg,
        first_name: user?.first_name || "N/A",
        last_name: user?.last_name || "N/A",
      };
    });

  return (
    <Container maxWidth="lg">
      {/* Courses Table */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Courses
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Cert Granted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                data-testid="test-courseRow"
                onClick={() =>
                  setSelectedCourseId((prevId) =>
                    prevId === course.id ? null : course.id
                  )
                }
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(0, 0, 0, 0.04)"
                        : "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.date_start}</TableCell>
                <TableCell>{course.date_end}</TableCell>
                <TableCell>{course.cert_granted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Render Registered Personnel only when a course is selected */}
      {selectedCourse && (
        <CoursePersonnel
          course={selectedCourse}
          registeredUsers={registeredUsers}
        />
      )}
    </Container>
  );
}