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


export default function UserCourse () {
  const { id } = useParams()
  const [userCourse, setUserCourse] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/courses/${id}`);
        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setUserCourse([]);
          console.warn('No user data was found');
        } else if (!Array.isArray(data)){
          setUserCourse([data]);
        } else {
          setUserCourse(data)
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };

    fetchUserCourse();
  }, [id]);

  //HANDLES THE ROW MODES MODEL CHANGE
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'ID', width: 150, editable: false},
    {field: 'user_name', headerName: 'User Name', width: 150, editable: false},
    {field: 'first_name', headerName: 'First Name', width: 150, editable: false},
    {field: 'last_name', headerName: 'Last Name', width: 150, editable: false},
    {field: 'crew_name', headerName: 'Crew Name', width: 150, editable: false},
    {field: 'role', headerName: 'Crew Position', width: 150, editable: false},
    {field: 'experience_type', headerName: 'Experience Level', width: 150, editable: false},
  ]

  return (
  <>
    <div className='user-container'>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          '& .actions': {
            color: 'text.secondary',
          },
          '&.textPrimary': {
            color: 'text.primary',
          },
        }}
        >
        <DataGrid
          rows={userCourse}
          columns={columns}
          getRowId={(row) => row.id}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={(newRow) => updateUserCourse(newRow)}
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