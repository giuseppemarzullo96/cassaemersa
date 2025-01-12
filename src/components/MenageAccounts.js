import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const ManageAccounts = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers(); // Carica tutti gli utenti al primo caricamento
  }, []);

  const fetchUsers = async (queryStr = '') => {
    try {
      let q;
      if (queryStr) {
        q = query(
          collection(db, 'users'),
          where('username', '>=', queryStr),
          where('username', '<=', queryStr + '\uf8ff')
        );
      } else {
        q = collection(db, 'users'); // Nessun filtro, carica tutto
      }

      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error('Errore durante il recupero degli utenti:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    setTimeout(() => {
      if (query === searchQuery) {
        fetchUsers(query.toLowerCase());
      }
    }, 300);
  };

  const handleEdit = (user) => {
    setEditMode(user.id);
    setEditedUser(user);
  };

  const handleSave = async (id) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, editedUser);
      alert('Utente aggiornato con successo!');
      setEditMode(null);
      fetchUsers(searchQuery); // Ricarica gli utenti aggiornati
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <Container maxWidth="tm" sx={{ mt: 4, mb:4}}>
      <Box
    sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '30px',
      p: 2,
      boxShadow: 1,
    }}
  >
    <Box sx={{ mt: 4}}>
      <TextField
        label="Cerca utente"
        fullWidth
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Foto</TableCell>
              <TableCell>Nome Utente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Ruolo</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor:
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
                      ? '#f5f5f5'
                      : 'transparent',
                }}
              >
                <TableCell>
                  <Avatar src={user.photoURL} alt={user.username} />
                </TableCell>
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
    </Box>
    </Container>
  );
};

export default ManageAccounts;
