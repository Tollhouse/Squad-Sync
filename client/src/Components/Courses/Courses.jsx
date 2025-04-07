//  code by lorena

import React, { useEffect, useState } from "react";

export default function Courses() {
  const mockCourses = [
    { id: 1, course_name: "Cyber Basics", cert_earned: true },
    { id: 2, course_name: "Safety Protocol", cert_earned: false },
    { id: 3, course_name: "Advanced Tactics", cert_earned: true },
  ];

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(mockCourses); // Mock data for testing
  }, []);

  // UPDATE TO FETCH DATA FROM BACKEND
  //   fetch("http://localhost:8081/courses")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch courses");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setCourses(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching courses:", error);
  //     });
  // }, []);

  return (
    <div>
      <h1>Courses</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Cert Granted</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td>{course.course_id}</td>
              <td>{course.course_name}</td>
              <td>{course.date_start}</td>
              <td>{course.date_end}</td>
              <td>{course.cert_granted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
