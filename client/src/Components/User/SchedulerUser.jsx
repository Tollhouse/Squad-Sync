//Authored by Curtis
//This is incomplete, need enpoints from the backend for the PATCH
import React, { useState, useEffect, useMemo } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

export default function SchedulerUser () {
  const { id } = useParams()
  const [userInformation, setUserInformation] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [search, setSearch] = useState('')

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const userResponse = await fetch('http://localhost:8080/users');
        const userData = await userResponse.json();

        const crewResponse = await fetch('http://localhost:8080/crews');
        const crewData = await crewResponse.json();

        const crewMapping = crewData.reduce((acc, crew) => {
          acc[crew.id] = crew.crew_name;
          return acc;
        }, {})

        const mergedData = userData.map((user) => ({
          ...user,
          crew_name: crewMapping[user.crew_id] || 'Unknown Crew',
        }))

        if (!mergedData || (Array.isArray(mergedData) && mergedData.length === 0)) {
          setUserInformation([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(mergedData)){
          setUserInformation([mergedData]);
        } else {
          setUserInformation(mergedData)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };
    console.log("userInformation:", userInformation)

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

  //HANDLES DELETING THE USER
  const deleteUserInformation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      })
      if (!response.ok) {
        throw new Error('Failed to delete user information')
      }
      const deletedRow = await response.json()
      setUserInformation((prevRows) =>
        prevRows.filter((row) => row.id !== deletedRow.id)
      )
      window.location.reload()
    } catch (error) {
      console.error('Error deleting user information:', error)
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

  //HANDLES DELETING THE USER
  const handleDeleteClick = (id) => async () => {
    try {
      alert('Are you sure you want to delete this user?')
      await deleteUserInformation(id); // Call the delete function
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  //HANDLES THE ROW MODES MODEL CHANGE
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'ID', width: 10, editable: false},
    {field: 'user_name', headerName: 'User Name', width: 125, editable: true},
    {field: 'first_name', headerName: 'First Name', width: 125, editable: true},
    {field: 'last_name', headerName: 'Last Name', width: 125, editable: true},
    {field: 'flight', headerName: 'Assigned Flight', width: 125, editable: true},
    {field: 'crew_name', headerName: 'Crew Name', width: 125, editable: true},
    {field: 'role', headerName: 'Position', width: 125, editable: true},
    {field: 'privilege', headerName: 'Privilege', width: 125, editable: true},
    {field: 'experience_type',
      headerName: 'Experience Level',
      width: 150,
      editable: true,
      renderCell: (params) => {
        let backgroundColor = 'white';
        let textColor = 'black';
        if(params.value === 'red'){
          backgroundColor = 'red';
          textColor = 'white';
        } else if (params.value === 'yellow'){
          backgroundColor = 'yellow';
          textColor = 'black';
        } else if( params.value === 'green'){
          backgroundColor = 'green';
          textColor = 'white';
        }
        return (
          <div style={{backgroundColor,
          color: textColor,
          padding: '5px',
          textAlign: 'center',}}>
            {params.value}
          </div>
        )
      }},
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
          />,

          <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          className='textPrimary'
          onClick={handleDeleteClick(id)}
          color="inherit"
          />
        ]
      }
    }
  ]

  const filteredRows = userInformation.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (

    <div className='user-container'>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search for member...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginTop: '20px',
            padding: '8px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          />
      </div>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          width:'90%',
          '& .actions': {
            color: 'text.secondary',
          },
          '&.textPrimary': {
            color: 'text.primary',
          },
        }}
        >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => `${row.id}-${row.flight}-${row.crew_name}`}
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

    </div>
  )
}