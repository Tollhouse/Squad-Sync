// Incomplete code, need to match backend and the wireframe
// How to authenticate a user or session? localstorage of cookie or JWT?
// code partially updated by Harman

import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from "./Components/Home/Home.jsx"
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Footer from './Components/Footer/Footer.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import User from './Components/User/User.jsx'
import Commander from "./Components/Commander/Commander.jsx";
import Scheduler from './Components/Scheduler/Scheduler';
import Courses from "./Components/Courses/Courses.jsx";
import CourseReg from './Components/Courses/CourseRegistrations.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import TrainingManager from './Components/TrainingManager/TrainingManager.jsx';
import SchedulerUser from './Components/User/SchedulerUser.jsx';
import NotFound from './Components/NotFound/NotFound.jsx'
import Crews from './Components/Crews/Crews.jsx';
import About from './Components/About/About.jsx'
import Setting from './Components/Setting/Setting.jsx'
import {Paper, Switch} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';

export default function App() {
  // const isAuthenticated = localStorage.getItem('session_id');
  // const username = localStorage.getItem('username');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode);

  const appTheme = createTheme({
    palette: {
      mode: mode ? 'dark' : 'light',
    },
  });

  const handleChange = () => {
    if (mode){
      setMode(false);
    }else {
      setMode(true);
    }
  };

  return (
    <>
    <ThemeProvider theme={appTheme}>
    <Paper elevation={0} sx={{ minHeight: "100vh" }} square>
    <Switch
          checked={mode}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/user/:id' element={<User />}/>
      <Route path='/commander' element={<Commander />}/>
      <Route path='/courses' element={<Courses />}/>
      <Route path='/crews' element={<Crews />}/>
      <Route path='/course_registrations' element={<CourseReg />}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/scheduler" element={<Scheduler />} />
      <Route path="/training-manager" element={<TrainingManager />} />
      <Route path="/user/scheduler" element={<SchedulerUser />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/about" element={<About />} />
    </Routes>
    </Paper>

    </ThemeProvider>
    </>
  )
}