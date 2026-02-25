import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';

/**
 * RoleGuard — restricts nested routes to specific user roles.
 * Usage: <Route element={<RoleGuard allowedRoles={['reviewer','admin']} />}>
 *          <Route path="assignments" element={<Assignments />} />
 *        </Route>
 *
 * If the user's role is not in allowedRoles, they are redirected to /dashboard.
 */
const RoleGuard = ({ allowedRoles }) => {
  const user = useSelector(selectUser);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
