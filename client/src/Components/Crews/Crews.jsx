// code by lorena - styled with MUI

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
  Chip,
  useTheme,
} from "@mui/material";

export default function Crews() {
  const theme = useTheme();
  const [crews, setCrews] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCrewId, setSelectedCrewId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crewsRes, rotationsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8080/crews"),
          fetch("http://localhost:8080/crew_rotations"),
          fetch("http://localhost:8080/users"),
        ]);

        if (!crewsRes.ok || !rotationsRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const crewsData = await crewsRes.json();
        const rotationsData = await rotationsRes.json();
        const usersData = await usersRes.json();

        setCrews(crewsData);
        setRotations(rotationsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const crewWithRotations = crews.map((crew) => {
    const rotation = rotations.find((r) => r.crew_id === crew.id);
    return { ...crew, ...rotation };
  });

  const usersByCrew = crews.map((crew) => {
    const assignedUsers = users.filter((user) => user.crew_id === crew.id);
    return {
      crew_name: crew.crew_name,
      crew_id: crew.id,
      users: assignedUsers,
    };
  });

  const selectedCrew = usersByCrew.find((c) => c.crew_id === selectedCrewId);

  // Color-coded experience chip
  const ExperienceChip = ({ level }) => {
    const colorMap = {
      green: { label: "Green", color: "#4caf50" },
      yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
      red: { label: "Red", color: "#f44336" },
    };

    const chipStyle = {
      backgroundColor: colorMap[level]?.color || "#ccc",
      color: colorMap[level]?.textColor || "#fff",
      fontWeight: 600,
      textTransform: "capitalize",
    };

    return (
      <Chip
        label={colorMap[level]?.label || level}
        size="small"
        sx={chipStyle}
      />
    );
  };

  return (
    <Container maxWidth="lg">
      {/* Crew Rotations Table */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Crew Rotations
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Crew Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Duration (hrs)</TableCell>
              <TableCell>Experience</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crewWithRotations.map((crew) => (
              <TableRow
                key={crew.id}
                onClick={() =>
                  setSelectedCrewId((prevId) =>
                    prevId === crew.id ? null : crew.id
                  )
                }
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(0, 0, 0, 0.04)"
                        : "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <TableCell>{crew.id}</TableCell>
                <TableCell>{crew.crew_name}</TableCell>
                <TableCell>{crew.date_start || "N/A"}</TableCell>
                <TableCell>{crew.date_end || "N/A"}</TableCell>
                <TableCell>{crew.shift_type || "N/A"}</TableCell>
                <TableCell>{crew.shift_duration || "N/A"}</TableCell>
                <TableCell>
                  {crew.experience_type ? (
                    <ExperienceChip level={crew.experience_type} />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Conditional: Selected Crew Personnel Table */}
      {selectedCrew && (
        <>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              {selectedCrew.crew_name} Crew
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Experience</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCrew.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <ExperienceChip level={user.experience_type} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}