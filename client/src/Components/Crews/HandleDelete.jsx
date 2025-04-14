import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function handleDelete({ crew_id }) {
  const handleDeleteClick = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this?"
    );

    if (confirmDelete) {
      fetch(`http://localhost:8080/crews/${crew_id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          alert("Item Deleted!");
          window.location.reload();
        } else {
          alert("Failed to delete.");
          console.log("Failed to delete");
        }
      });
    } else {
      console.log("Delete action was canceled");
    }
  };

  return (
    <IconButton aria-label="delete" color="error" onClick={handleDeleteClick}>
      <DeleteForeverIcon />
    </IconButton>
  );
}
