import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MoreHorizontal, ChevronRight, X } from 'lucide-react';

const ResearcherModal = ({ researcher, onClose }) => {
  const navigate = useNavigate();
  if (!researcher) return null;

  const initials = researcher.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header: Avatar and Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-2xl overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm">
            {researcher.avatar ? <img src={researcher.avatar} alt="Avatar" className="w-full h-full object-cover" /> : initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{researcher.name}</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">{researcher.department}</p>
          </div>
          <button className="absolute sm:static right-10 top-4 p-2 hover:bg-gray-100 rounded-full text-blue-600 hidden sm:block">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Title</p>
            <p className="font-bold text-gray-900 text-sm">{researcher.title}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Level</p>
            <p className="font-bold text-gray-900 text-sm">{researcher.level}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Institution</p>
            <p className="font-bold text-gray-900 text-sm truncate">{researcher.institution}</p>
          </div>
        </div>

        {/* Statistics section */}
        <div className="mb-8">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Statistics</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-1 flex flex-col justify-center items-center text-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2 leading-tight">Completed<br />Proposals</p>
              <p className="text-3xl font-black text-gray-900">{researcher.completed}</p>
            </div>
            <div className="bg-[#F3F4F6] rounded-2xl p-5 flex-[2] relative flex flex-col justify-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2 leading-tight">Ongoing Proposal Status</p>
              <p className="text-xl font-bold text-[#003B95] leading-tight pr-8">{researcher.ongoingStatus}</p>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                <ChevronRight size={18} className="text-[#003B95]" />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              onClose();
              navigate(`/dashboard/researchers/${researcher.id}/proposals`);
            }}
            className="w-full sm:w-auto bg-[#003B95] text-white px-12 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
          >
            View Proposals
          </button>
        </div>
      </div>
    </div>
  );
};

const Researchers = () => {
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const researchersList = useSelector((s) => s.researchers.items);
  const allAssignments = useSelector((s) => s.proposals.items);

  // Enrich researchers with live stats from assignments
  const researchers = researchersList.map((r) => {
    const myAssignments = allAssignments.filter(
      (a) => a.researcherId === r.id || a.draftData?.researcherNames?.toLowerCase().includes(r.name.split(' ')[0].toLowerCase())
    );
    const completed = myAssignments.filter((a) => a.status === 'Completed').length;
    const ongoing = myAssignments.find((a) => a.status === 'Ongoing' || a.status === 'Not Reviewed');
    return {
      ...r,
      submissions: myAssignments.length || r.submissions || 0,
      completed: completed || r.completed || 0,
      ongoingStatus: ongoing?.status || r.ongoingStatus || 'Not Started',
    };
  });

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Registered Researchers</h1>
        <p className="text-gray-500 text-sm font-medium">Here are all registered researchers!</p>
      </header>

      {/* Researchers List */}
      <div className="space-y-3">
        {researchers.map((researcher) => (
          <button
            key={researcher.id}
            onClick={() => setSelectedResearcher(researcher)}
            className="w-full bg-[#F3F4F6] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow text-left"
          >
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg flex-shrink-0 overflow-hidden">
                {researcher.avatar ? <img src={researcher.avatar} alt="Avatar" className="w-full h-full object-cover" /> : researcher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 truncate">{researcher.name}</p>
                <p className="text-gray-500 text-sm truncate">{researcher.department} — {researcher.school}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm shrink-0 border border-blue-100 rounded-full px-4 py-1.5 bg-blue-50/50 w-full sm:w-auto text-center sm:text-left">
              View Profile
            </div>
          </button>
        ))}
      </div>

      {selectedResearcher && (
        <ResearcherModal
          researcher={selectedResearcher}
          onClose={() => setSelectedResearcher(null)}
        />
      )}
    </div>
  );
};

export default Researchers;
