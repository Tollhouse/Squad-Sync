// code by Lorena

import React, { useEffect, useState } from "react";
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
} from "@mui/material";

export default function CourseReg() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/course_registrations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch course registrations");
        }
        return response.json();
      })
      .then((data) => {
        setRegistrations(data);
      })
      .catch((error) => {
        console.error("Error fetching course registrations:", error);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Course Registrations
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cert Earned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.user_id}</TableCell>
                <TableCell>{reg.course_id}</TableCell>
                <TableCell>{reg.in_progress}</TableCell>
                <TableCell>{reg.cert_earned ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}