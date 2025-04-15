import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAvailableUsers } from './getAvailableUsers';
import { ExperienceChip } from '../AddOns/ExperienceChip';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

function CrewRoster({ crew_id }) {
  const [roster, setRoster] = useState([]);
  const [availableUsers, setAvailableUsers] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch roster data
        let rosterData = await fetch(`http://localhost:8080/crews/roster/${crew_id}`);
        rosterData = await rosterData.json();


        if (!Array.isArray(rosterData)) {
          rosterData = []
        }

        const operators = rosterData.filter((member) => member.role === "Operator");
        const nonOperators = rosterData.filter((member) => member.role !== "Operator");

        const operatorDefaults = [
          { role: "Operator", crew_id, user_id: null, user_experience: null },
          { role: "Operator", crew_id, user_id: null, user_experience: null },
          { role: "Operator", crew_id, user_id: null, user_experience: null },
        ];

        const nonOperatorDefaults = [
          { role: "Crew Commander", crew_id, user_id: null, user_experience: null },
          { role: "Crew Chief", crew_id, user_id: null, user_experience: null },
        ];

        const mergedOperators = operatorDefaults.map((defaultOperator, index) => {
          return operators[index] || defaultOperator;
        });

        const mergedNonOperators = nonOperatorDefaults.map((defaultRole) => {
          const assignedMember = nonOperators.find(
            (member) => member.role === defaultRole.role
          );
          return assignedMember || defaultRole;
        });


        const mergedRoster = [...mergedNonOperators, ...mergedOperators];

        if (rosterData.length === 0) {
          console.log('No members assigned to this Crew')
          setRoster([...nonOperatorDefaults, ...operatorDefaults]);
        } else {
          //const initializedRoster = mergedRoster.map((member) => ({ ...member, isEditing: false }));
          setRoster(mergedRoster)
        }
        
        const availableUsersByRole = {};
        for (const member of mergedRoster) {
          const available = await getAvailableUsers(crew_id, member.role);
          availableUsersByRole[member.role] = available;
        }

        setAvailableUsers(availableUsersByRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [crew_id]);
console.log("availableUsers", availableUsers)
console.log("roster", roster)
  const handleEditClick = (index) => {
    const updatedRoster = [...roster];
    updatedRoster[index].isEditing = true;
    updatedRoster[index].pendingUserId = updatedRoster[index].user_id;
    setRoster(updatedRoster);
  };

  const handleCancelEdit = (index) => {
    const updatedRoster = [...roster];
    updatedRoster[index].isEditing = false;
    updatedRoster[index].pendingUserId = updatedRoster[index].user_id;
    setRoster(updatedRoster);
  };

  const handleDropdownChange = (index, newUserId) => {
    const updatedRoster = [...roster];
    updatedRoster[index].pendingUserId = newUserId;
    setRoster(updatedRoster);
  };

  const handleSaveMember = (index) => {
    const row = roster[index];

    fetch(`http://localhost:8080/crew_rotations/${crew_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ user_id: row.pendingUserId }),
    })
      .then((response) => {
        if (response.ok) {
          alert(`Crew member for role "${row.role}" updated successfully! `);
          const updatedRoster = [...roster];
          updatedRoster[index].user_id = row.pendingUserId;
          updatedRoster[index].isEditing = false;
          setRoster(updatedRoster);
        } else {
          alert('Failed to update crew roster.');
        }
      })
      .catch((error) => {
        console.error('Error updating crew roster:', error);
        alert('Error updating crew roster.');
      });
  };


  return (
    <>
    <Box sx={{ m: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Crew Roster
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Crew ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {roster.map((s, index) => {
              const assignedUser =
              availableUsers[s.role]?.find((user) => user.id === s.user_id) || null;
              //  s.pendingUserId || s.user_id;
              const availableUsersForRole = availableUsers[s.role] || []
              const dropdownOptions = assignedUser
              ? [assignedUser, ...availableUsersForRole.filter((user) => user.id !== s.user_id)]
              : availableUsersForRole;

              return (
                <TableRow key={s.user_id || index}>

                  <TableCell>{s.crew_id}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>
                    <Select

                      value={s.user_id || ""}
                      onChange={(e) => handleDropdownChange(index, e.target.value)}
                      displayEmpty
                      size="small"
                      fullWidth
                      disabled={!s.isEditing}

                    >
                      <MenuItem value="" disabled>
                        Select User
                      </MenuItem>
      <MenuItem value={null}>-Unassigned-</MenuItem>
                      {dropdownOptions.map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {user.first_name} {user.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <ExperienceChip level={s.user_experience} />
                  </TableCell>

                  <TableCell>
                    {s.isEditing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => handleSaveMember(index)} aria-label="save">
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleCancelEdit(index)} aria-label="cancel">
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton onClick={() => handleEditClick(index)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>

                </TableRow>
              );
            })}
            {roster.length === 0 && (
              <TableRow>

                <TableCell colSpan={5} align="center">

                  No members assigned to this crew
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


export default CrewRoster;

