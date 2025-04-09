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


export default function UserCourse () {
  const { id } = useParams()
  const [userCourse, setUserCourse] = useState([])


  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/schedule/course/${id}`);
        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserCourse([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(data)){
          setUserCourse([data]);
        } else {
          setUserCourse(data)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };

    fetchUserCourse();
  }, [id]);

  console.log("userCourse:", userCourse)
return (
<Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Courses
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Certification Awarded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCourse.map((course) => (
              <TableRow key={course.registration_idid}>
                <TableCell>{course.registration_id}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.course_start}</TableCell>
                <TableCell>{course.course_end}</TableCell>
                <TableCell>{course.cert_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

  )
}