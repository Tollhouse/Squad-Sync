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

  // Check using the username value in localStorage.
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem('userId');
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
              // Remove all authentication-related details.
              localStorage.removeItem("session_id");
              localStorage.removeItem("username");
              localStorage.removeItem("userRole");
              localStorage.removeItem("userId");
              setLoggedIn(false);
              navigate("/logout");
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
      const response = await fetch("http://localhost:8080/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const users = await response.json();

      // const match = users.find(
      //   (u) =>
      //     u.user_name.toLowerCase() === formData.username.toLowerCase() &&
      //     u.password === formData.password
      // );

      // if (!match) {
      //   throw new Error("Invalid credentials");
      // }

      // ✅ Save more useful info for later dashboard logic
      localStorage.setItem("username", match.user_name);
      localStorage.setItem("userId", match.id);
      localStorage.setItem("userRole", match.role);

      alert("Login successful!");
      navigate("/"); // Navigate to the Home page post-login.
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
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}