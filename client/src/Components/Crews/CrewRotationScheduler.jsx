import React, { useState } from "react";
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
} from "@mui/material";

export default function CrewRotationScheduler({ crews, onSubmit }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rotations, setRotations] = useState([]);

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
      crews.forEach((crew, index) => {
        const isWeekendShift = index % 2 === 0; // Alternate crews between shifts
        const shiftType = isWeekendShift ? "Friday–Sunday" : "Monday–Thursday";
        const shiftDuration = isWeekendShift ? 12 : 8;

        const shiftStart = new Date(current);
        const shiftEnd = new Date(
          shiftStart.getTime() + (isWeekendShift ? 2 : 3) * 24 * 60 * 60 * 1000
        );

        generatedRotations.push({
          crew_id: crew.id,
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
  };

  const handleRotationChange = (index, field, value) => {
    setRotations((prev) =>
      prev.map((rotation, i) =>
        i === index ? { ...rotation, [field]: value } : rotation
      )
    );
  };

  const handleSubmit = () => {
    if (rotations.length === 0) {
      alert("No rotations to submit.");
      return;
    }

    onSubmit(rotations);
  };

  const handleRotationSubmit = async (rotations) => {
    try {
      const response = await fetch("http://localhost:8080/crew_rotations/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rotations),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rotations");
      }

      alert("Rotations submitted successfully!");
    } catch (error) {
      console.error("Error submitting rotations:", error);
      alert("Failed to submit rotations.");
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h5">Set Crew Rotations</Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ mr: 2 }}
          label="Start Date"
        />
        <TextField
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ mr: 2 }}
          label="End Date"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={generateRotations}
        >
          Generate Rotations
        </Button>
      </Box>

      {rotations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Generated Rotations</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Crew Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Shift Type</TableCell>
                  <TableCell>Shift Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rotations.map((rotation, index) => (
                  <TableRow key={index}>
                    <TableCell>{rotation.crew_name}</TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rotation.date_start}
                        onChange={(e) =>
                          handleRotationChange(index, "date_start", e.target.value)
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rotation.date_end}
                        onChange={(e) =>
                          handleRotationChange(index, "date_end", e.target.value)
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rotation.shift_type}
                        onChange={(e) =>
                          handleRotationChange(index, "shift_type", e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="Monday–Thursday">
                          Monday–Thursday
                        </MenuItem>
                        <MenuItem value="Friday–Sunday">Friday–Sunday</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={rotation.shift_duration}
                        onChange={(e) =>
                          handleRotationChange(
                            index,
                            "shift_duration",
                            parseInt(e.target.value, 10)
                          )
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit Rotations
          </Button>
        </Box>
      )}
    </Box>
  );
}