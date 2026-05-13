import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Prevent guards from accessing dashboard/settings by URL manually
  if (user?.global_role === 'guard' && location.pathname !== '/gate') {
    return <Navigate to="/gate" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
