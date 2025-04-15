// HandleAddRotation.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

function HandleAddRotation({ open, onClose, onAddRotation }) {
  const [crewId, setCrewId] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [shiftDuration, setShiftDuration] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!crewId || !dateStart || !dateEnd || !shiftType || !shiftDuration || !experienceType) {
      setError("All fields are required.");
      return;
    }

    const newRotation = {
      crew_id: parseInt(crewId, 10),
      date_start: dateStart,
      date_end: dateEnd,
      shift_type: shiftType,
      shift_duration: parseInt(shiftDuration, 10),
      experience_type: experienceType,
    };

    fetch("http://localhost:8080/crew_rotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRotation),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("New rotation added successfully:", data);
        if (onAddRotation) {
          onAddRotation(data);
        }
        setCrewId("");
        setDateStart("");
        setDateEnd("");
        setShiftType("");
        setShiftDuration("");
        setExperienceType("");
        setError("");
        onClose();
      })
      .catch((error) => {
        console.error("Error adding new crew rotation:", error);
        setError("Failed to add new crew rotation. Please try again.");
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Crew Rotation</DialogTitle>
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
          <FormControl fullWidth>
            <InputLabel id="crew-id-label">Crew ID</InputLabel>
            <Select
              labelId="crew-id-label"
              value={crewId}
              label="Crew ID"
              onChange={(e) => setCrewId(e.target.value)}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
            </Select>
          </FormControl>

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

          <FormControl fullWidth>
            <InputLabel id="shift-type-label">Shift Type</InputLabel>
            <Select
              labelId="shift-type-label"
              value={shiftType}
              label="Shift Type"
              onChange={(e) => setShiftType(e.target.value)}
            >
              <MenuItem value="Mid">Mid</MenuItem>
              <MenuItem value="Day">Day</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </Select>
          </FormControl>


          <FormControl fullWidth>
            <InputLabel id="shift-duration-label">Shift Duration</InputLabel>
            <Select
              labelId="shift-duration-label"
              value={shiftDuration}
              label="Shift Duration"
              onChange={(e) => setShiftDuration(e.target.value)}
            >
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="8">8</MenuItem>
            </Select>
          </FormControl>


          <FormControl fullWidth>
            <InputLabel id="experience-type-label">Experience Type</InputLabel>
            <Select
              labelId="experience-type-label"
              value={experienceType}
              label="Experience Type"
              onChange={(e) => setExperienceType(e.target.value)}
            >
              <MenuItem value="red">red</MenuItem>
              <MenuItem value="green">green</MenuItem>
              <MenuItem value="yellow">yellow</MenuItem>
            </Select>
          </FormControl>

          {/* Display error message if any */}
          {error && (
            <Box sx={{ color: "red", fontSize: "0.9rem" }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Rotation
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HandleAddRotation;
