// Complete code
// Code written by Harman

import {useEffect, useState}  from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound(){
  const navigate = useNavigate()
  const [count, setCount] = useState(3)

  useEffect(()=>{
    const timer = setTimeout(()=>{
      if(count > 0) {
        setCount(count -1);
      } else {
        navigate('/');
      }
    }, 2000);

    return() => clearTimeout(timer);
  }, [count, navigate]);

  return(
    <div>
      <h1> 404 Page Not Found</h1>
      <p> Redirecting to home page in {count} seconds... </p>
    </div>
  )
}

export default NotFound;