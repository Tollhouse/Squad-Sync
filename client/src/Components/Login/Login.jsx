// code by Lorena - using MUI for styling

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Stack,
} from "@mui/material";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const [loggedIn, setLoggedIn] = useState(!!username);

  if (loggedIn) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">
            You are already logged in as {username}
          </Typography>
          <Typography variant="body1">Not {username}?</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => {
              localStorage.removeItem("username");
              setLoggedIn(false);
              navigate("/Logout");
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.username,
          password: formData.password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Save user ID and role for redirection
      localStorage.setItem("username", formData.username);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.privilege); 
  
      alert("Login successful!");
      navigate("/Dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              variant="outlined"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            <Typography variant="body1" align="center">
              Don't have an account?
            </Typography>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/Signup")}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
