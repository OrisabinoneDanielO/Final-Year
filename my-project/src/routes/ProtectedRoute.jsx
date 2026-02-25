import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated } from '../features/auth/authSlice';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login/reviewer" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
