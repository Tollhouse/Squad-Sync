//Authored by Curtis
//This is incomplete, need enpoints from the backend for the PATCH
import React, { useState, useEffect, useMemo } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
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


export default function UserCrew () {
  const { id } = useParams()
  const [userCrew, setUserCrew] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserCrew = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/schedule/${id}`);
        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserCrew([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(data)){
          setUserCrew([data]);
        } else {
          setUserCrew(data)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };

    fetchUserCrew();
  }, [id]);
  console.log(userCrew)

  //HANDLES THE ROW MODES MODEL CHANGE
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'Crew ID', width: 150, editable: false},
    {field: 'crew_name', headerName: 'Crew Name', width: 150, editable: false},
    {field: 'date_start', headerName: 'Start Date', width: 150, editable: false},
    {field: 'date_end', headerName: 'End Date', width: 150, editable: false},
    {field: 'shift_type', headerName: 'Shift', width: 150, editable: false},
    {field: 'shift_duration', headerName: 'Shift Length', width: 150, editable: false},
    {field: 'role', headerName: 'Crew Position', width: 150, editable: false},
  ]

  return (
  <>
    <div className='user-container'>
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
          rows={userCrew}
          columns={columns}
          getRowId={(row) => row.id}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={(newRow) => updateUserCrew(newRow)}
          onProcessRowUpdateError={(error) => {
            console.error('Error during row update:', error)
          }}
          hideFooter={true}
          />
          </Box>
    </div>
    </>
  )
}