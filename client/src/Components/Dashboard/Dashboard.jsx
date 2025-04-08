import React, { useEffect, useState } from "react";
import Commander from "../Commander/Commander";
import User from "../User/User";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:8080/users/${userId}`);
        const data = await res.json();
        setUser(data[0]); // returns an array with one user
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome, {user.first_name}!</h1>
      {user.role === "Crew Commander" ? (
        <Commander />
      ) : (
        <User userId={user.id} />
      )}
    </>
  );
}