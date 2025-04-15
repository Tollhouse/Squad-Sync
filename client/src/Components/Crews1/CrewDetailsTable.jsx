import React, { useState, useEffect } from "react";
import {
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
  Button,
  Container,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

// user view/edit privileges
const userPrivilege = localStorage.getItem('userPrivilege');
const canEdit = userPrivilege === "scheduler";
const canSeeExperience = ["commander", "scheduler"].includes(userPrivilege);

// states
export default function CrewDetailsTable({ crews, selectedCrewId }) {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    crew_id: selectedCrewId,
    first_name: "",
    last_name: "",
    role: "",
    experience_type: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmUserSaveOpen, setConfirmUserSaveOpen] = useState(false);
  const [confirmNewUserOpen, setConfirmNewUserOpen] = useState(false);
  const [pendingUserDeleteId, setPendingUserDeleteId] = useState(null);

// fetch users and crews
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isAddingUser && selectedCrewId) {
      setNewUser((prev) => ({ ...prev, crew_id: selectedCrewId }));
    }
  }, [isAddingUser, selectedCrewId]);

  // functions
  function ExperienceChip({ level }) {
    const colorMap = {
      green: { label: "Green", color: "#4caf50" },
      yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
      red: { label: "Red", color: "#f44336" },
    };
    
  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUser(user);
  };

  const handleUserCancel = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleUserChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users/${editingUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const [updated] = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === editingUserId ? updated : u)));
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
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
      if (!res.ok) throw new Error("Failed to create user");
      const [created] = await res.json();
      setUsers((prev) => [...prev, created]);
      setIsAddingUser(false);
      setNewUser({
        crew_id: selectedCrewId,
        first_name: "",
        last_name: "",
        role: "",
        experience_type: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCrew = crews.find((c) => c.id === selectedCrewId);
  const usersByCrew = users.filter((u) => u.crew_id === selectedCrewId);

  if (!selectedCrewId) return null;


  // render crew details table
  return (
    <Container>
      {/* Crew Details Table */}
      {selectedCrewId && (
        <>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h4">
              {selectedCrew?.crew_name} Crew
            </Typography>
            {canEdit && (
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                onClick={() => setIsAddingUser(true)}
              >
                + Add Crew Member
              </Button>
            )}
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
                {/* Add new crew member */}
                {isAddingUser && (
                  <TableRow>
                    <TableCell>
                      <Select
                        value={newUser.crew_id}
                        onChange={(e) =>
                          handleNewUserChange("crew_id", e.target.value)
                        }
                        size="small"
                      >
                        {crews.map((crew) => (
                          <MenuItem key={crew.id} value={crew.id}>
                            {crew.crew_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={newUser.first_name}
                        onChange={(e) =>
                          handleNewUserChange("first_name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={newUser.last_name}
                        onChange={(e) =>
                          handleNewUserChange("last_name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={newUser.role}
                        onChange={(e) =>
                          handleNewUserChange("role", e.target.value)
                        }
                      >
                        <MenuItem value="Crew Commander">
                          Crew Commander
                        </MenuItem>
                        <MenuItem value="Crew Chief">Crew Chief</MenuItem>
                        <MenuItem value="Operator">Operator</MenuItem>
                      </Select>
                    </TableCell>
                    {canSeeExperience && (
                      <TableCell>
                        <Select
                          size="small"
                          value={newUser.experience_type}
                          onChange={(e) =>
                            handleNewUserChange("experience_type", e.target.value)
                          }
                        >
                          <MenuItem value="green">Green</MenuItem>
                          <MenuItem value="yellow">Yellow</MenuItem>
                          <MenuItem value="red">Red</MenuItem>
                        </Select>
                      </TableCell>
                    )}
                    <TableCell>
                      <IconButton onClick={() => setConfirmNewUserOpen(true)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => setIsAddingUser(false)}>
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}

                {usersByCrew.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select
                          value={editedUser.crew_id}
                          onChange={(e) =>
                            handleUserChange("crew_id", e.target.value)
                          }
                          size="small"
                        >
                          {crews.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.crew_name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        crews.find((c) => c.id === user.crew_id)?.crew_name ||
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select
                          value={editedUser.role}
                          onChange={(e) =>
                            handleUserChange("role", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="Crew Commander">
                            Crew Commander
                          </MenuItem>
                          <MenuItem value="Crew Chief">Crew Chief</MenuItem>
                          <MenuItem value="Operator">Operator</MenuItem>
                        </Select>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    {canSeeExperience && (
                      <TableCell>
                        {editingUserId === user.id ? (
                          <Select
                            value={editedUser.experience_type}
                            onChange={(e) =>
                              handleUserChange("experience_type", e.target.value)
                            }
                            size="small"
                          >
                            <MenuItem value="green">Green</MenuItem>
                            <MenuItem value="yellow">Yellow</MenuItem>
                            <MenuItem value="red">Red</MenuItem>
                          </Select>
                        ) : (
                          <ExperienceChip level={user.experience_type} />
                        )}
                      </TableCell>
                    )}
                    {canEdit && (
                      <TableCell>
                        {editingUserId === user.id ? (
                          <>
                            <IconButton onClick={() => handleUserSave(user.id)}>
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleUserCancel}>
                              <CancelIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => handleUserEdit(user)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleUserDelete(user.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    )}
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


// // Dont trust it but here is ChatGPT response
// // CrewDetailsTable.jsx
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Select,
//   MenuItem,
//   IconButton,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CancelIcon from "@mui/icons-material/Cancel";

// export default function CrewDetailsTable({
//   crews,
//   users,
//   selectedCrewId,
//   canEdit,
//   canSeeExperience,
//   editingUserId,
//   editedUser,
//   newUser,
//   isAddingUser,
//   handleNewUserChange,
//   handleUserEdit,
//   handleUserCancel,
//   handleUserSave,
//   handleUserDelete,
// }) {
//   const selectedCrew = crews.find((c) => c.id === selectedCrewId);
//   const usersByCrew = users.filter((u) => u.crew_id === selectedCrewId);

//   return (
//     <>
//       <h4>{selectedCrew?.crew_name} Crew</h4>
//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Crew</TableCell>
//               <TableCell>First Name</TableCell>
//               <TableCell>Last Name</TableCell>
//               <TableCell>Role</TableCell>
//               {canSeeExperience && <TableCell>Experience</TableCell>}
//               {canEdit && <TableCell>Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {/* New crew member */}
//             {isAddingUser && (
//               <TableRow>
//                 <TableCell>
//                   <Select
//                     value={newUser.crew_id || ""}
//                     onChange={(e) =>
//                       handleNewUserChange("crew_id", e.target.value)
//                     }
//                     size="small"
//                   >
//                     {crews.map((crew) => (
//                       <MenuItem key={crew.id} value={crew.id}>
//                         {crew.crew_name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={newUser.first_name || ""}
//                     onChange={(e) =>
//                       handleNewUserChange("first_name", e.target.value)
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={newUser.last_name || ""}
//                     onChange={(e) =>
//                       handleNewUserChange("last_name", e.target.value)
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Select
//                     size="small"
//                     value={newUser.role || ""}
//                     onChange={(e) =>
//                       handleNewUserChange("role", e.target.value)
//                     }
//                   >
//                     <MenuItem value="Crew Commander">Crew Commander</MenuItem>
//                     <MenuItem value="Crew Chief">Crew Chief</MenuItem>
//                     <MenuItem value="Operator">Operator</MenuItem>
//                   </Select>
//                 </TableCell>
//                 {canSeeExperience && (
//                   <TableCell>
//                     <Select
//                       size="small"
//                       value={newUser.experience_type || ""}
//                       onChange={(e) =>
//                         handleNewUserChange("experience_type", e.target.value)
//                       }
//                     >
//                       <MenuItem value="green">Green</MenuItem>
//                       <MenuItem value="yellow">Yellow</MenuItem>
//                       <MenuItem value="red">Red</MenuItem>
//                     </Select>
//                   </TableCell>
//                 )}
//                 <TableCell>
//                   <IconButton onClick={() => handleUserSave("new")}>
//                     <SaveIcon />
//                   </IconButton>
//                   <IconButton onClick={handleUserCancel}>
//                     <CancelIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             )}

//             {usersByCrew.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell>
//                   {editingUserId === user.id ? (
//                     <Select
//                       value={editedUser.crew_id}
//                       onChange={(e) =>
//                         handleNewUserChange("crew_id", e.target.value)
//                       }
//                       size="small"
//                     >
//                       {crews.map((crew) => (
//                         <MenuItem key={crew.id} value={crew.id}>
//                           {crew.crew_name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   ) : (
//                     crews.find((c) => c.id === user.crew_id)?.crew_name || "N/A"
//                   )}
//                 </TableCell>
//                 <TableCell>{user.first_name}</TableCell>
//                 <TableCell>{user.last_name}</TableCell>
//                 <TableCell>
//                   {editingUserId === user.id ? (
//                     <Select
//                       value={editedUser.role}
//                       onChange={(e) =>
//                         handleNewUserChange("role", e.target.value)
//                       }
//                       size="small"
//                     >
//                       <MenuItem value="Crew Commander">Crew Commander</MenuItem>
//                       <MenuItem value="Crew Chief">Crew Chief</MenuItem>
//                       <MenuItem value="Operator">Operator</MenuItem>
//                     </Select>
//                   ) : (
//                     user.role
//                   )}
//                 </TableCell>
//                 {canSeeExperience && (
//                   <TableCell>
//                     {editingUserId === user.id ? (
//                       <Select
//                         value={editedUser.experience_type}
//                         onChange={(e) =>
//                           handleNewUserChange("experience_type", e.target.value)
//                         }
//                         size="small"
//                       >
//                         <MenuItem value="green">Green</MenuItem>
//                         <MenuItem value="yellow">Yellow</MenuItem>
//                         <MenuItem value="red">Red</MenuItem>
//                       </Select>
//                     ) : (
//                       user.experience_type
//                     )}
//                   </TableCell>
//                 )}
//                 {canEdit && (
//                   <TableCell>
//                     {editingUserId === user.id ? (
//                       <>
//                         <IconButton onClick={() => handleUserSave(user.id)}>
//                           <SaveIcon />
//                         </IconButton>
//                         <IconButton onClick={handleUserCancel}>
//                           <CancelIcon />
//                         </IconButton>
//                       </>
//                     ) : (
//                       <>
//                         <IconButton onClick={() => handleUserEdit(user)}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleUserDelete(user.id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </>
//                     )}
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// }
