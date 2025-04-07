// Incomplete code, need to determin how to store username
// Code written by Harman
import React from "react";
import "./Home.css";

export default function Home (){

  const username = localStorage.getItem('username');
  console.log (username);

  return(
    <> 
      <h3> Welcome to Home Page </h3>
        <div className="NavContainer">
          <div className="button">
            <a href= "/login" className="iconeLink">
              <button className="iconButton"> User Log In</button>
            </a>
            <a href= "/signup" className="iconeLink">
              <button className="iconButton"> New User Sign up</button>
            </a>
          </div>

          <div className="userStatus">
            {username ? (
              <p> Welcome, {username}!</p>
            ):(
              <p> Guest </p>
            )}
            </div>
        </div>  
    </>
  )
}