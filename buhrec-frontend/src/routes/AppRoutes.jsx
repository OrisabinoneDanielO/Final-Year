import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
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
import AssignProposal from '../pages/admin/AssignProposal';
import AddReviewer from '../pages/admin/AddReviewer';
import ResearcherProposals from '../pages/admin/ResearcherProposals';
import RoleBasedAssignments from '../pages/RoleBasedAssignments';
import Submissions from '../pages/researcher/Submissions';
import ProposalDetail from '../pages/researcher/ProposalDetail';
import ResearcherProposalReview from '../pages/researcher/ResearcherProposalReview';
import AttachProposal from '../pages/researcher/AttachProposal';
import NewSubmission from '../pages/researcher/NewSubmission';
import ProposalPayment from '../pages/researcher/ProposalPayment';
import LandingPage from '../pages/LandingPage';
import ReviewerSettings from '../pages/reviewer/ReviewerSettings';
import ResearcherSettings from '../pages/researcher/ResearcherSettings';

// Shared components (used as pages)
import Assignments from '../components/shared/Assignments';
import Notifications from '../components/shared/Notifications';
import Responses from '../components/shared/Responses';
import ReviewDetails from '../components/shared/ReviewDetails';
import CommentsPage from '../components/shared/CommentsPage';
import ApplicationView from '../components/shared/ApplicationView';

/** Renders the correct settings page based on the logged-in user's role. */
const SettingsRouter = () => {
  const user = useSelector(selectUser);
  if (user?.role === 'reviewer') return <ReviewerSettings />;
  if (user?.role === 'researcher') return <ResearcherSettings />;
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login/:role" element={<UnifiedLoginPage />} />
      <Route path="/" element={<LandingPage />} />

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

        {/* Reviewer + Admin + Researcher notifications */}
        <Route element={<RoleGuard allowedRoles={['reviewer', 'admin', 'researcher']} />}>
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Reviewer + Admin routes */}
        <Route element={<RoleGuard allowedRoles={['reviewer', 'admin']} />}>
          <Route path="assignments" element={<RoleBasedAssignments />} />
          <Route path="assignments/:id/view" element={<AdminReviewView />} />
          <Route path="application/:id" element={<ApplicationView />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="users" element={<Users />} />
          <Route path="reviewers" element={<Reviewers />} />
          <Route path="reviewers/:id" element={<ReviewerProfile />} />
          <Route path="reviewers/:id/assignments" element={<ReviewerAssignments />} />
          <Route path="reviewers/:reviewerId/assignments/:id/view" element={<AdminReviewView />} />
          <Route path="reviewers/add" element={<AddReviewer />} />
          <Route path="assignments/:id/assign" element={<AssignProposal />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="researchers/:id/proposals" element={<ResearcherProposals />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Researcher-only routes */}
        <Route element={<RoleGuard allowedRoles={['researcher']} />}>
          <Route path="submissions" element={<Submissions />} />
          <Route path="submissions/new" element={<NewSubmission />} />
          <Route path="submissions/payment" element={<ProposalPayment />} />
          <Route path="submissions/:id" element={<ProposalDetail />} />
          <Route path="submissions/:id/review" element={<ResearcherProposalReview />} />
          <Route path="submissions/:id/attach" element={<AttachProposal />} />
        </Route>

        {/* Settings — reviewer + researcher */}
        <Route element={<RoleGuard allowedRoles={['reviewer', 'researcher']} />}>
          <Route path="settings" element={<SettingsRouter />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
