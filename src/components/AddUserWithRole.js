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
  InputLabel,
} from '@mui/material';

const AddUserWithRole = () => {
  const [email, setEmail] = useState('');
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
      await setDoc(doc(db, 'users', user.uid), { email: user.email, role });

      console.log(`Utente salvato con successo in Firestore: Email: ${email}, Ruolo: ${role}`);
      setSuccess(`Utente ${email} creato con ruolo ${role} con successo!`);
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (err) {
      console.error('Errore durante la creazione dell\'utente:', err);
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Aggiungi Utente
      </Typography>
      <form onSubmit={handleAddUser}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="role-select-label">Ruolo</InputLabel>
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
