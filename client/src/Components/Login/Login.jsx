// code by Lorena (tried to match Harmon's signup page)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const [loggedIn, setLoggedIn] = useState(!!username);

  if (loggedIn) {
    return (
      <div>
        <p>You are already logged in as {username}</p>
        <p>Not {username}?</p>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("username");
            setLoggedIn(false);
            navigate("/Logout");
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error fetching login data");
      }

      const data = await response.json();

      alert("Login successful!");
      localStorage.setItem("username", formData.username);
      navigate("/Home");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
      <p>Don't have an account?</p>
      <button type="button" onClick={() => navigate("/Signup")}>
        Sign Up
      </button>
    </form>
  );
}
