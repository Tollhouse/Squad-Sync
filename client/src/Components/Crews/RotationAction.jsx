import React from "react";
import IconButton from "@mui/material/IconButton";
import {Edit, Save, Close, Delete} from "@mui/icons-material";

const RotationAction = ({ row, isEditing, onEdit, onSave, onCancel, onDelete }) => (
  <>
    {isEditing ? (
      <>
        <IconButton onClick={onSave}><Save /></IconButton>
        <IconButton onClick={onCancel}><Close /></IconButton>
      </>
    ) : (
      <>
        <IconButton onClick={() => onEdit(row)}><Edit /></IconButton>
        <IconButton onClick={() => onDelete(row.crew_id)}><Delete /></IconButton>
      </>
    )}
  </>
);

export default RotationAction;