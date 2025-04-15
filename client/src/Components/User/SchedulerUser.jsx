//Authored by Curtis
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
import { Chip } from "@mui/material"

import { ConfirmSaveModal, ConfirmDeleteModal } from "../AddOns/ConfirmModal";


export default function SchedulerUser () {
  const { id } = useParams()
  const [userInformation, setUserInformation] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [search, setSearch] = useState('')
  const [confirmUserSaveOpen, setConfirmUserSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [crews, setCrews] = useState([])

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const userResponse = await fetch('http://localhost:8080/users');
        const userData = await userResponse.json();

        const crewResponse = await fetch('http://localhost:8080/crews');
        const crewData = await crewResponse.json();
        setCrews(crewData)

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

    fetchUserInformation();
  }, [id, userInformation]);

  //HANDLES UPDATING USER INFORMATION
  const updateUserInformation = async (newRow) => {

    try{
      const originalRow = userInformation.find((row) => row.id === newRow.id)

      if(originalRow.crew_name !== newRow.crew_name){
        const crewResponse = await fetch('http://localhost:8080/crews')
        const crewData = await crewResponse.json()
        const newCrew = crewData.find((crew) => crew.crew_name === newRow.crew_name)

      if(!newCrew){
        throw new Error(`Crew name "${newRow.crew_name}" not found`)
      }
      newRow.crew_id = newCrew.id
      }
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
      return updatedRow
    } catch (error) {
      console.error('Error updating user information:', error);
      throw error
    }finally{
      setConfirmUserSaveOpen(false);
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
    if(event.key === 'Enter'){
      event.defaultMuiPrevented = true
    }
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
    const rowToSave = userInformation.find((row) => row.id === id);
    setSelectedRow(rowToSave);
    setConfirmUserSaveOpen(true);
  }

  //HANDLES CANCELLING THE EDIT
  const handleCancelClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode : GridRowModes.View, ignoreModifications: true}})
  }

  //HANDLES DELETING THE USER
  const handleDeleteClick = (id) => () => {
    setSelectedRowId(id);
    setConfirmDeleteOpen(true);
  };

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

  const crewOptions = crews.map((crews) => ({label: crews.crew_name, value: crews.crew_name}))

  const experienceOptions = [
    { label: "Green", value: "green" },
    { label: "Yellow", value: "yellow" },
    { label: "Red", value: "red" },
  ];

  const flightOptions = [
    {label: "DOO", value: "DOO"},
    {label: "DOU", value: "DOU"},
    {label: "DOX", value: "DOX"},
    {label: "DOT", value: "DOT"},
    {label: "Front Office", value: "Front Office"},
  ]

  const privilegeOptions = [
    {label: "Commander", value: "commander"},
    {label: "Scheduler", value: "scheduler"},
    {label: "Training Manager", value: "training_manager"},
    {label: "user", value: "user"},
  ]

  const positionOptions = [
    {label: "Crew Commander", value: "crew_commander"},
    {label: "Crew Chief", value: "crew_chief"},
    {label: "Operator", value: "operator"},
  ]

  //SETS UP THE COLUMNS FOR THE TABLE
  const columns = [
    {field: 'id', headerName: 'ID', width: 10, editable: false},
    {field: 'user_name', headerName: 'User Name', width: 125, editable: true},
    {field: 'first_name', headerName: 'First Name', width: 125, editable: true},
    {field: 'last_name', headerName: 'Last Name', width: 125, editable: true},
    {
      field: 'flight',
      headerName: 'Assigned Flight',
      width: 125,
      editable: true,
      renderEditCell: (params) => {
        return (
        <select
          value={params.value || ''}
          onChange={(event) => {
            const newValue = event.target.value;
            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue})
          }}
          style={{width:'100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}
        >
          <option value="" disabled>Select Flight</option>
          {flightOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )},
    },
    {
      field: 'crew_name',
      headerName: 'Crew Name',
      width: 125,
      editable: true,
      renderEditCell: (params) => {
      return (
        <select
          value={params.value || ''}
          onChange={(event) => {
            const newValue = event.target.value;
            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue})
          }}
          style={{width:'100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}
        >
          <option value="" disabled>Select Crew</option>
          {crewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    },
    {
      field: 'role',
      headerName: 'Position',
      width: 140,
      editable: true,
      renderEditCell: (params) => {
        return (
        <select
          value={params.value || ''}
          onChange={(event) => {
            const newValue = event.target.value;
            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue})
          }}
          style={{width:'100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}
        >
          <option value="" disabled>Select Position</option>
          {positionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )},
    },
    {
      field: 'privilege',
      headerName: 'Privilege',
      width: 130,
      editable: true,
      renderEditCell: (params) => {
        return (
        <select
          value={params.value || ''}
          onChange={(event) => {
            const newValue = event.target.value;
            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue})
          }}
          style={{width:'100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}
        >
          <option value="" disabled>Select Privilege</option>
          {privilegeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )},
    },
    {
      field: 'experience_type',
      headerName: 'Experience Level',
      width: 150,
      editable: true,
      renderCell: (params) => <ExperienceChip level={params.value} />,
      renderEditCell: (params) => {
        return (
        <select
        value={params.value || ''}
      onChange={(event) => {
        const newValue = event.target.value;
        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue})
      }}
      style={{width:'100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}
      >
        <option value="" disabled>Select Experience</option>
        {experienceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}},
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Edit',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            className="textPrimary"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
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
          data-testid='test-userSearchBar'
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
          width:'100%',
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
          getRowId={(row) => row.id}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(newRow) => {return updateUserInformation(newRow)}}
          onProcessRowUpdateError={(error) => {
            console.error('Error during row update:', error)
          }}
          hideFooter={true}
          />
          </Box>

           {/* Confirm Modals */}

          <ConfirmSaveModal
            open={confirmUserSaveOpen}
            onClose={() => {
              setConfirmUserSaveOpen(false)
              document.querySelector('[aria-label="Save"]').focus();
            }}

            onConfirm={() => {
              if (selectedRow) {
                console.log("Saving selectedRow:", selectedRow); // Debugging
                updateUserInformation(selectedRow)
                  .then(() => {
                    setRowModesModel((prevModel) => ({
                      ...prevModel,
                      [selectedRow.id]: { mode: GridRowModes.View }, // Switch to view mode
                    }));
                    setConfirmUserSaveOpen(false); // Close the modal after saving
                  })
                  .catch((error) => {
                    console.error("Error saving user information:", error);
                  });
              }
            }}
          />
          <ConfirmDeleteModal
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            onConfirm={() => {
              if (selectedRowId) {
                deleteUserInformation(selectedRowId);
              }
            }}
          />
    </div>
  )
}