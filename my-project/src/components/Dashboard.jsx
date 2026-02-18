import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import { Menu, X, Home, Briefcase, MessageSquare, LogOut, Bell } from 'lucide-react';
import { useAssignments } from '../context/AssignmentsContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { assignments, stats, acceptFromDashboard, declineFromDashboard, notifications } = useAssignments();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 1024;
    return false;
  });

  // --- Dynamic Notification Logic ---
  const notificationCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // --- Dynamic Stats Logic Mapping ---
  // This maps your context stats to the UI grid labels
  const statsGrid = useMemo(() => [
    { label: 'Accepted', value: stats.accepted },
    { label: 'Completed', value: stats.completed },
    { label: 'Incomplete', value: stats.incomplete },
    { label: 'Feedback', value: stats.feedback }
  ], [stats]);

  const recentAssignments = assignments
    .filter((a) => a.status === 'Unaccepted')
    .slice(0, 4);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Modal State for Confirmations ---
  const [modalState, setModalState] = useState({ isOpen: false, type: '', id: null });

  const openConfirmModal = (id, type) => {
    setModalState({ isOpen: true, type, id });
  };

  const handleConfirmAction = () => {
    // Only decline is confirmed via modal from dashboard
    if (modalState.type === 'decline') {
      declineFromDashboard(modalState.id);
    }
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F3F4F6]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#003B95] text-white p-4 flex justify-between items-center z-[60]">
        <span className="font-bold">BUHREC</span>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMenuOpen || isDesktop) && (
          <motion.aside 
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            className="fixed lg:sticky inset-y-0 left-0 w-72 lg:w-64 bg-[#003B95] text-white flex flex-col p-6 h-screen z-[70] lg:z-auto"
          >
            <nav className="flex-1 space-y-4">
              <div className="flex items-center space-x-3 bg-[#001F52] p-3 rounded-lg border-l-4 border-white shadow-lg cursor-default">
                <Home size={20} /> <span className="font-bold">Dashboard</span>
              </div>
              <div onClick={() => navigate('/assignments')} className="flex items-center justify-between p-3 hover:bg-[#002D72] rounded-lg cursor-pointer transition-colors group">
                <div className="flex items-center space-x-3">
                  <Briefcase size={20} />
                  <span>Assignments</span>
                </div>
                {/* Dynamic Sidebar Badge */}
                {stats.incomplete > 0 && (
                  <span className="bg-[#EAB308] text-[#003B95] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stats.incomplete}
                  </span>
                )}
              </div>
              <div onClick={() => navigate('/responses')} className="flex items-center space-x-3 p-3 hover:bg-[#002D72] rounded-lg cursor-pointer transition-colors">
                <MessageSquare size={20} /> <span>Responses</span>
              </div>
            </nav>
            <div className="mt-auto space-y-6">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden border-2 border-white">
                   <img src="https://via.placeholder.com/40" alt="p" />
                 </div>
                 <span className="text-sm font-medium">Adetunde Adeyemo</span>
               </div>
               <button onClick={() => navigate('/login')} className="flex items-center justify-center space-x-2 bg-[#C10000] w-full py-3 rounded-lg hover:bg-red-700 transition active:scale-95">
                <LogOut size={18} /> <span className="font-bold">Log out</span>
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div><h1 className="text-3xl font-bold text-gray-900">Welcome, Adetunde</h1><p className="text-gray-500 font-medium">Here are your stats!</p></div>
          <button onClick={() => navigate('/notifications')} className="relative cursor-pointer group p-2 rounded-full hover:bg-white transition-all">
            <Bell size={24} className="text-gray-900" />
            { notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C10000] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#F3F4F6]">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </header>

        {/* Dynamic Stats Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsGrid.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#E5E7EB] p-6 rounded-2xl flex justify-between items-center lg:flex-col lg:items-start shadow-sm"
            >
              <p className="text-xs font-bold text-gray-800 leading-tight w-20">{stat.label} Assignments</p>
              <p className="text-4xl font-bold text-black">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Recent Assignments</h2>
          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {recentAssignments.map((item) => (
                <motion.div
                  layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-[#E5E7EB] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100"
                >
                  <div className="flex-1 text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">New Review Assigned</p>
                    <p className="text-lg font-bold leading-tight text-gray-900">{item.title}</p>
                  </div>
                  <div className="flex space-x-3 w-full md:w-auto">
                    <button onClick={() => acceptFromDashboard(item.id)} className="flex-1 md:flex-none bg-[#EAB308] text-white px-8 py-2.5 rounded-full font-bold hover:bg-yellow-600 transition-all active:scale-95 shadow-md">Accept</button>
                    <button onClick={() => openConfirmModal(item.id, 'decline')} className="flex-1 md:flex-none bg-[#990000] text-white px-8 py-2.5 rounded-full font-bold hover:bg-red-800 transition-all active:scale-95 shadow-md">Decline</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentAssignments.length === 0 && (
                <p className="text-center text-gray-500 py-10 font-medium">You have no pending assignments.</p>
            )}
          </div>
        </section>
      </main>
      {/* Confirmation Modal used by Dashboard */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Dashboard;