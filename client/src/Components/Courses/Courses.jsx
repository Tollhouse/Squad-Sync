import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CourseTable from "./CourseTable";
import CoursePersonnel from "./CoursePersonnel";
import HandleAddCourse from "./HandleAddCourse";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [addCourseOpen, setAddCourseOpen] = useState(false);

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

        courseData.sort((a, b) => a.id - b.id);

        setCourses(courseData);
        setRegistrations(registrationData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
    window.location.reload();
  };

  const handleUpdateCourse = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
    );
  };

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
      <Box sx={{ m: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Courses
        </Typography>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddCourseOpen(true)}
        >
          Add Course
        </Button>
      </Box>

      {/* Render the courses table w/ inline editing */}
      <CourseTable
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
        onUpdateCourse={handleUpdateCourse}
      />

      {/* Render registered personnel table */}
      {selectedCourse && (
        <CoursePersonnel
          course={selectedCourse}
          registeredUsers={registeredUsers}
        />
      )}

      {/* Add Course Modal */}
      <HandleAddCourse
        open={addCourseOpen}
        onClose={() => setAddCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </Container>
  );
}