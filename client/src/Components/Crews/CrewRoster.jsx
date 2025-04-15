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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAvailableUsers } from './getAvailableUsers';
import ExperienceChip from '../AddOns/ExperinceChip';

function CrewRoster({ crew_id }) {
  const [roster, setRoster] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

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

  const handleAddMember = (user_id, role) => {
    console.log(`Adding user ${user_id} to crew } as ${role}`)
    //Need to add logic to assign user to the crew
  }
console.log("Roster", roster)
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
            </TableRow>
          </TableHead>
          <TableBody>
            {roster.map((s) => {

              const assignedUser = roster.find((user) => user.user_id === s.user_id);
              const availableUsersForRole = availableUsers[s.role] || [];
              const dropdownOptions = assignedUser
                ? [assignedUser, ...availableUsersForRole.filter((user) => user.user_id !== s.user_id)]
                : availableUsersForRole;

              return (
                <TableRow key={s.user_id}>
                  <TableCell>{s.crew_id}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>
                    <Select
                      value={s.user_id}
                      onChange={(e) => handleAddMember(e.target.value, s.role)}
                      displayEmpty
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select User
                      </MenuItem>
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
                </TableRow>
              );
            })}
            {roster.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No members assigned to this crew
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CrewRoster;