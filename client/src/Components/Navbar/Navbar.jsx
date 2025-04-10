import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  // Check authentication by seeing if a username exists in localStorage.
  const isAuthenticated = localStorage.getItem('username');
  const username = localStorage.getItem('username');
  const userPrivilege = localStorage.getItem('userPrivilege');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    // Remove all authentication details.
    localStorage.removeItem('session_id');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPrivilege');
    navigate('/login');
  };

  // Render nav items based on whether the user is authenticated,
  // and if so, render role-specific buttons.
  const renderNavItems = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Button
            key="signup"
            onClick={() => navigate('/signup')}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Sign Up
          </Button>
          <Button
            key="login"
            onClick={() => navigate('/login')}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Log In
          </Button>
        </>
      );
    } else {
      let roleBasedButtons = null;

      if (userPrivilege === 'commander') {
        roleBasedButtons = (
          <Button
            key="dashboard"
            onClick={() => navigate('/commander')}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Dashboard
          </Button>
        );
      } else if (userPrivilege === 'scheduler') { //change crew chief back to scheduler
        roleBasedButtons = (
          <>
          <Button
            key="mySchedule"
            onClick={() => navigate(`/user/${userId}`)}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            My Schedule
          </Button>
            <Button
              key="courses"
              onClick={() => navigate('/courses')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Courses
            </Button>
            <Button
              key="crewSchedule"
              onClick={() => navigate('/crew-schedule')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Crew Schedule
            </Button>
            <Button
              key="users"
              onClick={() => navigate('/user/scheduler')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Update Users
            </Button>
          </>
        );
      } else if (userPrivilege === 'user') {
        roleBasedButtons = (
          <Button
            key="mySchedule"
            onClick={() => navigate(`/user/${userId}`)}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            My Schedule
          </Button>
        );
      }

      return (
        <>
          <Typography
            variant="body1"
            sx={{
              my: 2,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              px: 2,
            }}
          >
            Welcome, {username}!
          </Typography>
          {roleBasedButtons}
          <Button
            key="logout"
            onClick={handleLogout}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Log Out
          </Button>
        </>
      );
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            SquadSync
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              key="home"
              onClick={() => navigate('/')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            {renderNavItems()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
