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
      let rosterData = await fetch(`http://localhost:8080/crews/roster/${crew_id}`);
      rosterData = await rosterData.json()
      setRoster(rosterData)

console.log("rosterData", rosterData)

      const availableUsersByRole = {}
      for (const member of rosterData) {
        const available = await getAvailableUsers(crew_id, member.role)
        availableUsersByRole[member.role] = available
      }
      console.log("Available Users by Role:", availableUsersByRole);
      setAvailableUsers(availableUsersByRole);
    }
    fetchData()

  }, [crew_id]);

  const handleAddMember = (user_id, role) => {
    console.log(`Adding user ${user_id} to crew ${crew_name} as ${role}`)
  }

  // Replace 'Add Member' button with dropdown menu showing available users
  // const handleAddMember = () => {
  //   console.log(`Available for crew ${crew_id}: user_id: ${availableUserID}`);
  // };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Crew Roster
        </Typography>
        {/* <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMember}
        >
          Add Member
        </Button> */}
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
            {roster.map((s) => (
              <TableRow key={s.user_id}>
                <TableCell>{s.crew_id}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell>
                  <Select
                    value=""
                    onChange={(e) => handleAddMember(e.target.value, s.role)}
                    displayEmpty
                    size="small"
                    fullWidth
                    >
                      <MenuItem value="" disabled>
                      Select User
                      </MenuItem>
                      {availableUsers[s.role]?.map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {user.first_name} {user.last_name}
                          </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                <TableCell><ExperienceChip level={s.user_experience} /></TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CrewRoster;