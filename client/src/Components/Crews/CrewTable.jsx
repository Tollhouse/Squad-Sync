import React, { useState } from "react";
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
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExperienceChip from "../AddOns/ExperinceChip";
import CrewRoster from "./CrewRoster";
import HandleAddRotation from "./HandleAddRotation";

function CrewTable({ schedule, setSchedule }) {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [rosterMode, setRosterMode] = useState(false);
  const [rosterId, setRosterId] = useState(0);
  const [addRotationOpen, setAddRotationOpen] = useState(false);

  const handleEditClick = (row) => {
    setEditingRowId(row.crew_id);
    setEditFormData({ ...row });
  };

  const handleCancelClick = () => {
    setEditingRowId(null); // Exit edit mode
    setEditFormData({}); // Clear the form data
  };

  const handleSaveClick = () => {
    // Save the changes (you can also send this to the backend)
    fetch(`http://localhost:8080/crew_rotations/${editFormData.crew_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(editFormData),
    })
      .then((response) => {
        if (response.ok) {
          setSchedule((prevSchedule) =>
            prevSchedule.map((row) =>
              row.crew_id === editFormData.crew_id ? editFormData : row
            )
          );
          setEditingRowId(null); // Exit edit mode
        } else {
          alert("Failed to save changes.");
        }
      })
      .catch((error) => {
        console.error("Error saving changes:", error);
        alert("Error saving changes.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  function handleRosterMode(s) {
    if (rosterMode && rosterId === s.crew_id) {
      setRosterMode(false);
      setRosterId(0)
    } else {
      setRosterMode(true);
      setRosterId(s.crew_id);
      // console.log("Clicked on crew_id:", s.crew_id);
    }
  }

  const handleAddCrewRotation = () => {
    // console.log("Clicked on Add Crew Rotation");
    setAddRotationOpen(true);
  };

  const handleRotationAdded = (newRotation) => {
    // console.log("Rotation added from HandleAddRotation:", newRotation);
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
            </TableRow>
          </TableHead>
          <TableBody>

            {schedule.map((row) => (
              <TableRow key={row.crew_id} onClick={() => handleRosterMode(row)}>
                <TableCell>{row.crew_id}</TableCell>
                <TableCell>
                  {editingRowId === row.crew_id ? (
                    <TextField
                      name="crew_name"
                      value={editFormData.crew_name || ""}
                      onChange={handleInputChange}
                      size="small"
                    />
                  ) : (
                    row.crew_name
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === row.crew_id ? (
                    <TextField
                      name="date_start"
                      type="date"
                      value={editFormData.date_start || ""}
                      onChange={handleInputChange}
                      size="small"
                    />
                  ) : (
                    new Date(row.date_start).toISOString().split("T")[0]
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === row.crew_id ? (
                    <TextField
                      name="date_end"
                      type="date"
                      value={editFormData.date_end || ""}
                      onChange={handleInputChange}
                      size="small"
                    />
                  ) : (
                    new Date(row.date_end).toISOString().split("T")[0]
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === row.crew_id ? (
                    <Select
                      name="shift_type"
                      value={editFormData.shift_type || ""}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="swing">Swing</MenuItem>
                      <MenuItem value="night">Night</MenuItem>
                    </Select>
                  ) : (
                    row.shift_type
                  )}
                </TableCell>
                <TableCell>
                  <ExperienceChip level={row.crew_experience} />
                </TableCell>
                <TableCell>
                  {editingRowId === row.crew_id ? (
                    <>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={handleSaveClick}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={handleCancelClick}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(row)}
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

      {rosterMode ? <CrewRoster key={rosterId} crew_id={rosterId} /> : null}
      <HandleAddRotation
        open={addRotationOpen}
        onClose={() => setAddRotationOpen(false)}
        onAddRotation={handleRotationAdded}
      />
    </>
  );
}

export default CrewTable;

