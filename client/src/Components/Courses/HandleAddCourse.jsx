import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

function HandleAddCourse({ open, onClose, onAddCourse }) {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [certGranted, setCertGranted] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!courseName || !description || !seats || !dateStart || !dateEnd || !certGranted) {
      setError("All fields are required.");
      return;
    }

    const newCourse = {
      course_name: courseName,
      description,
      seats: parseInt(seats, 10),
      date_start: dateStart,
      date_end: dateEnd,
      cert_granted: certGranted,
    };

    fetch("http://localhost:8080/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("New course added successfully:", data);
        if (onAddCourse) {
          onAddCourse(data);
        }
        // Reset fields
        setCourseName("");
        setDescription("");
        setSeats("");
        setDateStart("");
        setDateEnd("");
        setCertGranted("");
        setError("");
        onClose();
      })
      .catch((err) => {
        console.error("Error adding new course:", err);
        setError("Failed to add new course. Please try again.");
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Course</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            minWidth: 300,
          }}
        >
          <TextField
            label="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="Seats"
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            fullWidth
          />

          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            fullWidth
          />

          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            fullWidth
          />

          <TextField
            label="Certification Granted"
            value={certGranted}
            onChange={(e) => setCertGranted(e.target.value)}
            fullWidth
          />

          {/* Error message */}
          {error && (
            <Box sx={{ color: "red", fontSize: "0.9rem" }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Course
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HandleAddCourse;