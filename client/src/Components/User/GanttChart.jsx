import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Chart } from "react-google-charts"

export default function GanttChart() {
  const [crewData, setCrewData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchGanttData = async () => {
      try{
        const response = await fetch(`http://localhost:8080/users/schedule/${id}`)
        const data = await response.json()

        const crewDates = data.find((item) => item.crewDates)?.crewDates || []
        const courseDates = data.find((item) => item.courseDates)?.courseDates || []

        const ganttCrewData = crewDates.map((crew) => {
          const startDate = new Date(crew.date_start)
          const endDate = new Date(crew.date_end)
          const duration = Number((endDate - startDate) / (1000 * 60 * 60 * 24))

          return [
            `Crew-${crew.crew_id}`,
            crew.crew_name,
            new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
            new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
            duration,
            null,
          ]
        })

        const ganttCourseData = courseDates.map((course) => {
          const startDate = new Date(course.date_start)
          const endDate = new Date(course.date_end)
          const duration = Number((endDate - startDate) / (1000 * 60 * 60 * 24))

          return [
            `Course-${course.course_id}`,
            course.course_name,
            new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
            new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
            duration,
            null,
          ]
        })

        setCrewData(ganttCrewData);
        setCourseData(ganttCourseData);
        setLoading(false);
        }catch (err) {
          console.error("Error fetching Gantt Data:", err)
          setLoading(false);
        }
      }
      fetchGanttData();
    }, [id]);

    if (loading) {
      return <div>Loading...</div>;
    }

  console.log("Course Data:", courseData);
  console.log("Crew Data:", crewData);

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "string", label: "Dependencies" },
  ];

  return (
    <>
    <div>
      <h2>Course Chart</h2>
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        loader={<div>Loading Chart...</div>}
        data={[columns.map((col) => col.label), ...courseData]}
        options={{
          gantt: {
            trackHeight: 30,
            barHeight: 20,
          },
        }}
        chartPackages={["gantt"]}
        chartVersion="51"
      />
      <h2>Crew Chart</h2>
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        loader={<div>Loading Chart...</div>}
        data={[columns.map((col) => col.label), ...crewData]}
        options={{
          gantt: {
            trackHeight: 30,
            barHeight: 20,
          },
        }}
        chartPackages={["gantt"]}
        chartVersion="51"
      />
    </div>
    </>
  );

}

