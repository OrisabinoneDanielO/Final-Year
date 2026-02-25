import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UnifiedLoginPage from '../features/auth/UnifiedLoginPage';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import RoleBasedDashboard from '../pages/RoleBasedDashboard';
import Users from '../pages/admin/Users';
import Reviewers from '../pages/admin/Reviewers';
import Researchers from '../pages/admin/Researchers';
import Payments from '../pages/admin/Payments';
import Submissions from '../pages/researcher/Submissions';

// Shared components (used as pages)
import Assignments from '../components/shared/Assignments';
import Notifications from '../components/shared/Notifications';
import Responses from '../components/shared/Responses';
import ReviewDetails from '../components/shared/ReviewDetails';
import CommentsPage from '../components/shared/CommentsPage';
import ApplicationView from '../components/shared/ApplicationView';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login/:role" element={<UnifiedLoginPage />} />
      <Route path="/" element={<Navigate to="/login/reviewer" />} />

      {/* Protected dashboard — all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Shared — all roles */}
        <Route index element={<RoleBasedDashboard />} />

        {/* Reviewer-only routes */}
        <Route element={<RoleGuard allowedRoles={['reviewer']} />}>
          <Route path="responses" element={<Responses />} />
          <Route path="review-details/:id" element={<ReviewDetails />} />
          <Route path="assignments/:id/comments" element={<CommentsPage />} />
        </Route>

        {/* Reviewer + Admin routes */}
        <Route element={<RoleGuard allowedRoles={['reviewer', 'admin']} />}>
          <Route path="assignments" element={<Assignments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="application/:id" element={<ApplicationView />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="users" element={<Users />} />
          <Route path="reviewers" element={<Reviewers />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Researcher-only routes */}
        <Route element={<RoleGuard allowedRoles={['researcher']} />}>
          <Route path="submissions" element={<Submissions />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
