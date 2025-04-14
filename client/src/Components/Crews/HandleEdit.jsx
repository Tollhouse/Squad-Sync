// used to update crew rotations table (start/end dates & shift type)
// reference - https://mui.com/x/react-data-grid/editing/
//icons - https://mui.com/material-ui/material-icons/

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function HandleEdit({ rowData, onEditSuccess }) {

  const { rotation_id, crew_name, date_start, date_end, shift_type } = rowData;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    crew_name,
    date_start,
    date_end,
    shift_type,
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelClick = () => {
    setEditedData({ crew_name, date_start, date_end, shift_type });
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    fetch(`http://localhost:8080/crew_rotations/${rotation_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(editedData),
    })
      .then((response) => {
        if (response.ok) {
          alert('Crew updated successfully!');
          setIsEditing(false);

          if (onEditSuccess) {
            onEditSuccess(editedData);
          }
        } else {
          alert('Failed to update crew.');
        }
      })
      .catch((error) => {
        console.error('Error updating crew:', error);
        alert('Error updating crew.');
      });
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isEditing ? (
        <>
          <TextField
            name="crew_name"
            value={editedData.crew_name}
            onChange={handleInputChange}
            size="small"
            variant="standard"
          />
          <TextField
            name="date_start"
            value={editedData.date_start}
            onChange={handleInputChange}
            size="small"
            variant="standard"
          />
          <TextField
            name="date_end"
            value={editedData.date_end}
            onChange={handleInputChange}
            size="small"
            variant="standard"
          />
          <TextField
            name="shift_type"
            value={editedData.shift_type}
            onChange={handleInputChange}
            size="small"
            variant="standard"
          />
          <IconButton onClick={handleSaveClick} aria-label="save">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancelClick} aria-label="cancel">
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={handleEditClick} aria-label="edit">
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );




















}


