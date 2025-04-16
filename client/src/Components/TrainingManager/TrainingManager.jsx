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

export default function Courses() {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    description: "",
    seats: 0,
    date_start: "",
    date_end: "",
    cert_granted: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, regRes] = await Promise.all([
          fetch("http://localhost:8080/courses"),
          fetch("http://localhost:8080/course_registration"),
        ]);

        if (!courseRes.ok || !regRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const courseData = await courseRes.json();
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (course) => {
    setEditingRowId(course.id);
    setEditedData({ ...course });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/courses/${editingRowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const updatedCourse = await response.json();
      setCourses((prev) =>
        prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
      );

      setEditingRowId(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleAddCourse = () => {
    setIsAdding(true);
  };

  const handleAddInputChange = (e, field) => {
    setNewCourse({ ...newCourse, [field]: e.target.value });
  };

  const handleSaveCourse = async () => {
    try {
      const response = await fetch("http://localhost:8080/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const addedCourse = await response.json();
      setCourses((prev) => [...prev, addedCourse]);
      setIsAdding(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCourse({
      course_name: "",
      description: "",
      seats: 0,
      date_start: "",
      date_end: "",
      cert_granted: "",
    });
  };

  const handleDeleteCourse = async (course) => {
    try {
      const response = await fetch(`http://localhost:8080/courses/${course.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }
      window.location.reload();

    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Course Management
        </Typography>
        <button onClick={handleAddCourse}>Add Course</button>
      </Box>

      {isAdding && (
        <Box component={Paper} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add New Course
          </Typography>
          <div>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.course_name}
              onChange={(e) => handleAddInputChange(e, "course_name")}
            />
          </div>
          <div>
            <input
              type="date"
              value={newCourse.date_start}
              onChange={(e) => handleAddInputChange(e, "date_start")}
            />
          </div>
          <div>
            <input
              type="date"
              value={newCourse.date_end}
              onChange={(e) => handleAddInputChange(e, "date_end")}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) => handleAddInputChange(e, "description")}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Seats"
              value={newCourse.seats}
              onChange={(e) => handleAddInputChange(e, "seats")}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Certificate Granted"
              value={newCourse.cert_granted}
              onChange={(e) => handleAddInputChange(e, "cert_granted")}
            />
          </div>
          <div>
            <button onClick={handleSaveCourse}>Add</button>
            <button onClick={handleCancelAdd}>Cancel</button>
          </div>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Seats Offered</TableCell>
              <TableCell>Cert Granted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
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
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="text"
                      value={editedData.course_name}
                      onChange={(e) => handleInputChange(e, "course_name")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.course_name
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="date"
                      value={editedData.date_start}
                      onChange={(e) => handleInputChange(e, "date_start")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.date_start
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="date"
                      value={editedData.date_end}
                      onChange={(e) => handleInputChange(e, "date_end")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.date_end
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="text"
                      value={editedData.description}
                      onChange={(e) => handleInputChange(e, "description")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.description
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="number"
                      value={editedData.seats}
                      onChange={(e) => handleInputChange(e, "seats")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.seats
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <input
                      type="text"
                      value={editedData.cert_granted}
                      onChange={(e) => handleInputChange(e, "cert_granted")}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "1px", // Adds space inside the input
                        margin: "1px 0", // Adds space between inputs
                      }}
                    />
                  ) : (
                    course.cert_granted
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === course.id ? (
                    <>
                      <button data-testid='test-saveButton' onClick={handleSaveClick}>Save</button>
                      <button data-testid='test-cancelButton' onClick={handleCancelClick}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button data-testid='test-editButton' onClick={() => handleEditClick(course)}>Edit</button>
                      <button data-testid='test-deleteButton' onClick={() => handleDeleteCourse(course)}>Delete</button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
