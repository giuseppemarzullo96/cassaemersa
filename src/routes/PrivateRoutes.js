import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
