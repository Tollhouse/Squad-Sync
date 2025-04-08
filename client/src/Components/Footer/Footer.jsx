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
    sx={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      bgcolor: "transparent",
      color: "white",
      py: 2,
      textAlign: "center",
      zIndex: 1000,
    }}
  >
    <Container>
      <Typography variant="body2">
        &copy; {currentYear} Curtis Bonham, Lorena Longoria, Erik Voss,
        Essence Jackson, Jackie Luu, Landon Spencer, Michael Thomas, Tyson
        Butler-Currier, and Harman Gidda. All rights reserved.
      </Typography>
    </Container>
  </Box>
);
}

export default Footer;