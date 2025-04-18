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
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { getAvailableUsers } from './getAvailableUsers';
import { ExperienceChip } from '../AddOns/ExperienceChip';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function CrewRoster({ crew_id }) {
  const [roster, setRoster] = useState([]);
  const [availableUsers, setAvailableUsers] = useState({});
  const [crewName, setCrewName] = useState("Not Assigned");
  const [crewId, setCrewId] = useState(crew_id);

  useEffect(() => {
    async function fetchData() {
      try {

        let rosterData = await fetch(`http://localhost:8080/crews/roster/${crew_id}`);
        rosterData = await rosterData.json();

        if (rosterData.length > 0) {
          setCrewName(rosterData[0].crew_name || "Not Assigned");
          setCrewId(rosterData[0].crew_id || crew_id);
        } else {
          setCrewName("Not Assigned");
          setCrewId(crew_id);
        }

        if (!Array.isArray(rosterData)) {
          rosterData = []
        }

        const operators = rosterData.filter((member) => member.role === "Operator");
        const nonOperators = rosterData.filter((member) => member.role !== "Operator");

        const operatorDefaults = [
          { role: "Operator", crew_id, user_id: null, user_experience: null, crew_name: crewName },
          { role: "Operator", crew_id, user_id: null, user_experience: null, crew_name: crewName },
          { role: "Operator", crew_id, user_id: null, user_experience: null, crew_name: crewName },
        ];

        const nonOperatorDefaults = [
          { role: "Crew Commander", crew_id, user_id: null, user_experience: null, crew_name: crewName },
          { role: "Crew Chief", crew_id, user_id: null, user_experience: null, crew_name: crewName },
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


        const mergedRoster = [...mergedNonOperators, ...mergedOperators].map((member) => ({
          ...member,
          isEditing: false,
        }));

        if (rosterData.length === 0) {
          console.log("No members assigned to this Crew");
          setRoster([...nonOperatorDefaults, ...operatorDefaults].map((member) => ({
            ...member,
            isEditing: false,
          })));
        } else {
          setRoster(mergedRoster);
        }


        const availableUsersByRole = {};
        for (const member of mergedRoster) {
          const available = await getAvailableUsers(crew_id, member.role);
          const transformedAvailable = available.map((user) => ({
            ...user,
            user_id: user.id
          }))

          availableUsersByRole[member.role] = transformedAvailable;
        }

        setAvailableUsers(availableUsersByRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [crew_id]);

  const handleEditClick = (index) => {
    const updatedRoster = [...roster];
    updatedRoster[index] = {
      ...updatedRoster[index],
      isEditing: true,
      pendingUserId: updatedRoster[index].user_id,
    }
    setRoster(updatedRoster);
  };

  const handleCancelEdit = (index) => {
    const updatedRoster = [...roster];
    updatedRoster[index] = {
      ...updatedRoster[index],
      isEditing: false,
      pendingUserId: undefined
    }
    setRoster(updatedRoster);
  };

  const handleDropdownChange = (index, newUserId) => {
    const updatedRoster = [...roster];
    updatedRoster[index] = {
      ...updatedRoster[index],
      pendingUserId: newUserId,
    }
    setRoster(updatedRoster);
  };

  const handleSaveMember = async (index) => {
    const row = roster[index];
    const updatedUserId = row.pendingUserId === "" ? null : row.pendingUserId;
    const oldUserId = row.user_id;

    try {
      if (updatedUserId === null) {
        if (oldUserId) {

          await fetch(`http://localhost:8080/users/${oldUserId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ crew_id: null }),
          });
        }

        const updatedRoster = [...roster];
        updatedRoster[index] = {
          ...updatedRoster[index],
          user_id: null,
          pendingUserId: null,
          isEditing: false,
          first_name: undefined,
          last_name: undefined,
          user_experience: undefined,
          crew_id: 7,
          crew_name: "Not Assigned",
        };
        setRoster(updatedRoster);
        return;
      }

      const newUserPayload = {
        crew_id: row.crew_id,
      };

      const response = await fetch(`http://localhost:8080/users/${updatedUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newUserPayload),
      });

      if (response.ok) {

        const userRes = await fetch(`http://localhost:8080/users/${updatedUserId}`);
        const updatedUser = await userRes.json();

        const updatedRoster = [...roster];
        updatedRoster[index] = {
          ...updatedRoster[index],
          user_id: updatedUserId,
          isEditing: false,
          user_experience: updatedUser.experience_type,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
        };
        setRoster(updatedRoster);
        alert(`Crew member for role "${row.role}" updated successfully!`);
      } else {
        alert('Failed to update crew roster.');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert('Failed to update crew roster.');
    }
  };

  return (
    <>
    <Box sx={{ m: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {crewName} Crew Roster
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
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {roster.map((s, index) => {
              const selectedValue = s.isEditing ? (s.pendingUserId ?? "") : (s.user_id ?? "");
              const availableUsersForRole = availableUsers[s.role] || [];
              let dropdownOptions = availableUsersForRole.slice();
              if (selectedValue && !dropdownOptions.some(user => user.user_id === selectedValue)) {
                dropdownOptions.unshift({
                  user_id: s.user_id,
                  first_name: s.first_name,
                  last_name: s.last_name,
                });
              }

              return (
                <TableRow key={s.user_id || index}>
                  <TableCell>{s.crew_id}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>
                    <Select
                      value={s.isEditing ? s.pendingUserId || "" : s.user_id || ""}
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
                        <IconButton
                        color="primary"
                        data-testid='test-crewRosterSave' onClick={() => handleSaveMember(index)} aria-label="save">
                          <SaveIcon />
                        </IconButton>
                        <IconButton                         color="error"
                        onClick={() => handleCancelEdit(index)} aria-label="cancel">
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton                         color="primary"
                      data-testid='test-crewRosterEdit' onClick={() => handleEditClick(index)} aria-label="edit">
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

