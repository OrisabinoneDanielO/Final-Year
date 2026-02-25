import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';
import { Bell } from 'lucide-react';

const ResearcherDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Verification Alert */}
      {!user?.isVerified && (
        <div className="bg-[#FEF9C3] p-4 rounded-lg flex justify-between items-center mb-6 border border-[#EAB308]/30">
          <div>
            <p className="text-[#854D0E] font-bold text-sm">Please verify your email</p>
            <p className="text-[#A16207] text-xs">You must verify your email to submit a proposal to the BUHREC</p>
          </div>
          <button className="text-[#854D0E] font-bold text-sm underline">Verify email</button>
        </div>
      )}

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Researcher'}</h1>
          <p className="text-gray-500 text-sm font-medium">Here are your stats!</p>
        </div>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell size={20} /></button>
      </header>

      {/* Researcher Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {['Completed Proposals', 'Draft Proposals', 'Ongoing Proposal Status'].map((label, i) => (
          <div key={i} className="bg-[#F3F4F6] p-8 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-3 tracking-widest">{label}</p>
            <p className="text-4xl font-bold">{i === 2 ? 'None' : '0'}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold">Ongoing Proposal Status</h2>
        <button 
          onClick={() => navigate('/dashboard/submissions')}
          className="bg-[#003B95] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all shadow-md"
        >
          New Submission
        </button>
      </div>

      <div className="text-center py-20">
        <p className="text-gray-400 font-bold text-lg">You have no ongoing proposals</p>
      </div>
    </div>
  );
};

export default ResearcherDashboard;