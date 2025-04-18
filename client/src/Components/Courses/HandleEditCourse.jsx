import React from "react";

export const saveInlineEdits = (editedCourse) => {
  return fetch(`http://localhost:8080/courses/${editedCourse.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editedCourse),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update course");
    }
    return response.json();
  });
};

export const cancelInlineEdits = () => {
  return null;
};

export default function HandleEditCourse() {
  return null;
}