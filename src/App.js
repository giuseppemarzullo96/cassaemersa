import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Box } from '@mui/material';

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box
              component="main"
              sx={{
                flex: '1 0 auto',
                p: 2, // Optional padding
              }}
            >
              <AppRoutes />
            </Box>
            <Footer />
          </Box>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
