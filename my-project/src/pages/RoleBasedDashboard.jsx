import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import ReviewerDashboard from './reviewer/ReviewerDashboard';
import ResearcherDashboard from './researcher/ResearcherDashboard';
import AdminDashboard from './admin/AdminDashboard';

const RoleBasedDashboard = () => {
  const user = useSelector(selectUser);

  console.log("RoleBasedDashboard - user:", user);

  switch (user?.role) {
    case 'reviewer':
      return <ReviewerDashboard />;
    case 'researcher':
      return <ResearcherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export default RoleBasedDashboard;
