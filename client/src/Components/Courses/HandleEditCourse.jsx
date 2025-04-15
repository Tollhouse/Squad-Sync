// src/Components/HandleEditCourse.jsx
import React from "react";

/**
 * Saves the inline edits by sending a PUT request.
 * @param {Object} editedCourse - The updated course object.
 * @returns {Promise<Object>} - A promise that resolves to the updated course data.
 */
export const saveInlineEdits = (editedCourse) => {
  return fetch(`http://localhost:8080/courses/${editedCourse.id}`, {
    method: "PATCH", // or PATCH depending on your API
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editedCourse),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update course");
    }
    return response.json();
  });
};

/**
 * Cancels inline editing.
 * Currently, this function doesn't need to do any extra work.
 * It exists here for symmetry with the save function.
 */
export const cancelInlineEdits = () => {
  return null;
};

// Optionally, you could have a default export if you want to also use a dialog-based component
export default function HandleEditCourse() {
  return null;
}