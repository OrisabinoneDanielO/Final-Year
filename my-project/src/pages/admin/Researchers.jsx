import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, ChevronRight, X } from 'lucide-react';

const DUMMY_RESEARCHERS = [
  { id: 1, name: 'Anaise Chem', title: 'Miss', level: 'PG', department: 'Anatomy', school: 'School of Basic Sciences', institution: 'Babcock University', submissions: 2, completed: 2, ongoingStatus: 'Not Started', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Ademide Sharon', title: 'Mrs', level: 'PhD', department: 'Computer Science', school: 'School of Computing', institution: 'Babcock University', submissions: 1, completed: 1, ongoingStatus: 'Under Review', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Amaka Hadiyat', title: 'Miss', level: 'Masters', department: 'Computer Science', school: 'School of Computing', institution: 'Babcock University', submissions: 3, completed: 2, ongoingStatus: 'Revisions Requested', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Balogun Fatima Ola', title: 'Dr', level: 'PhD', department: 'Public Health', school: 'School of Public Health', institution: 'Babcock University', submissions: 0, completed: 0, ongoingStatus: 'Not Started', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Okafor Chinwe David', title: 'Mr', level: 'UG', department: 'Biochemistry', school: 'School of Basic Sciences', institution: 'Babcock University', submissions: 1, completed: 0, ongoingStatus: 'Not Started', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const ResearcherModal = ({ researcher, onClose }) => {
  const navigate = useNavigate();
  if (!researcher) return null;

  const initials = researcher.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl p-8">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header: Avatar and Name */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xl overflow-hidden shrink-0">
              {researcher.avatar ? <img src={researcher.avatar} alt="Avatar" className="w-full h-full object-cover" /> : initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{researcher.name}</h2>
              <p className="text-gray-600 text-sm font-medium">{researcher.department}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div>
            <p className="text-gray-500 text-xs font-semibold mb-1">Title</p>
            <p className="font-bold text-gray-900 text-sm">{researcher.title}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold mb-1">Level</p>
            <p className="font-bold text-gray-900 text-sm">{researcher.level}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold mb-1">Institution</p>
            <p className="font-bold text-gray-900 text-sm">{researcher.institution}</p>
          </div>
        </div>

        {/* Statistics section */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-3 block">Statistics</h3>
          <div className="flex gap-4">
            <div className="bg-[#F3F4F6] rounded-xl p-4 flex-1">
              <p className="text-[10px] font-bold text-gray-900 mb-1 leading-tight">Completed<br />Proposals</p>
              <p className="text-xl font-bold text-gray-900">{researcher.completed}</p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-4 flex-[2] relative flex flex-col justify-center">
              <p className="text-[10px] font-bold text-gray-900 mb-1 leading-tight">Ongoing Proposal Status</p>
              <p className="text-xl font-bold text-gray-900">{researcher.ongoingStatus}</p>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200/60 flex items-center justify-center">
                <ChevronRight size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              onClose();
              navigate(`/dashboard/researchers/${researcher.id}/proposals`);
            }}
            className="bg-[#003B95] text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-blue-900 transition-colors"
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

  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registered Researchers</h1>
        <p className="text-gray-500 text-sm font-medium">Here are all registered researchers!</p>
      </header>

      {/* Researchers List */}
      <div className="space-y-3">
        {DUMMY_RESEARCHERS.map((researcher) => (
          <button
            key={researcher.id}
            onClick={() => setSelectedResearcher(researcher)}
            className="w-full bg-[#F3F4F6] p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg flex-shrink-0 overflow-hidden">
                {researcher.avatar ? <img src={researcher.avatar} alt="Avatar" className="w-full h-full object-cover" /> : researcher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{researcher.name}</p>
                <p className="text-gray-500 text-sm">{researcher.department} — {researcher.school}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm mr-2 border border-blue-100 rounded-full px-4 py-1.5 bg-blue-50/50">
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
