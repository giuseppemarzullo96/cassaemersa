import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  Paper
} from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
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
      const user = userCredential.user;

      // Salva l'utente su Firestore con il campo username
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role: 'user', // Default role
      });

      console.log('Utente registrato con successo:', user);
      setSuccess('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
      setUsername('');
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

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Salva l'utente su Firestore con il nome visualizzato da Google
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName || 'Google User',
        email: user.email,
        role: 'user',
      });

      console.log('Registrazione tramite Google riuscita:', user);
      setSuccess('Registrazione tramite Google completata con successo!');
    } catch (err) {
      console.error('Errore durante la registrazione tramite Google:', err);
      setError(err.message);
    }
  };

  return (
    <Paper elevation={0}>
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
            label="Username"
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
            sx={{ mb: 2 }}
          >
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleGoogleSignUp}
          >
            Registrati con Google
          </Button>
        </form>
    </Paper>
  );
};

export default Register;
