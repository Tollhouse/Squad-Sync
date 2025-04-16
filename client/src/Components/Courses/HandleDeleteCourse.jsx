import React from "react";

export const deleteCourse = (courseId) => {
  return fetch(`http://localhost:8080/courses/${courseId}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete course");
    }
    return courseId;
  });
};

export default function HandleDeleteCourse() {
  return null;
}