import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';
import Register from '../components/Register';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Tab,
  Tabs,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { role, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // Per gestire il cambio tra login e registrazione
  const [waitingForRole, setWaitingForRole] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Utente loggato con successo:', user);
      setWaitingForRole(true); // Imposta l'attesa per il ruolo
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError('Email o password non corretti.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Login con Google riuscito:', result.user);
      setWaitingForRole(true);
    } catch (err) {
      console.error('Errore durante il login con Google:', err);
      setError('Errore durante il login con Google.');
    }
  };

  // Reindirizza quando il ruolo è disponibile
  useEffect(() => {
    if (waitingForRole && role) {
      setWaitingForRole(false); // Reset dell'attesa
      if (role === 'admin') {
        navigate('/cassabar');
      } else if (role === 'user') {
        navigate('/ticket');
      }
    }
  }, [role, waitingForRole, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 0 }}>
      <Box
        sx={{
          p: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Registrazione" value="register" />
        </Tabs>

        {activeTab === 'login' && (
          <div>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Caricamento...' : 'Accedi'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleGoogleLogin}
              >
                Accedi con Google
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'register' && <Register />}
      </Box>
    </Container>
  );
};

export default Login;
