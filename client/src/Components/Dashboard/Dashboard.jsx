import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:8080/users/${userId}`);
        const data = await res.json();
        setUser(data);

        switch (data.privilege) {
          case "commander":
            navigate("/commander", { state: { user: data } });
            break;
          case "scheduler":
            navigate("/scheduler", { state: { user: data } });
            break;
          case "training_manager":
            navigate("/training-manager", { state: { user: data } });
            break;
          default:
            navigate("/not-authorized");
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, navigate]);

  if (loading) return <p>Loading dashboard...</p>;
  return null;
}