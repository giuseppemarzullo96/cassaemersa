import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CassaBar from '../pages/CassaBar';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import PrivateRoute from '../routes/PrivateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotta per Login: Accessibile a tutti */}
      <Route path="/login" element={<Login />} />
      
      {/* Rotte protette */}
      <Route
        path="/"
        element={
          <PrivateRoute allowedRoles={['admin', 'user']}>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/cassabar"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <CassaBar />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
