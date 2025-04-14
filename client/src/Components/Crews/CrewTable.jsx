import { React, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
} from "@mui/material";
import CrewRoster from "./CrewRoster";
import AddIcon from "@mui/icons-material/Add";
import ExperienceChip from "../AddOns/ExperinceChip";
import HandleDelete from "./HandleDelete";


function CrewTable({ schedule }) {
  const [rosterMode, setRosterMode] = useState(false);
  const [rosterId, setRosterId] = useState(0);


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
              <TableCell>Crew ID</TableCell>
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
                <TableCell>{s.crew_id}</TableCell>
                <TableCell>{s.crew_name}</TableCell>
                <TableCell>{s.date_start}</TableCell>
                <TableCell>{s.date_end}</TableCell>
                <TableCell>{s.shift_type}</TableCell>
                <TableCell>
                  <ExperienceChip level={s.crew_experience} />
                </TableCell>
                <TableCell>
                  <HandleDelete crew_id={s.crew_id} />
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