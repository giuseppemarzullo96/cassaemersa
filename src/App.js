import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
     <AppProvider>
      <Router>
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
    </AppProvider>
    </AuthProvider>
  );
};

export default App;
