// Incomplete code, need to determin how to store username
// Code written by Harman
// MUI styling by Lorena

import React from "react";
import "./Home.css";
// import { Container, Box, Typography, Button, Stack } from "@mui/material";

export default function Home() {
  const username = localStorage.getItem("username");
  console.log(username);

  return (
    <>
      <h3> Welcome to Home Page </h3>
      <div className="NavContainer">
        <div className="button">
          <a href="/login" className="iconeLink">
            <button className="iconButton"> User Log In</button>
          </a>
          <a href="/signup" className="iconeLink">
            <button className="iconButton"> New User Sign up</button>
          </a>
        </div>

        <div className="userStatus">
          {username ? <p> Welcome, {username}!</p> : <p> Guest </p>}
        </div>
      </div>
    </>
  );
}

// return (
//   <Container maxWidth="sm">
//     <Box sx={{ mt: 4, textAlign: "center" }}>
//       <Typography variant="h3" gutterBottom>
//         Welcome to Home Page
//       </Typography>
//       <Stack
//         spacing={2}
//         direction="row"
//         justifyContent="center"
//         sx={{ my: 2 }}
//       >
//         <Button
//           variant="contained"
//           component={Link}
//           to="/login"
//         >
//           User Log In
//         </Button>
//         <Button
//           variant="outlined"
//           component={Link}
//           to="/signup"
//         >
//           New User Sign Up
//         </Button>
//       </Stack>
//       <Box sx={{ mt: 3 }}>
//         {username ? (
//           <Typography variant="h6">
//             Welcome, {username}!
//           </Typography>
//         ) : (
//           <Typography variant="h6">
//             Guest
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   </Container>
// );
// }
