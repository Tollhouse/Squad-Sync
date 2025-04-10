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
    user_name: "",
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

   if(!formData){
    return
   }

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if(response.ok){
      const loginRes = await response.json();
      // console.log("loginRes:", loginRes);

      // ✅ Save more useful info for later dashboard logic
      // console.log('loginRes.user_name', loginRes.user.user_name)
      localStorage.setItem("username", loginRes.user.user_name);
      localStorage.setItem("userId", loginRes.user.id);
      localStorage.setItem("userPrivilege", loginRes.user.privilege);


      const users = await response.json()

      // ✅ Save more useful info for later dashboard logic
      localStorage.setItem("username", match.user_name);
      localStorage.setItem("userId", match.id);
      localStorage.setItem("userRole", match.role);

      alert("Login successful!");
      navigate("/"); // Navigate to the Home page post-login.

    } else {
      const errorData = await response.json();
      alert('Login Failed')
    }
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
              name="user_name"
              label="Username"
              value={formData.user_name}
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