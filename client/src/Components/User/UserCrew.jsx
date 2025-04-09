//Authored by Curtis
//This is incomplete, need enpoints from the backend for the PATCH
import React, { useState, useEffect } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from "@mui/material";


export default function UserCrew () {
  const { id } = useParams()
  const [userCrew, setUserCrew] = useState([])


  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserCrew = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/schedule/crew/${id}`);
        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserCrew([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(data)){
          setUserCrew([data]);
        } else {
          setUserCrew(data)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };

    fetchUserCrew();
  }, [id]);

  console.log("userCrew:", userCrew)
return (
<Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Crew
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Crew Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Shift Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCrew.map((crew) => (
              <TableRow key={crew.id}>
                <TableCell>{crew.id}</TableCell>
                <TableCell>{crew.crew_name}</TableCell>
                <TableCell>{crew.role}</TableCell>
                <TableCell>{crew.crew_start}</TableCell>
                <TableCell>{crew.crew_end}</TableCell>
                <TableCell>{crew.shift_type}</TableCell>
                <TableCell>{crew.shift_duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

  )
}