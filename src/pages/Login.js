import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // Per gestire il cambio tra login e registrazione

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Utente loggato con successo:', user);

      // Reindirizza in base al ruolo
      if (role === 'admin') {
        navigate('/cassabar');
      } else if (role === 'user') {
        navigate('/');
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError('Email o password non corretti.');
    } finally {
      setLoading(false);
    }
  };

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
              >
                {loading ? 'Caricamento...' : 'Accedi'}
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
