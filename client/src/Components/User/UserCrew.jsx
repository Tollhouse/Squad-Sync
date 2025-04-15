//Authored by Curtis
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
        const response = await fetch(`http://localhost:8080/users/schedule/${id}`);
        const data = await response.json();
        console.log("data", data)
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserCrew([]);
          console.warn('No user data was found');
        } else {
          const crewData = data.find((crew) => crew.crewDates)?.crewDates || [];
          setUserCrew(crewData);
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };
    fetchUserCrew();
  }, [id]);
  console.log("userCrew", userCrew)

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
            {userCrew.length > 0? (
              userCrew.map((crew, index) => (
              <TableRow key={crew.id || index}>
                <TableCell>{crew.crew_id}</TableCell>
                <TableCell>{crew.crew_name}</TableCell>
                <TableCell>{crew.role}</TableCell>
                <TableCell>{new Date(crew.date_start).toISOString().split("T")[0]}</TableCell>
                <TableCell>{new Date(crew.date_end).toISOString().split("T")[0]}</TableCell>
                <TableCell>{crew.shift_type}</TableCell>
                <TableCell>{crew.shift_duration}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  You have not been assigned to a crew
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

  )
}