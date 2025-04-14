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
  // useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const ExperienceChip = ({ level }) => {
  const colorMap = {
    green: { label: "Green", color: "#4caf50" },
    yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
    red: { label: "Red", color: "#f44336" },
  };
  return (
    <span
      style={{
        backgroundColor: colorMap[level]?.color,
        color: colorMap[level]?.textColor || "#fff",
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "0.75rem",
      }}
    >
      {colorMap[level]?.label || level}
    </span>
  );
};

export default function CrewRotationsTable() {
  const userPrivilege = localStorage.getItem('userPrivilege');
  const canEdit = userPrivilege === "scheduler";
  const canSeeExperience = ["commander", "scheduler"].includes(userPrivilege);
  const [isAddingRotation, setIsAddingRotation] = useState(false);
  const [newRotation, setNewRotation] = useState({
    crew_name: "",
    date_start: "",
    date_end: "",
    shift_type: "",
    shift_duration: "",
    experience_type: "",
  });
  const [confirmNewRotationOpen, setConfirmNewRotationOpen] = useState(false);
  const [crews, setCrews] = useState([]);
  const crewWithRotations = crews
  .map((crew) => {
    const rotation = rotations.find((r) => r.crew_id === crew.id);
    return { ...crew, ...rotation };
  })
  .sort((a, b) => a.id - b.id);
  const [selectedCrewId, setSelectedCrewId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [pendingRotationId, setPendingRotationId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmRotationSaveOpen, setConfirmRotationSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [rotations, setRotations] = useState([]);

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

  // // Auto-fill crew_id in form when a crew is selected
  // useEffect(() => {
  //   if (isAddingUser && selectedCrewId) {
  //     setNewUser((prev) => ({
  //       ...prev,
  //       crew_id: selectedCrewId,
  //     }));
  //   }
  // }, [selectedCrewId, isAddingUser]);

  const handleChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewRotationChange = (field, value) => {
    setNewRotation((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  const handleSave = (id) => {
    setPendingRotationId(id);
    setConfirmRotationSaveOpen(true);
  };

  const handleEdit = (rotation) => {
    setEditingRowId(rotation.id);
    setEditedRow(rotation);
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
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
      </Container>
    </>
  )}


// // Dont trust this code, but this is what ChatGPT is providing
// //// CrewRotationsTable.jsx
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
//   Button,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CancelIcon from "@mui/icons-material/Cancel";

// // You can either define ExperienceChip here or import it if shared.
// const ExperienceChip = ({ level }) => {
//   const colorMap = {
//     green: { label: "Green", color: "#4caf50" },
//     yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
//     red: { label: "Red", color: "#f44336" },
//   };
//   return (
//     <span
//       style={{
//         backgroundColor: colorMap[level]?.color,
//         color: colorMap[level]?.textColor || "#fff",
//         fontWeight: 600,
//         padding: "2px 6px",
//         borderRadius: "4px",
//         fontSize: "0.75rem",
//       }}
//     >
//       {colorMap[level]?.label || level}
//     </span>
//   );
// };

// export default function CrewRotationsTable({
//   crews,
//   rotations,
//   canEdit,
//   canSeeExperience,
//   editingRowId,
//   editedRow,
//   newRotation,
//   isAddingRotation,
//   handleNewRotationChange,
//   handleEdit,
//   handleCancel,
//   handleSave,
//   handleDelete,
// }) {
//   // Merge crews with rotations for display purposes.
//   const crewWithRotations = crews
//     .map((crew) => {
//       const rotation = rotations.find((r) => r.crew_id === crew.id);
//       return { ...crew, ...rotation };
//     })
//     .sort((a, b) => a.id - b.id);

//   return (
//     <>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => {} /* Optionally, handle a new rotation externally */}
//         disabled={!canEdit}
//       >
//         + Add New Rotation
//       </Button>
//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Crew Name</TableCell>
//               <TableCell>Start Date</TableCell>
//               <TableCell>End Date</TableCell>
//               <TableCell>Shift Type</TableCell>
//               <TableCell>Duration</TableCell>
//               {canSeeExperience && <TableCell>Experience</TableCell>}
//               {canEdit && <TableCell>Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {/* New rotation row */}
//             {isAddingRotation && (
//               <TableRow>
//                 <TableCell>New</TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={newRotation.crew_name || ""}
//                     onChange={(e) =>
//                       handleNewRotationChange("crew_name", e.target.value)
//                     }
//                     placeholder="Crew Name"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={newRotation.date_start}
//                     onChange={(e) =>
//                       handleNewRotationChange("date_start", e.target.value)
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={newRotation.date_end}
//                     onChange={(e) =>
//                       handleNewRotationChange("date_end", e.target.value)
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Select
//                     size="small"
//                     value={newRotation.shift_type}
//                     onChange={(e) =>
//                       handleNewRotationChange("shift_type", e.target.value)
//                     }
//                   >
//                     <MenuItem value="day">Day</MenuItem>
//                     <MenuItem value="swing">Swing</MenuItem>
//                     <MenuItem value="night">Night</MenuItem>
//                     <MenuItem value="rest">Rest</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     type="number"
//                     value={newRotation.shift_duration}
//                     onChange={(e) =>
//                       handleNewRotationChange(
//                         "shift_duration",
//                         parseInt(e.target.value)
//                       )
//                     }
//                   />
//                 </TableCell>
//                 {canSeeExperience && (
//                   <TableCell>
//                     <Select
//                       size="small"
//                       value={newRotation.experience_type}
//                       onChange={(e) =>
//                         handleNewRotationChange(
//                           "experience_type",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <MenuItem value="green">Green</MenuItem>
//                       <MenuItem value="yellow">Yellow</MenuItem>
//                       <MenuItem value="red">Red</MenuItem>
//                     </Select>
//                   </TableCell>
//                 )}
//                 <TableCell>
//                   <IconButton onClick={() => handleSave("new")}>
//                     <SaveIcon />
//                   </IconButton>
//                   <IconButton onClick={handleCancel}>
//                     <CancelIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             )}

//             {crewWithRotations.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>
//                   {editingRowId === row.id ? (
//                     <TextField
//                       value={editedRow.crew_name || ""}
//                       onChange={(e) =>
//                         handleNewRotationChange("crew_name", e.target.value)
//                       }
//                       size="small"
//                     />
//                   ) : (
//                     row.crew_name
//                   )}
//                 </TableCell>
//                 {editingRowId === row.id ? (
//                   <>
//                     <TableCell>
//                       <TextField
//                         value={editedRow.date_start || ""}
//                         onChange={(e) =>
//                           handleNewRotationChange("date_start", e.target.value)
//                         }
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         value={editedRow.date_end || ""}
//                         onChange={(e) =>
//                           handleNewRotationChange("date_end", e.target.value)
//                         }
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={editedRow.shift_type || ""}
//                         onChange={(e) =>
//                           handleNewRotationChange("shift_type", e.target.value)
//                         }
//                         size="small"
//                       >
//                         <MenuItem value="day">Day</MenuItem>
//                         <MenuItem value="swing">Swing</MenuItem>
//                         <MenuItem value="night">Night</MenuItem>
//                         <MenuItem value="rest">Rest</MenuItem>
//                       </Select>
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         value={editedRow.shift_duration || ""}
//                         type="number"
//                         onChange={(e) =>
//                           handleNewRotationChange(
//                             "shift_duration",
//                             parseInt(e.target.value)
//                           )
//                         }
//                         size="small"
//                       />
//                     </TableCell>
//                     {canSeeExperience && (
//                       <TableCell>
//                         <Select
//                           value={editedRow.experience_type || ""}
//                           onChange={(e) =>
//                             handleNewRotationChange(
//                               "experience_type",
//                               e.target.value
//                             )
//                           }
//                           size="small"
//                         >
//                           <MenuItem value="green">Green</MenuItem>
//                           <MenuItem value="yellow">Yellow</MenuItem>
//                           <MenuItem value="red">Red</MenuItem>
//                         </Select>
//                       </TableCell>
//                     )}
//                     <TableCell>
//                       <IconButton onClick={() => handleSave(row.id)}>
//                         <SaveIcon />
//                       </IconButton>
//                       <IconButton onClick={handleCancel}>
//                         <CancelIcon />
//                       </IconButton>
//                     </TableCell>
//                   </>
//                 ) : (
//                   <>
//                     <TableCell>{row.date_start || "N/A"}</TableCell>
//                     <TableCell>{row.date_end || "N/A"}</TableCell>
//                     <TableCell>{row.shift_type || "N/A"}</TableCell>
//                     <TableCell>{row.shift_duration || "N/A"}</TableCell>
//                     {canSeeExperience && (
//                       <TableCell>
//                         {row.experience_type ? (
//                           <ExperienceChip level={row.experience_type} />
//                         ) : (
//                           "N/A"
//                         )}
//                       </TableCell>
//                     )}
//                     {canEdit && (
//                       <TableCell>
//                         <IconButton onClick={() => handleEdit(row)}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(row.id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     )}
//                   </>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// }
