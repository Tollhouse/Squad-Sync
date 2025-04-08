// Signup incomplete, need to match with backend...
// Fetch needs to be updated to match the api
// return information needs better user interface.. update the css
// Code written by Harman

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Stack,
} from "@mui/material";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8081/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(() =>
        alert('you are all signed up'),
        navigate('/login'))
      .catch(err => setError('Signup failed'));
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4 }}
      >
        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Stack spacing={2}>
          <TextField
            label="First Name"
            variant="outlined"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
