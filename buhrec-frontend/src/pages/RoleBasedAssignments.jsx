import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Assignments from '../components/shared/Assignments';
import AdminAssignments from './admin/AdminAssignments';

const RoleBasedAssignments = () => {
  const user = useSelector(selectUser);
  if (user?.role === 'admin') return <AdminAssignments />;
  return <Assignments />;
};

export default RoleBasedAssignments;
