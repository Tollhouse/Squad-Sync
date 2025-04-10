import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Chart } from "react-google-charts"
import './GanttChart.css'

export default function GanttChartCourse() {
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

          if (isNaN(startDate) || isNaN(endDate)) {
            console.warn(`Invalid date for Crew-${crew.crew_id}:`, crew.date_start, crew.date_end);
            return null; // Skip invalid rows
          }

          const duration = Number((endDate - startDate) / (1000 * 60 * 60 * 24))


          return [
            `Crew-${crew.crew_id}`,
            crew.crew_name,
            new Date(startDate.getFullYear(), String(startDate.getMonth() + 1).padStart(2,0), String(startDate.getDate()).padStart(2,0)),
            new Date(endDate.getFullYear(), String(endDate.getMonth() + 1).padStart(2,0), String(endDate.getDate()).padStart(2,0)),
            duration,
            0,
            "",
          ]
        })

        const ganttCourseData = courseDates.map((course) => {
          const startDate = new Date(course.date_start)
          const endDate = new Date(course.date_end)
          const duration = Number((endDate - startDate) / (1000 * 60 * 60 * 24))

          return [
            `Course-${course.course_id}`,
            course.course_name,
            new Date(startDate.getFullYear(), String(startDate.getMonth() + 1).padStart(2,0), String(startDate.getDate()).padStart(2,0)),
            new Date(endDate.getFullYear(), String(endDate.getMonth() + 1).padStart(2,0), String(endDate.getDate()).padStart(2,0)),
            duration,
            0,
            "",
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

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: 'number', label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  return (
    <>
      <div>
        <h2>Course Chart</h2>
        <div className='gantt-chart-container'>
        {courseData.length > 0 ? (
          <Chart
            chartType="Gantt"
            width="1200px"
            height="100px"
            loader={<div>Loading Chart...</div>}
            data={[
              ["Task ID", "Task Name", "Start Date", "End Date", "Duration", "Percent Complete", "Dependencies"],
              ...courseData,
            ]}
            options={{
              backgroundColor:"#f4f4f4",
              gantt: {
                trackHeight: 40,
                barHeight: 30,
                palette: [
                  {
                    color: '#1e88e5',
                    dark: '#1565c0',
                    light: '#bbdefb',
                  },
                  {
                    color: '#43a047',
                    dark: '#2e7d32',
                    light: '#c8e6c9',
                  },
                ],
              },
            }}
            chartVersion='51'
          />

        ) : (
          <p>No course data available</p>
        )}
        </div>
  </div>
    </>
  )

}

