// Navbar incomplete, needs more details...
// Code written by Harman
// How to authenticate a login user? local storage or JWT token?

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('session_id');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('username');
    navigate('/login');
  };

   const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            SquadSync
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/');
                }}
              >
                <Typography textAlign="center">Home</Typography>

              </MenuItem>
              {!isAuthenticated ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/signup');
                    }}
                  >
                    <Typography textAlign="center">Sign Up</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/login');
                    }}
                  >
                    <Typography textAlign="center">Log In</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem disabled>
                    <Typography textAlign="center">Welcome, {username}!</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      handleLogout();
                    }}
                  >
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key="home"
              onClick={() => navigate('/')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            {!isAuthenticated ? (
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
            ) : (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    paddingX: 2
                  }}
                >
                  Welcome, {username}!
                </Typography>
                <Button
                  key="logout"
                  onClick={handleLogout}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Log Out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
