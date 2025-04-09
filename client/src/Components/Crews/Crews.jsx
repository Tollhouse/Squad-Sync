// code by lorena - styled with MUI

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
  TextField,
  Select,
  MenuItem,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Crews() {
  const theme = useTheme();
  const [crews, setCrews] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCrewId, setSelectedCrewId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  // FOR TESTING ONLY - hardcoding priveleges to see output
  const [userPrivilege, setUserPrivilege] = useState("scheduler");
  const canEdit = userPrivilege === "scheduler";
  const canSeeExperience = ["commander", "scheduler"].includes(userPrivilege);

  useEffect(() => {
    const fetchData = async () => {
      const [crewRes, rotationRes, userRes] = await Promise.all([
        fetch("http://localhost:8080/crews"),
        fetch("http://localhost:8080/crew_rotations"),
        fetch("http://localhost:8080/users"),
      ]);
      const [crewsData, rotationsData, usersData] = await Promise.all([
        crewRes.json(),
        rotationRes.json(),
        userRes.json(),
      ]);
      setCrews(crewsData);
      setRotations(rotationsData);
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleEdit = (rotation) => {
    setEditingRowId(rotation.id);
    setEditedRow(rotation);
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  const handleUserEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUser(user);
  };

  const handleUserCancel = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    try {
      const rotationRes = await fetch(`http://localhost:8080/crew_rotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRow),
      });
      const crewRes = await fetch(`http://localhost:8080/crews/${editedRow.crew_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crew_name: editedRow.crew_name }),
      });

      if (!rotationRes.ok || !crewRes.ok) throw new Error("Failed to save");

      const updatedRotation = await rotationRes.json();
      setRotations((prev) =>
        prev.map((r) => (r.id === id ? updatedRotation[0] : r))
      );
      setCrews((prev) =>
        prev.map((c) =>
          c.id === editedRow.crew_id ? { ...c, crew_name: editedRow.crew_name } : c
        )
      );
      setEditingRowId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSave = async (id) => {
    try {
      const userRes = await fetch(`http://localhost:8080/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });
      if (!userRes.ok) throw new Error("User update failed");
      const updatedUser = await userRes.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser[0] : u)));
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/crew_rotations/${id}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRotations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const ExperienceChip = ({ level }) => {
    const colorMap = {
      green: { label: "Green", color: "#4caf50" },
      yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
      red: { label: "Red", color: "#f44336" },
    };
    return (
      <Chip
        label={colorMap[level]?.label || level}
        size="small"
        sx={{
          backgroundColor: colorMap[level]?.color,
          color: colorMap[level]?.textColor || "#fff",
          fontWeight: 600,
        }}
      />
    );
  };

  const selectedCrew = crews.find((c) => c.id === selectedCrewId);
  const crewWithRotations = crews.map((crew) => {
    const rotation = rotations.find((r) => r.crew_id === crew.id);
    return { ...crew, ...rotation };
  });

  const usersByCrew = users.filter((u) => u.crew_id === selectedCrewId);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4">Crew Rotations</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Crew Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Duration</TableCell>
              {canSeeExperience && <TableCell>Experience</TableCell>}
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {crewWithRotations.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => setSelectedCrewId((prev) => (prev === row.id ? null : row.id))}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField value={editedRow.crew_name || ""} onChange={(e) => handleChange("crew_name", e.target.value)} size="small" /> : row.crew_name}</TableCell>
                {editingRowId === row.id ? (
                  <>
                    <TableCell><TextField value={editedRow.date_start || ""} onChange={(e) => handleChange("date_start", e.target.value)} size="small" /></TableCell>
                    <TableCell><TextField value={editedRow.date_end || ""} onChange={(e) => handleChange("date_end", e.target.value)} size="small" /></TableCell>
                    <TableCell><Select value={editedRow.shift_type || ""} onChange={(e) => handleChange("shift_type", e.target.value)} size="small"><MenuItem value="day">Day</MenuItem><MenuItem value="swing">Swing</MenuItem><MenuItem value="night">Night</MenuItem><MenuItem value="rest">Rest</MenuItem></Select></TableCell>
                    <TableCell><TextField value={editedRow.shift_duration || ""} type="number" onChange={(e) => handleChange("shift_duration", parseInt(e.target.value))} size="small" /></TableCell>
                    {canSeeExperience && <TableCell><Select value={editedRow.experience_type || ""} onChange={(e) => handleChange("experience_type", e.target.value)} size="small"><MenuItem value="green">Green</MenuItem><MenuItem value="yellow">Yellow</MenuItem><MenuItem value="red">Red</MenuItem></Select></TableCell>}
                    <TableCell><IconButton onClick={() => handleSave(row.id)}><SaveIcon /></IconButton><IconButton onClick={handleCancel}><CancelIcon /></IconButton></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{row.date_start || "N/A"}</TableCell>
                    <TableCell>{row.date_end || "N/A"}</TableCell>
                    <TableCell>{row.shift_type || "N/A"}</TableCell>
                    <TableCell>{row.shift_duration || "N/A"}</TableCell>
                    {canSeeExperience && <TableCell>{row.experience_type ? <ExperienceChip level={row.experience_type} /> : "N/A"}</TableCell>}
                    {canEdit && <TableCell><IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton><IconButton onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton></TableCell>}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCrewId && (
        <>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h4">{selectedCrew?.crew_name} Crew</Typography>
          </Box>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Crew</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Role</TableCell>
                  {canSeeExperience && <TableCell>Experience</TableCell>}
                  {canEdit && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {usersByCrew.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select value={editedUser.crew_id} onChange={(e) => handleUserChange("crew_id", e.target.value)} size="small">
                          {crews.map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.crew_name}</MenuItem>
                          ))}
                        </Select>
                      ) : (
                        crews.find(c => c.id === user.crew_id)?.crew_name || "N/A"
                      )}
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select value={editedUser.role} onChange={(e) => handleUserChange("role", e.target.value)} size="small">
                          <MenuItem value="Crew Commander">Crew Commander</MenuItem>
                          <MenuItem value="Crew Chief">Crew Chief</MenuItem>
                          <MenuItem value="Operator">Operator</MenuItem>
                        </Select>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    {canSeeExperience && <TableCell>
                      {editingUserId === user.id ? (
                        <Select value={editedUser.experience_type} onChange={(e) => handleUserChange("experience_type", e.target.value)} size="small">
                          <MenuItem value="green">Green</MenuItem>
                          <MenuItem value="yellow">Yellow</MenuItem>
                          <MenuItem value="red">Red</MenuItem>
                        </Select>
                      ) : (
                        <ExperienceChip level={user.experience_type} />
                      )}
                    </TableCell>}
                    {canEdit && <TableCell>
                      {editingUserId === user.id ? (
                        <>
                          <IconButton onClick={() => handleUserSave(user.id)}><SaveIcon /></IconButton>
                          <IconButton onClick={handleUserCancel}><CancelIcon /></IconButton>
                        </>
                      ) : (
                        <IconButton onClick={() => handleUserEdit(user)}><EditIcon /></IconButton>
                      )}
                    </TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}
