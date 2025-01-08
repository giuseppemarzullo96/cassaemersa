import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Utente registrato con successo:', userCredential.user);
      setSuccess('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 0}}>
        <Typography variant="h5" align="center" gutterBottom>
          Registrazione
        </Typography>
        <form onSubmit={handleRegister}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
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
          <TextField
            label="Conferma Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
        </form>
    </Container>
  );
};

export default Register;
