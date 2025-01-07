import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CassaBar from '../pages/CassaBar';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cassabar" element={<CassaBar />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
