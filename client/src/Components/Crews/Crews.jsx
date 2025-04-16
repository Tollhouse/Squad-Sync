
import React, { useEffect, useState } from "react";
import CrewTable from "./CrewTable";
import { ThemeProvider } from '@mui/material/styles';
import TableTheme from '../AddOns/TableTheme';
import "./Crews.css"

function Crews() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8080/crews/schedule");
        const scheduleData = await res.json();
        setSchedule(scheduleData.slice(0, -1));

      } catch (err) {
        console.error("Failed to fetch 8080/crews/schedule", err);
      }
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={TableTheme}>
        <CrewTable schedule={schedule} setSchedule={setSchedule}/>
    </ThemeProvider>

  );
}

export default Crews;