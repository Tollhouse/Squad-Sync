// Incomplete code, need to match backend and the wireframe
// How to authenticate a user or session? localstorage of cookie or JWT?
// code partially updated by Harman

import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from "./Components/Home/Home.jsx"
import Login from './Components/Login/Login.jsx'
import Logout from './Components/Logout/Logout.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Footer from './Components/Footer/Footer.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import User from './Components/User/User.jsx'
import Commander from "../src/Components/Commander/Commander.jsx";
import Courses from "./Components/Courses/Courses.jsx";
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import NotFound from './Components/NotFound/NotFound.jsx'

export default function App() {
  const isAuthenticated = localStorage.getItem('session_id');
  const username = localStorage.getItem('username');

  return (
    <>
    <Navbar isAuthenticated={isAuthenticated} username = {username}/>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path="/logout" element={<Logout />} />
      <Route path='/signup' element={<Signup />}/>
      <Route path='/user/:id' element={<User />}/>
      <Route path='/commander' element={<Commander />}/>
      <Route path='/courses' element={<Courses />}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

    <Footer />
    </>
  )
}

