import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { CertChip } from "../AddOns/ExperienceChip";
import { getAvailableUsers } from './getAvailableUsers';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function CoursePersonnel({ course, registeredUsers }) {
  const [courses, setCourses] = useState([]);
  const [availableUsers, setAvailableUsers] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const availableUsersByRole = {};
        for (const member of registeredUsers) {
          const available = await getAvailableUsers(course.id, member.role);
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
  }, [course.id, registeredUsers]);

  useEffect(() => {
    const initializedUsers = Array.from({length: course.seats}, (_, index) => {
      const user = registeredUsers[index]
      return user ? {
      ...user,
      isEditing: false,
      pendingUserId: user.user_id,
    } : {
      user_id: null,
      role: "Unassigned",
      isEditing: true,
      pendingUserId: null,
      in_progress: "Not Assigned",
      cert_earned: false,
      course_id: course.id,
    }
  })
    setCourses(initializedUsers);
  }, [registeredUsers, course.seats, course.id]);

    const dropdownOptions = (role, assignedUserId) => {
      const availableUsersForRole = availableUsers[role] || [];
      const assignedUser = registeredUsers.find((user) => user.user_id === assignedUserId);
      if (assignedUser && !availableUsersForRole.some((user) => user.id === assignedUserId)) {
        return [{id: null, first_name: "Unassigned", last_name: ""}, assignedUser, ...availableUsersForRole, assignedUser];
      }
      return [{ id: null, first_name: "Unassigned", last_name: "" }, ...availableUsersForRole];
    }

    const handleEditClick = (index) => {
      const updatedCourse = [...registeredUsers];
      updatedCourse[index] = {
        ...updatedCourse[index],
        isEditing: true,
        pendingUserId: updatedCourse[index].user_id,
      }
      setCourses(updatedCourse);
    };

    const handleCancelEdit = (index) => {
      const updatedCourse = [...registeredUsers];
      updatedCourse[index] = {
        ...updatedCourse[index],
        isEditing: false,
        pendingUserId: undefined
      }
      setCourses(updatedCourse);
    };

    const handleDropdownChange = (index, newUserId) => {
      const updatedCourse = [...courses];
      updatedCourse[index] = {
        ...updatedCourse[index],
        pendingUserId: newUserId,
      }
      setCourses(updatedCourse);
      console.log("Dropdown change for index:", index, "New User ID:", newUserId)
    };

    const handleSaveMember = async (index) => {
      const row = courses[index];
      const updatedUserId = row.pendingUserId === "" ? null : row.pendingUserId;
      const oldUserId = row.user_id;
      console.log("courseID", course.id)
      try {

        if (oldUserId && oldUserId !== updatedUserId) {
          await fetch(`http://localhost:8080/course_registration/${course.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({user_id: null}),
          });
          }
      if (updatedUserId) {
        await fetch(`http://localhost:8080/course_registration/${course.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({user_id: updatedUserId}),
        });
      }
          const updatedCourse = [...courses];
          updatedCourse[index] = {
            ...updatedCourse[index],
            user_id: updatedUserId,
            isEditing: false,
            pendingUserId: undefined,
          }

          setCourses(updatedCourse);
          console.log("Updated courses after save:", updatedCourse)

      } catch (error) {
        console.error('Error updating course roster:', error);
        alert('Error updating course roster.');
      }
    };
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
              <TableCell>Course Name</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cert Earned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((user, index) => {
              const options = dropdownOptions(user.role, user.user_id);
            return (
              <TableRow key={`${user.user_id || "unassigned"}-${index}`}>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>
                  <Select
                  value={user.isEditing ? user.pendingUserId || "" : user.user_id || ""}
                  onChange={(e) => handleDropdownChange(index, e.target.value)}
                  displayEmpty
                  size="small"
                  fullWidth
                  disabled={!user.isEditing}
                >
                  <MenuItem value="" disabled>
                    Select User
                  </MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.first_name} {option.last_name}
                    </MenuItem>
                  ))}
                </Select>
                </TableCell>
                <TableCell>{user.in_progress}</TableCell>
                <TableCell>
                  <CertChip earned={user.cert_earned} />
                </TableCell>
                <TableCell>
                  {user.isEditing ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            )
          })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}