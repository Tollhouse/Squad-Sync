// Navbar incomplete, needs more details...
// Code written by Harman
// How to authenticate a login user? local storage or JWT token?

import React, { useState } from 'react';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('session_id');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className='logo'>SquadSync</div>

        <ul>
          <li><button className="navbar-btn" onClick={() => navigate('/')}>Home</button></li>         

          {!isAuthenticated ? (
            <>
              <li><button className="navbar-btn" onClick={() => navigate('/signup')}>Sign Up</button></li>
              <li><button className="navbar-btn" onClick={() => navigate('/login')}>Log In</button></li>
            </>
              ) : (
            <>
                <li>
                  <span className="navbar-username">Welcome, {username}!</span>
                </li>
                <li>
                  <button className="navbar-btn" onClick={handleLogout}>Log Out</button>
                </li>
                {/* <li>
                  <button className="navbar-btn" onClick={() => navigate('/...')}>....</button>
                </li> */}
            </>
            )}
        </ul>
      </nav>
    </>
  )
}

export default Navbar;