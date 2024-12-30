import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CassaBar from './pages/CassaBar';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cassa-bar" element={<CassaBar />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;