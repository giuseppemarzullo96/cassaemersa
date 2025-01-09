import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { TextField, Button, Select, MenuItem, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const ManageAccounts = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditMode(user.id);
    setEditedUser(user);
  };

  const handleSave = async (id) => {
    try {
      const filteredUser = { ...editedUser };
      Object.keys(filteredUser).forEach(key => {
        if (filteredUser[key] === undefined) {
          delete filteredUser[key];
        }
      });

      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, filteredUser);

      alert('Utente aggiornato con successo!');
      setEditMode(null);
      const updatedUsers = users.map(user => (user.id === id ? { ...user, ...filteredUser } : user));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Utente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Ruolo</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editMode === user.id ? (
                    <TextField
                      value={editedUser.username || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                    />
                  ) : (
                    user.username
                  )}
                </TableCell>
                <TableCell>
                  {editMode === user.id ? (
                    <TextField
                      value={editedUser.email || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editMode === user.id ? (
                    <TextField
                      value={editedUser.phone || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    />
                  ) : (
                    user.phone
                  )}
                </TableCell>
                <TableCell>
                  {editMode === user.id ? (
                    <Select
                      value={editedUser.role || 'user'}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  {editMode === user.id ? (
                    <>
                      <IconButton onClick={() => handleSave(user.id)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => setEditMode(null)}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageAccounts;
