// code by lorena - styled with MUI

import React, { useEffect, useState } from "react";
import { ConfirmSaveModal, ConfirmDeleteModal } from "../Modals/ConfirmModal";
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
  Button,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Crews2() {
  const theme = useTheme();
  const [totalUserData, setTotalUserData] = useState([]);
  const [crews, setCrews] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseReg, setCourseReg] = useState([]);
  const [selectedCrewId, setSelectedCrewId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmUserSaveOpen, setConfirmUserSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmRotationSaveOpen, setConfirmRotationSaveOpen] = useState(false);
  const [pendingRotationId, setPendingRotationId] = useState(null);
  const [isAddingRotation, setIsAddingRotation] = useState(false);
  const [confirmNewRotationOpen, setConfirmNewRotationOpen] = useState(false);
  const [newRotation, setNewRotation] = useState({
    crew_name: "",
    date_start: "",
    date_end: "",
    shift_type: "",
    shift_duration: "",
    experience_type: "",
  });
  const [confirmNewUserOpen, setConfirmNewUserOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    crew_id: selectedCrewId,
    first_name: "",
    last_name: "",
    role: "",
    experience_type: "",
  });
  const [editingPosition, setEditingPosition] = useState(null);
  const [editedPosition, setEditedPosition] = useState({});
  const [requiredPositions, setRequiredPositions] = useState([
    { position: "Crew Commander", assigned_user_id: null },
    { position: "Crew Chief", assigned_user_id: null },
    { position: "Operator", assigned_user_id: null },
    { position: "Operator", assigned_user_id: null },
    { position: "Operator", assigned_user_id: null },
  ]);

  // FOR TESTING ONLY - hardocded user privileges
  const [userPrivilege, setUserPrivilege] = useState("scheduler");
  const canEdit = userPrivilege === "scheduler";
  const canSeeExperience = ["commander", "scheduler"].includes(userPrivilege);

  useEffect(() => {
    const fetchData = async () => {
      const [crewRes, rotationRes, userRes, courseRegRes, courseRes] = await Promise.all([
        fetch("http://localhost:8080/crews"),
        fetch("http://localhost:8080/crew_rotations"),
        fetch("http://localhost:8080/users"),
        fetch("http://localhost:8080/course_registration"),
        fetch("http://localhost:8080/courses")
      ]);
      const [crewsData, rotationsData, usersData, courseRegData, courseData] = await Promise.all([
        crewRes.json(),
        rotationRes.json(),
        userRes.json(),
        courseRegRes.json(),
        courseRes.json(),
      ]);
      setCrews(crewsData);
      setRotations(rotationsData);
      setUsers(usersData);
      setCourseReg(courseRegData);
      setCourses(courseData);
      setTotalUserData(
        {
          crewsData,
          rotationsData,
          usersData,
          courseRegData,
          courseData,
        });
    };

    fetchData();
  }, []);

  // Auto-fill crew_id in form when a crew is selected
  useEffect(() => {
    if (isAddingUser && selectedCrewId) {
      setNewUser((prev) => ({
        ...prev,
        crew_id: selectedCrewId,
      }));
    }
  }, [selectedCrewId, isAddingUser]);

  const handleNewRotationChange = (field, value) => {
    setNewRotation((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewRotationSubmit = async () => {
    try {
      let crew = crews.find(
        (c) => c.crew_name.toLowerCase() === newRotation.crew_name.toLowerCase()
      );

      if (!crew) {
        const crewRes = await fetch("http://localhost:8080/crews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crew_name: newRotation.crew_name }),
        });
        if (!crewRes.ok) throw new Error("Failed to create new crew");
        const [createdCrew] = await crewRes.json();
        crew = createdCrew;
        setCrews((prev) => [...prev, createdCrew]);
      }

      const rotationRes = await fetch("http://localhost:8080/crew_rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crew_id: crew.id,
          date_start: newRotation.date_start,
          date_end: newRotation.date_end,
          shift_type: newRotation.shift_type,
          shift_duration: newRotation.shift_duration,
          experience_type: newRotation.experience_type,
        }),
      });

      if (!rotationRes.ok) throw new Error("Failed to create rotation");

      const [createdRotation] = await rotationRes.json();
      setRotations((prev) => [...prev, createdRotation]);
      setIsAddingRotation(false);
      setNewRotation({
        crew_name: "",
        date_start: "",
        date_end: "",
        shift_type: "",
        shift_duration: "",
        experience_type: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewUserSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("User creation failed");

      const [created] = await res.json();
      setUsers((prev) => [...prev, created]);
      setIsAddingUser(false);
      setNewUser({
        crew_id: selectedCrewId || "",
        first_name: "",
        last_name: "",
        role: "",
        experience_type: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleSave = (id) => {
    setPendingRotationId(id);
    setConfirmRotationSaveOpen(true);
  };

  const confirmRotationSave = async () => {
    try {
      const rotationRes = await fetch(`http://localhost:8080/crew_rotations/${pendingRotationId}`, {
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
        prev.map((r) => (r.id === pendingRotationId ? updatedRotation[0] : r))
      );
      setCrews((prev) =>
        prev.map((c) =>
          c.id === editedRow.crew_id ? { ...c, crew_name: editedRow.crew_name } : c
        )
      );
      setEditingRowId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmRotationSaveOpen(false);
    }
  };

  const handleUserSave = (id) => {
    setConfirmUserSaveOpen(true);
  };

  const confirmUserSave = async () => {
    try {
      const userRes = await fetch(`http://localhost:8080/users/${editingUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (!userRes.ok) throw new Error("User update failed");

      const updatedUser = await userRes.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? updatedUser[0] : u))
      );
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmUserSaveOpen(false);
    }
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/crew_rotations/${pendingDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setRotations((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleEditPosition = (position) => {
    setEditingPosition(position);
    const currentPosition = requiredPositions.find(
      (pos) => pos.position === position
    );
    setEditedPosition(currentPosition || {});
  };

  const handlePositionChange = (field, value) => {
    setEditedPosition((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePosition = async () => {
    try {
      // Update the required positions state
      setRequiredPositions((prev) =>
        prev.map((pos) =>
          pos.position === editingPosition ? { ...pos, ...editedPosition } : pos
        )
      );

      // Save changes to the database
      const response = await fetch(
        `http://localhost:8080/crews/${selectedCrewId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requiredPositions),
        }
      );

      if (!response.ok) throw new Error("Failed to save changes");

      setEditingPosition(null);
      setEditedPosition({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelPosition = () => {
    setEditingPosition(null);
    setEditedPosition({});
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
  const crewWithRotations = crews
    .map((crew) => {
      const rotation = rotations.find((r) => r.crew_id === crew.id);
      return { ...crew, ...rotation };
    })
    .sort((a, b) => a.id - b.id);

  const usersByCrew = users.filter((u) => u.crew_id === selectedCrewId);

  const crewStartDate = selectedCrew?.date_start;
  const crewEndDate = selectedCrew?.date_end;

  //HANDLES FILTERING USERS FOR REQUIRED POSITIONS
  console.log("totalUserData:", totalUserData);
  const filterUsersForPosition = (position) => {
    const {crewsData, rotationsData, usersData, courseRegData, courseData} = totalUserData;

    return usersData.filter((user) => {
      const hasCertification = courseRegData.some(
        (course) => course.user_id === user.id && course.cert_earned === true
      );

      const isAvailableForCourses = !courseData.some((course) => {
        return (
          course.user_id === user.id &&
          ((new Date(course.date_start) <= new Date(crewEndDate) &&
            new Date(course.date_end) >= new Date(crewStartDate)) ||
            course.crew_id === selectedCrewId)
        );
      });

      const isAvailableForCrews = !rotationsData.some((rotation) => {
        return (
          rotation.crew_id !== selectedCrewId &&
          rotation.user_id === user.id &&
          ((new Date(rotation.date_start) <= new Date(crewEndDate) &&
            new Date(rotation.date_end) >= new Date(crewStartDate)) ||
            rotation.crew_id === selectedCrewId)
        );
      });



      return hasCertification && isAvailableForCourses && isAvailableForCrews;
    });
  };

  return (
    <>
      {/* Crew Rotation Table */}
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h4">Crew Rotations</Typography>
          {canEdit && (
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              onClick={() => setIsAddingRotation(true)}
            >
              + Add New Rotation
            </Button>
          )}
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
              {/* Add a new crew rotation */}
              {isAddingRotation && (
                <TableRow>
                  <TableCell>New</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={newRotation.crew_name || ""}
                      onChange={(e) =>
                        handleNewRotationChange("crew_name", e.target.value)
                      }
                      placeholder="Crew Name"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={newRotation.date_start}
                      onChange={(e) =>
                        handleNewRotationChange("date_start", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={newRotation.date_end}
                      onChange={(e) =>
                        handleNewRotationChange("date_end", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={newRotation.shift_type}
                      onChange={(e) =>
                        handleNewRotationChange("shift_type", e.target.value)
                      }
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="swing">Swing</MenuItem>
                      <MenuItem value="night">Night</MenuItem>
                      <MenuItem value="rest">Rest</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={newRotation.shift_duration}
                      onChange={(e) =>
                        handleNewRotationChange(
                          "shift_duration",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </TableCell>

                  {canSeeExperience && (
                    <TableCell>
                      <Select
                        size="small"
                        value={newRotation.experience_type}
                        onChange={(e) =>
                          handleNewRotationChange(
                            "experience_type",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="green">Green</MenuItem>
                        <MenuItem value="yellow">Yellow</MenuItem>
                        <MenuItem value="red">Red</MenuItem>
                      </Select>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton onClick={() => setConfirmNewRotationOpen(true)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => setIsAddingRotation(false)}>
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
              {crewWithRotations.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() =>
                    setSelectedCrewId((prev) =>
                      prev === row.id ? null : row.id
                    )
                  }
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {editingRowId === row.id ? (
                      <TextField
                        value={editedRow.crew_name || ""}
                        onChange={(e) =>
                          handleChange("crew_name", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      row.crew_name
                    )}
                  </TableCell>
                  {editingRowId === row.id ? (
                    <>
                      <TableCell>
                        <TextField
                          value={editedRow.date_start || ""}
                          onChange={(e) =>
                            handleChange("date_start", e.target.value)
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRow.date_end || ""}
                          onChange={(e) =>
                            handleChange("date_end", e.target.value)
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editedRow.shift_type || ""}
                          onChange={(e) =>
                            handleChange("shift_type", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="day">Day</MenuItem>
                          <MenuItem value="swing">Swing</MenuItem>
                          <MenuItem value="night">Night</MenuItem>
                          <MenuItem value="rest">Rest</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRow.shift_duration || ""}
                          type="number"
                          onChange={(e) =>
                            handleChange(
                              "shift_duration",
                              parseInt(e.target.value)
                            )
                          }
                          size="small"
                        />
                      </TableCell>
                      {canSeeExperience && (
                        <TableCell>
                          <Select
                            value={editedRow.experience_type || ""}
                            onChange={(e) =>
                              handleChange("experience_type", e.target.value)
                            }
                            size="small"
                          >
                            <MenuItem value="green">Green</MenuItem>
                            <MenuItem value="yellow">Yellow</MenuItem>
                            <MenuItem value="red">Red</MenuItem>
                          </Select>
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton onClick={() => handleSave(row.id)}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel}>
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.date_start || "N/A"}</TableCell>
                      <TableCell>{row.date_end || "N/A"}</TableCell>
                      <TableCell>{row.shift_type || "N/A"}</TableCell>
                      <TableCell>{row.shift_duration || "N/A"}</TableCell>
                      {canSeeExperience && (
                        <TableCell>
                          {row.experience_type ? (
                            <ExperienceChip level={row.experience_type} />
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      )}
                      {canEdit && (
                        <TableCell>
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Required Positions Table */}
        {selectedCrewId && (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h4">{selectedCrew?.crew_name} Crew</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Required Position</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requiredPositions.map((pos, index) => (
                    <TableRow key={index}>
                      <TableCell>{pos.position}</TableCell>
                      <TableCell>
                        {editingPosition === pos.position ? (
                          <Select
                            value={editedPosition.assigned_user_id || ""}
                            onChange={(e) =>
                              handlePositionChange(
                                "assigned_user_id",
                                e.target.value
                              )
                            }
                            size="small"
                          >
                            <MenuItem value="">Unassigned</MenuItem>
                            {filterUsersForPosition(pos.position).map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          users.find((u) => u.id === pos.assigned_user_id)
                            ?.first_name || "Unassigned"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPosition === pos.position ? (
                          <ExperienceChip
                            level={
                              users.find(
                                (u) => u.id === editedPosition.assigned_user_id
                              )?.experience_type || "N/A"
                            }
                          />
                        ) : (
                          <ExperienceChip
                            level={
                              users.find((u) => u.id === pos.assigned_user_id)
                                ?.experience_type || "N/A"
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPosition === pos.position ? (
                          <>
                            <IconButton onClick={handleSavePosition}>
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelPosition}>
                              <CancelIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            onClick={() => handleEditPosition(pos.position)}
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
          </Box>
        )}
      </Container>

      {/* Confirm Modals */}
      <ConfirmSaveModal
        open={confirmRotationSaveOpen}
        onClose={() => setConfirmRotationSaveOpen(false)}
        onConfirm={confirmRotationSave}
      />
      <ConfirmSaveModal
        open={confirmUserSaveOpen}
        onClose={() => setConfirmUserSaveOpen(false)}
        onConfirm={confirmUserSave}
      />
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
      <ConfirmSaveModal
        open={confirmNewRotationOpen}
        onClose={() => setConfirmNewRotationOpen(false)}
        onConfirm={() => {
          setConfirmNewRotationOpen(false);
          handleNewRotationSubmit();
        }}
      />
      <ConfirmSaveModal
        open={confirmNewUserOpen}
        onClose={() => setConfirmNewUserOpen(false)}
        onConfirm={() => {
          setConfirmNewUserOpen(false);
          handleNewUserSubmit();
        }}
      />
    </>
  );
}
