// Complete code
// Code written by Harman
// styled with MUI by Lorena

import React from 'react';
import { Box, Container, Typography } from "@mui/material";
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "transparent",
        color: theme.palette.text.primary,
        py: 2,
        textAlign: "center",
        zIndex: 1000,
      })}
    >
      <Container>
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