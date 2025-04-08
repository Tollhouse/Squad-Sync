//Authored by Curtis
//This is incomplete, need enpoints from the backend for the PATCH


import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx'
import './User.css'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'


export default function User () {
  const { id } = useParams()
  const [editingCell, setEditingCell] = useState(null)
  const [userInformation, setUserInformation] = useState([])

  //HANDLES GETTING USER INFORMATION
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/users/${id}`);
        const data = await response.json();

        if (data.length === 0) {
          setUserInformation([]);
          console.warn('No user data was found');
        } else {
          setUserInformation([data]);
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
      }
    };

    fetchUserInformation();
  }, [id]);

  //HANDLES UPDATING SELECTED USER INFORMATION
  const updateUserInformation = (rowIndex, columnId, value) => {

    const updateUser = {
      id: userInformation[rowIndex].id,
      [columnId]:value
    }

    fetch(`http://localhost:PORT/ENDPOINT `, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updateUser)
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error('Failed to update inventory');
      }
      return response.json();

    })
    .then((data) => {
      alert('Update successful', data)
    })
    .catch((error) => {
      console.error('Error updating user information:', error);
    })
  }

  //HANDLES EDITING USER INFORMATION BY USER
  const handleEdit = (rowIndex, columnId, value) => {
    const updatedUserInformation = [...userInformation]
    updatedUserInformation[rowIndex][columnId] = value
    setUserInformation(updatedUserInformation)
  }

  //HANDLES TRIGGERING UPDATE WITH THE PRESS OF THE ENTER KEY
  const handleKeyDown = (e, rowIndex, columnId, value) => {
    if(e.key === 'Enter'){
      updateUserInformation(rowIndex, columnId, value)
      setEditingCell(null)
    }
  }

  //HANDLES TRIGGERING UPDATE WHEN THE USER CLICKS AWAY FROM THE CELL THEY ARE EDITING
  const handleBlur = (rowIndex, columnId, value) => {
    updateUserInformation(rowIndex, columnId, value)
    setEditingCell(null)
  }

  //SETTING UP THE USER INFORMATION TABLE
  //USER IS ABLE TO UPDATE THEIR USERNAME, FIRST NAME, AND LAST NAME ONLY
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: "user_name",
      header: 'User Name',
      cell: ({row, column}) => {
        const isEditing = editingCell?.rowIndex === row.index && editingCell?.columnId === column.id;
        const value = row.original[column.id];
        return isEditing ? (
          <input type='text' value={value}
          onChange={(e) => handleEdit(row.index, column.id, e.target.value)}
          onBlur={(e) => handleBlur(row.index, column.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, row.index, column.id, e.target.value)}
          autoFocus
        />
        ) : (
          <div onClick={() => setEditingCell({rowIndex: row.index, columnId: column.id})}>
            {value}
          </div>
        );
      }
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({row, column}) => {
        const isEditing = editingCell?.rowIndex === row.index && editingCell?.columnId === column.id;
        const value = row.original[column.id];
        return isEditing ? (
          <input type='text' value={value}
          onChange={(e) => handleEdit(row.index, column.id, e.target.value)}
          onBlur={(e) => handleBlur(row.index, column.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, row.index, column.id, e.target.value)}
          autoFocus
        />
        ) : (
          <div onClick={() => setEditingCell({rowIndex: row.index, columnId: column.id})}>
            {value}
          </div>
        );
      }
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({row, column}) => {
        const isEditing = editingCell?.rowIndex === row.index && editingCell?.columnId === column.id;
        const value = row.original[column.id];
        return isEditing ? (
          <input type='text'
          value={value}
          onChange={(e) => handleEdit(row.index, column.id, e.target.value)}
          onBlur={(e) => handleBlur(row.index, column.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, row.index, column.id, e.target.value)}
          autoFocus
        />
        ) : (
          <div onClick={() => setEditingCell({rowIndex: row.index, columnId: column.id})}>
          {value}
          </div>

        );
      }
    },
    {
      accessorKey: 'crew_name',
      header: 'Crew Assigned',
    },
    {
      accessorKey: 'role',
      header: 'Crew Position',
    },
    {
      accessorKey: 'experience_type',
      header: 'Experience Level'
    }

  ], [userInformation, editingCell]);

  const table = useReactTable({
    data: userInformation,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
    <div className='user-container'>

      <div className='navbar-container'>
        <Navbar />
      </div>

      <div className='header'>
        <h1>Welcome, user </h1>
      </div>

      <div className='user-information'>
        <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                </th>
              ))}
            </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {cell.column.columnDef.cell ? cell.column.columnDef.cell(cell) : cell.getValue()}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  {userInformation.length === 0 ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
    </>
  )
}