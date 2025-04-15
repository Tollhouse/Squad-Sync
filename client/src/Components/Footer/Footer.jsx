// Complete code
// Code written by Harman
// styled with MUI by Lorena

import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography } from "@mui/material";
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (

    <Box
      component="footer"
      sx={(theme) => ({
        width: "100%",
        bgcolor: "transparent",
        color: theme.palette.text.primary,
        py: 2,
        textAlign: "center",
        mt: "auto",
      })}
    >
      <Container>
        <Typography variant="body2">
          <Link to="/about" style={{ textDecoration: 'underline', color: 'inherit' }}>
            About
          </Link>
        </Typography>
        <Typography variant="body2">
          &copy; {currentYear} Curtis Bonham, Tyson
          Butler-Currier, Harman Gidda, Essence Jackson, Lorena Longoria, Jackie Luu, Landon Spencer,
          Michael Thomas, and Erik Voss. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;