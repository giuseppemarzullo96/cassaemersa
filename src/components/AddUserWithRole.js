import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase'; // Mantieni l'istanza di `auth` per la tua autenticazione globale
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  Box,
  InputLabel,
  IconButton,
  Avatar
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';


const AddUserWithRole = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Ruolo di default
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log('Tentativo di creazione utente con email:', email, 'e ruolo:', role);

    try {
      // Usa una nuova istanza di auth per evitare di sovrascrivere l'utente corrente
      const tempAuth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const user = userCredential.user;

      console.log('Utente creato con successo. UID:', user.uid);

      // Salva l'utente e il ruolo in Firestore
      console.log('Salvataggio dell\'utente nel database Firestore...');
      await setDoc(doc(db, 'users', user.uid), { email: user.email, role, username, phone });

      console.log(`Utente salvato con successo in Firestore: Email: ${email}, Ruolo: ${role}`);
      setSuccess(`Utente ${email} creato con ruolo ${role} con successo!`);
      setEmail('');
      setPassword('');
      setRole('user');
      setUsername('');
      setPhone('');
    } catch (err) {
      console.error('Errore durante la creazione dell\'utente:', err);
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="tm" sx={{ mt: 4 }}>
      <form onSubmit={handleAddUser}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box display="flex" justifyContent="center" mb={2}>
        <Avatar src={'photoURL'} sx={{ width: 100, height: 100, mb: 2 }} />
        <IconButton component="label" sx={{ width: 50, height: 50, mb: 2, ml:-1 }}>
          <PhotoCamera/>
        </IconButton>
      </Box>
       
        <TextField
          label="Username"
          type="username"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          type="phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="role-select-label"></InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="user">Utente</MenuItem>
            <MenuItem value="admin">Amministratore</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth type="submit">
          Aggiungi Utente
        </Button>
      </form>
    </Container>
  );
};

export default AddUserWithRole;
