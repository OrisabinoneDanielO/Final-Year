import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { fetchProposals } from '../features/proposals/proposalsSlice';
import { fetchReviewers } from '../features/reviewers/reviewersSlice';
import { fetchNotifications } from '../features/notifications/notificationsSlice';
import { fetchPayments } from '../features/payments/paymentsSlice';
import { fetchResearchers } from '../features/researchers/researchersSlice';
import Sidebar from '../components/core/Sidebar';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = user?.role;

  // Fetch core data once when the dashboard mounts (role-aware)
  useEffect(() => {
    if (!role) return;

    // All roles need proposals
    dispatch(fetchProposals());
    dispatch(fetchNotifications());

    if (role === 'admin') {
      dispatch(fetchReviewers());
      dispatch(fetchResearchers());
      dispatch(fetchPayments());
    }

    if (role === 'reviewer') {
      dispatch(fetchReviewers());
    }
  }, [dispatch, role]);

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

