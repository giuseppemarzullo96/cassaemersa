import React, { useState, useContext, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const AccountSettings = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || '');
          setEmail(data.email || '');
          setPhoneNumber(data.phone || '');
          setPhotoURL(data.photoURL || '');
        }
      } catch (err) {
        console.error('Errore nel recupero dei dati utente:', err);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedData = {
        username,
        phone: phoneNumber,
        photoURL: photoURL, // Verrà aggiornato se viene caricata una nuova foto
      };

      await updateDoc(userRef, updatedData);
      setSuccess('Informazioni aggiornate con successo!');
    } catch (err) {
      console.error('Errore durante l\'aggiornamento dei dati:', err);
      setError('Errore durante l\'aggiornamento. Riprova.');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoURL(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
     
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar src={photoURL} sx={{ width: 100, height: 100, mb: 2 }} />
        <IconButton component="label" sx={{ width: 50, height: 50, mb: 2, ml:-1 }}>
          <PhotoCamera/>
          <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
        </IconButton>
      </Box>

      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        fullWidth
        disabled
        value={email}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Numero di Telefono"
        fullWidth
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpdate}
      >
        Aggiorna Informazioni
      </Button>
    </Container>
  );
};

export default AccountSettings;
