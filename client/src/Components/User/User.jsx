//Authored by Curtis
import React, { useState, useEffect, useMemo } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
import UserCourse from './UserCourse.jsx'
import UserCrew from './UserCrew.jsx'
import Calendar from './Calendar'
import GanttChartCourse from './GanttChartCourse.jsx'
import GanttChartCrew from './GanttChartCrew.jsx'
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Chip } from "@mui/material"

export default function User () {
  const { id } = useParams()
  const [userInformation, setUserInformation] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${id}`);
        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserInformation([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(data)){
          setUserInformation([data]);
        } else {
          setUserInformation(data)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
        setUserInformation([]);
      }
    };

    fetchUserInformation();
  }, [id]);

  //HANDLES UPDATING USER INFORMATION
  const updateUserInformation = async (newRow) => {
    try{
      const response = await fetch(`http://localhost:8080/users/${newRow.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newRow),
      });
      if (!response.ok) {
        throw new Error('Failed to update user information');
      }
      const updatedRows = await response.json()
      const updatedRow = updatedRows[0]
      setUserInformation((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    )
      window.location.reload()
      return updatedRow
    } catch (error) {
      console.error('Error updating user information:', error);
      throw error
    }
  }
  //HANDLES WHEN USER IS DONE EDITING ROW
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  //HANDLES EDITING USER INFORMATION
  const handleEditClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: { mode: GridRowModes.Edit }})
  }

  //HANDLES SAVING THE EDIT
  const handleSaveClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: { mode: GridRowModes.View }})
    window.location.reload()
  }

  //HANDLES CANCELLING THE EDIT
  const handleCancelClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode : GridRowModes.View, ignoreModifications: true}})
  }

  //HANDLES THE ROW MODES MODEL CHANGE
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  //HANDLES THE EXPERIENCE LEVEL ICON
  const ExperienceChip = ({ level }) => {
    const colorMap = {
      green: { label: "Green", color: "#4caf50" },
      yellow: { label: "Yellow", color: "#ffeb3b", textColor: "#000" },
      red: { label: "Red", color: "#f44336" },
    };
    return (
      <Chip
        label={colorMap[level]?.label || level}
        size="small"
        sx={{
          backgroundColor: colorMap[level]?.color,
          color: colorMap[level]?.textColor || "#fff",
          fontWeight: 600,
        }}
      />
    );
  };

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'ID', width: 150, editable: false},
    {field: 'user_name', headerName: 'User Name', width: 150, editable: true},
    {field: 'first_name', headerName: 'First Name', width: 150, editable: true},
    {field: 'last_name', headerName: 'Last Name', width: 150, editable: true},
    {field: 'crew_name', headerName: 'Crew Name', width: 150, editable: false},
    {field: 'role', headerName: 'Position', width: 150, editable: false},
    {
      field: 'experience_type',
      headerName: 'Experience Level',
      width: 150,
      editable: true,
      renderCell: (params) => <ExperienceChip level={params.value} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Edit',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{color: 'primary.main'}}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className='textPrimary'
            onClick={handleEditClick(id)}
            color="inherit"
          />
        ]
      }
    }
  ]
// console.log("userInformation:", userInformation)
  return (

    <div className='user-container'>
      <div className='header'>
        {userInformation.map((user, index) => (
          <div key={user.id || `user-${index}`}>
            <h1>{user.first_name} {user.last_name}</h1>
          </div>
        ))}
      </div>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          width:'63%',
          '& .actions': {
            color: 'text.secondary',
          },
          '&.textPrimary': {
            color: 'text.primary',
          },
        }}
        >
          {userInformation.length > 0 ? (
        <DataGrid
          rows={userInformation}
          columns={columns}
          getRowId={(row) => row.id}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(newRow) => updateUserInformation(newRow)}
          onProcessRowUpdateError={(error) => {
            console.error('Error during row update:', error)
          }}
          hideFooter={true}
          />
        ) : (
          <p>No user data available</p>
        )}
          </Box>
          <UserCourse />
          <UserCrew />
          <div>
          <Calendar />
          </div>
    </div>
  )
}