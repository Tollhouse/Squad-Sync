import React from "react";
import {
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
import { CertChip } from "../AddOns/ExperienceChip";

export default function CoursePersonnel({ course, registeredUsers }) {
  return (
    <>
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {course.course_name} - Registered Personnel
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>In Progress</TableCell>
              <TableCell>Cert Earned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUsers.map((user) => (
              <TableRow key={`${user.user_id}-${user.course_id}`}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.in_progress ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <CertChip earned={user.cert_earned} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}