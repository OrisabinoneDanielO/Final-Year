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
import ReviewerProfile from '../pages/admin/ReviewerProfile';
import ReviewerAssignments from '../pages/admin/ReviewerAssignments';
import AdminReviewView from '../pages/admin/AdminReviewView';
import AdminAssignments from '../pages/admin/AdminAssignments';
import RoleBasedAssignments from '../pages/RoleBasedAssignments';
import Submissions from '../pages/researcher/Submissions';
import ProposalDetail from '../pages/researcher/ProposalDetail';

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
          <Route path="assignments" element={<RoleBasedAssignments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="application/:id" element={<ApplicationView />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="users" element={<Users />} />
          <Route path="reviewers" element={<Reviewers />} />
          <Route path="reviewers/:id" element={<ReviewerProfile />} />
          <Route path="reviewers/:id/assignments" element={<ReviewerAssignments />} />
          <Route path="reviewers/:reviewerId/assignments/:id/view" element={<AdminReviewView />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="assignments/:id/view" element={<AdminReviewView />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Researcher-only routes */}
        <Route element={<RoleGuard allowedRoles={['researcher']} />}>
          <Route path="submissions" element={<Submissions />} />
          <Route path="submissions/:id" element={<ProposalDetail />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
