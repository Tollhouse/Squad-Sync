// Incomplete code, need to determine how to store username
// Code written by Harman
// MUI styling by Lorena

import "./Home.css";
import Footer from "../Footer/Footer.jsx";
// import { Container, Box, Typography, Button, Stack } from "@mui/material";

export default function Home() {
  const username = localStorage.getItem("username");
  // console.log(username);

  return (
    <>
      <h3> Welcome to Squad Sync</h3>
      <div className="NavContainer">

        <p>Our app strives to provide a one stop, scalable solution that provides command and user dashboards for monitoring and tracking as well as the ability for the scheduling lead to easily track availability, monitor gaps in mission support and mitigate those issues within a combat reliable timeframe.</p>

        <div className="userStatus">
          {username ? <p> Welcome, {username}!</p> : <p> Guest </p>}
        </div>
      </div>
      <Footer />
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
