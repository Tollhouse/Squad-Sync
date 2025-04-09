//Authored by Curtis
//This is incomplete, need enpoints from the backend for the PATCH
import React, { useState, useEffect, useMemo } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
import UserCourse from './UserCourse.jsx'
import UserCrew from './UserCrew.jsx'
import GanttChart from './GanttChart.jsx'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

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

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'ID', width: 150, editable: false},
    {field: 'user_name', headerName: 'User Name', width: 150, editable: true},
    {field: 'first_name', headerName: 'First Name', width: 150, editable: true},
    {field: 'last_name', headerName: 'Last Name', width: 150, editable: true},
    {field: 'crew_name', headerName: 'Crew Name', width: 150, editable: false},
    {field: 'role', headerName: 'Crew Position', width: 150, editable: false},
    {field: 'experience_type', headerName: 'Experience Level', width: 150, editable: false},
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

  return (

    <div className='user-container'>
      <div className='header'>
        {userInformation.map((user) => (
          <div key={user.id}>
            <h1>{user.first_name} {user.last_name}</h1>
          </div>
        ))}
      </div>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          width:'84%',
          '& .actions': {
            color: 'text.secondary',
          },
          '&.textPrimary': {
            color: 'text.primary',
          },
        }}
        >
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
          </Box>
          <UserCourse />
          <UserCrew /><br/>
          <GanttChart />
    </div>
  )
}