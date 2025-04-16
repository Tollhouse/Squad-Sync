import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmSaveModal, ConfirmDeleteModal } from "../AddOns/ConfirmModal";
import { saveInlineEdits, cancelInlineEdits } from "./HandleEditCourse";
import { deleteCourse } from "./HandleDeleteCourse";

export default function CourseTable({
  courses,
  selectedCourseId,
  onSelectCourse,
  onUpdateCourse,
}) {
  // inline editing
  const [editCourseId, setEditCourseId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const startEditing = (course) => {
    setEditCourseId(course.id);
    setEditedCourse({ ...course });
  };

  const handleSaveEdits = () => {
    saveInlineEdits(editedCourse)
      .then((data) => {
        onUpdateCourse(data);
        setEditCourseId(null);
        setEditedCourse({});
        window.location.reload();
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

  const handleDeleteCourse = (courseId, e) => {
    e.stopPropagation();
    setCourseToDelete(courseId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting course:", error);
        });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
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
                onClick={() =>
                  onSelectCourse(course.id === selectedCourseId ? null : course.id)
                }
                style={{ cursor: "pointer" }}
              >
                {/* Course ID – not editable */}
                <TableCell>{course.id}</TableCell>

                {/* Course Name */}
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

                {/* Start Date */}
                <TableCell>
                  {editCourseId === course.id ? (
                    <TextField
                      type="date"
                      value={editedCourse.date_start}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev,
                          date_start: e.target.value,
                        }))
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    course.date_start
                  )}
                </TableCell>

                {/* End Date */}
                <TableCell>
                  {editCourseId === course.id ? (
                    <TextField
                      type="date"
                      value={editedCourse.date_end}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev,
                          date_end: e.target.value,
                        }))
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    course.date_end
                  )}
                </TableCell>

                {/* Seats */}
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

                {/* Cert Granted */}
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

                {/* Actions */}
                <TableCell>
                  {editCourseId === course.id ? (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
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
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(course);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={(e) => handleDeleteCourse(course.id, e)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm save modal */}
      <ConfirmSaveModal
        open={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={() => {
          handleSaveEdits();
          setSaveConfirmOpen(false);
        }}
        message="Are you sure you want to save your changes?"
      />
      <ConfirmDeleteModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          confirmDeleteCourse();
          setDeleteConfirmOpen(false);
        }}
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </>
  );
}