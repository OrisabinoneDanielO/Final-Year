import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Home, Briefcase, MessageSquare, LogOut, Search, User } from 'lucide-react';

const Responses = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 1024;
    return false;
  });

  const dummyMessages = [
    { id: 1, assignmentId: 3, sender: "Agu Joshua", subject: "Re: Sleep Deprivation Study", date: "2 mins ago", preview: "I have uploaded the requested revisions for Chapter 2...", unread: true },
    { id: 2, assignmentId: 5, sender: "Admin Office", subject: "Review Portal Update", date: "1 hour ago", preview: "Please note that the deadline for current medical reviews has been extended...", unread: false },
    { id: 3, assignmentId: 7, sender: "Ben Carson Medicine", subject: "New Proposal Submission", date: "Yesterday", preview: "A new proposal regarding anatomy education has been sent to your queue...", unread: false },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F3F4F6]">
      <div className="lg:hidden bg-[#003B95] text-white p-4 flex justify-between items-center z-[60]">
        <span className="font-bold">BUHREC</span>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </div>

      <AnimatePresence>
        {(isMenuOpen || isDesktop) && (
          <motion.aside 
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            className="fixed lg:sticky inset-y-0 left-0 w-72 lg:w-64 bg-[#003B95] text-white flex flex-col p-6 h-screen z-[70] lg:z-auto"
          >
            <nav className="flex-1 space-y-4">
              <div onClick={() => navigate('/dashboard')} className="flex items-center space-x-3 p-3 hover:bg-[#002D72] rounded-lg cursor-pointer transition-colors"><Home size={20} /> <span>Dashboard</span></div>
              <div onClick={() => navigate('/assignments')} className="flex items-center space-x-3 p-3 hover:bg-[#002D72] rounded-lg cursor-pointer transition-colors"><Briefcase size={20} /> <span>Assignments</span></div>
                <div className="flex items-center space-x-3 bg-[#001F52] p-3 rounded-lg border-l-4 border-white shadow-lg cursor-default relative">
                  <MessageSquare size={20} /> <span className="font-bold">Responses</span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C10000]" />
                </div>
            </nav>
              <div className="mt-auto space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden border-2 border-white">
                    <img src="https://via.placeholder.com/40" alt="avatar" />
                  </div>
                  <span className="text-sm font-medium">Adetunde Adeyemo</span>
                </div>
                <button onClick={() => navigate('/login')} className="flex items-center justify-center space-x-2 bg-[#C10000] w-full py-3 rounded-lg hover:bg-red-700 transition"><LogOut size={18} /> <span>Log out</span></button>
              </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Responses</h1>
          <p className="text-gray-500 font-medium">The following proposals have changes effected by the researchers</p>
        </header>

        <div className="space-y-6">
          {dummyMessages.map((msg) => (
            <div key={msg.id} className="bg-[#E5E7EB] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003B95]" />
                    <span className="text-sm font-bold text-[#003B95]">Changes Effected By Researcher</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 max-w-3xl">{msg.subject} {msg.preview ? '' : ''}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button onClick={() => navigate(`/review-details/${msg.assignmentId}`)} className="bg-[#003B95] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#002b76] transition">
                  Continue Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Responses;