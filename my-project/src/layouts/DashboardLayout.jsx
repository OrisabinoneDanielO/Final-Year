import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Sidebar';

const DashboardLayout = () => {
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

