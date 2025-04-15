// src/Components/Courses/Courses.jsx
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
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CoursePersonnel from "./CoursePersonnel";
import HandleAddCourse from "./HandleAddCourse";
import { saveInlineEdits, cancelInlineEdits } from "./HandleEditCourse";
import { ConfirmSaveModal } from "../AddOns/confirmmodal";

export default function Courses() {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  // inline editing
  const [editCourseId, setEditCourseId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});
  // ConfirmSaveModal
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

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

  const handleAddCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const handleSaveEdits = () => {
    saveInlineEdits(editedCourse)
      .then((data) => {
        setCourses((prevCourses) =>
          prevCourses.map((course) => (course.id === data.id ? data : course))
        );
        setEditCourseId(null);
        setEditedCourse({});
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  const handleCancelEdits = () => {
    cancelInlineEdits();
    setEditCourseId(null);
    setEditedCourse({});
  };

  // load  course data into the edit form
  const startEditing = (course) => {
    setEditCourseId(course.id);
    setEditedCourse({ ...course });
  };

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

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
        {/* Header with Add Course Button */}
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

        {/* Courses Table with Inline Editing */}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Cert Granted</TableCell>
                <TableCell>Actions</TableCell>
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
                  {/* ID cell – not editable */}
                  <TableCell>{course.id}</TableCell>

                  {/* Name cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      <TextField
                        value={editedCourse.course_name}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev,
                            course_name: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      course.course_name
                    )}
                  </TableCell>

                  {/* Start Date cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editedCourse.date_start}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev,
                            date_start: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      course.date_start
                    )}
                  </TableCell>

                  {/* End Date cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editedCourse.date_end}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev,
                            date_end: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      course.date_end
                    )}
                  </TableCell>

                  {/* Seats cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      <TextField
                        type="number"
                        value={editedCourse.seats}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev,
                            seats: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      course.seats
                    )}
                  </TableCell>

                  {/* Cert Granted cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      <TextField
                        value={editedCourse.cert_granted}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev,
                            cert_granted: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      course.cert_granted
                    )}
                  </TableCell>

                  {/* Actions cell */}
                  <TableCell>
                    {editCourseId === course.id ? (
                      // In edit mode, show Save and Cancel buttons
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // open confirmation modal
                            setSaveConfirmOpen(true);
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdits();
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      // Not in edit mode, show Edit button
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(course);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Render registered personnel table only when a course is selected */}
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

        {/* Confirm Save Modal for inline editing */}
        <ConfirmSaveModal
          open={saveConfirmOpen}
          onClose={() => setSaveConfirmOpen(false)}
          onConfirm={() => {
            handleSaveEdits();
            setSaveConfirmOpen(false);
          }}
          message="Are you sure you want to save your changes?"
        />
      </Container>
    );
  }