import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Container, Stack } from "@mui/material";
import "./PasswordChange.css";

function PasswordChange() {
  const userId = localStorage.getItem("userId");
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    secondPassword: ''
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();


  function handleChangePassword() {
    setChangePassword(!changePassword);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.password == formData.secondPassword) {
      try {
        let response = await fetch(
          `http://localhost:8080/users/password/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({password: formData.password}),
          }
        );

        response = await response.json();
        alert("Password successfully changed");
        navigate("/");
      } catch (err) {
        alert("Operation Unsuccessful");
        console.log(err);
      }
    }
    else{
        alert("Passwords must match")
    }
  }

  return (
    <div className="body">
      <Button
        color="primary"
        variant="contained"
        onClick={handleChangePassword}
      >
        Change Password
      </Button>

      {changePassword ? (
        <Container maxWidth="sm">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
          >
          {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          )}
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              data-testid='test-passInput'
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Re-Type Password"
              type="password"
              variant="outlined"
              data-testid='test-passInput2'
              name="secondPassword"
              value={formData.secondPassword}
              onChange={handleChange}
              fullWidth
            />
            <Button
              color="primary"
              variant="contained"
              type="submit"
              >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Container>
      ) : null}
    </div>
  );
}

export default PasswordChange;
