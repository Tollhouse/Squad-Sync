import { React, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CrewRoster from "./CrewRoster";
import AddIcon from "@mui/icons-material/Add";
import ExperienceChip from "../AddOns/ExperinceChip";
import HandleDelete from "./HandleDelete";


function CrewTable({ schedule }) {
  const [rosterMode, setRosterMode] = useState(false)
  const [rosterId, setRosterId] = useState(0)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rotations, setRotations] = useState([]);

  function handleRosterMode(s) {
    if (rosterMode && rosterId === s.crew_id) {
      setRosterMode(false);
      setRosterId(0);
    } else {
      setRosterMode(true);
      setRosterId(s.crew_id);
      console.log("Clicked on crew_id:", s.crew_id);
    }
  }

  const handleAddCrewRotation = () => {
    console.log("Clicked on Add Crew Rotation");
  };

  const generateRotations = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const generatedRotations = [];

    let current = new Date(start);
    while (current <= end) {
      schedule.forEach((crew, index) => {
        const isWeekendShift = index % 2 === 0; // Alternate crews between shifts
        const shiftType = isWeekendShift ? "Friday–Sunday" : "Monday–Thursday";
        const shiftDuration = isWeekendShift ? 12 : 8;

        const shiftStart = new Date(current);
        const shiftEnd = new Date(
          shiftStart.getTime() + (isWeekendShift ? 2 : 3) * 24 * 60 * 60 * 1000
        );

        generatedRotations.push({
          crew_id: crew.crew_id,
          crew_name: crew.crew_name,
          date_start: shiftStart.toISOString().split("T")[0],
          date_end: shiftEnd.toISOString().split("T")[0],
          shift_type: shiftType,
          shift_duration: shiftDuration,
        });
      });

      // Move to the next week
      current.setDate(current.getDate() + 7);
    }

    setRotations(generatedRotations);
  }

  const handleRotationChange = (index, field, value) => {
    setRotations((prev) =>
      prev.map((rotation, i) =>
        i === index ? { ...rotation, [field]: value } : rotation
      )
    );
  }

  const handleSubmit = () => {
    if (rotations.length === 0) {
      alert("No rotations to submit.");
      return;
    }

    // Submit the rotations to the server or perform any other action
    console.log("Submitted rotations:", rotations);
  };

  const handleRotationSubmit = async (schedule) => {
    try {
      const response = await fetch('http://localhost:8080/crews/rotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rotations');
      }

      const data = await response.json();
      console.log("Rotations submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting rotations:", error);
    }
  }
console.log("schedule", schedule)
  return (
    <>
      <Box sx={{ m: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Crew Rotations
        </Typography>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCrewRotation}
        >
          Add Crew Rotation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Crew Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Crew Experience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((s, index) => (
              <TableRow key={index} onClick={() => handleRosterMode(s)}>
                <TableCell>{s.crew_name}</TableCell>
                <TableCell>{s.date_start}</TableCell>
                <TableCell>{s.date_end}</TableCell>
                <TableCell>{s.shift_type}</TableCell>
                <TableCell>
                  <ExperienceChip level={s.crew_experience} />
                </TableCell>
                <TableCell>
                  <HandleDelete crew_id={crew_id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rosterMode ? <CrewRoster key={rosterId} crew_id={rosterId} /> : null}
    </>
  );
}

export default CrewTable;
