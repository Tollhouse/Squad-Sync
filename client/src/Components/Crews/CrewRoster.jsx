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
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAvailableUsers } from './getAvailableUsers';
import ExperienceChip from '../AddOns/ExperinceChip';

function CrewRoster({ crew_id }) {
  // console.log(crew_id)
  const [roster, setRoster] = useState([]);
  const [availableUserID, setAvailableUserID] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let rosterData = await fetch(`http://localhost:8080/crews/roster/${crew_id}`)
      rosterData = await rosterData.json()
      setRoster(rosterData)
    }
    async function fetchAvailableUsers() {
      const available = await getAvailableUsers(crew_id);
      setAvailableUserID(available);
    }
    fetchData();
    fetchAvailableUsers();
  }, [crew_id])

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
                <TableCell>{s.last_name}, {s.first_name}</TableCell>
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