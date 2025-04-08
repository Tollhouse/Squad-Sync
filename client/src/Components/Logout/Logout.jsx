// Code written by Harman
// incomplete code, need to match the back end; 
// update the fetch request to match the back end API

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:8081/logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then(() => {
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed:', err);
      });
  };

  return (
    <button onClick={handleLogout}>Log Out</button>
  );
}