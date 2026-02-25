import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#F3F4F6]">
      <Sidebar />
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

