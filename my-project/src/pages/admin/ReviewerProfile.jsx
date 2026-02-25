import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Mail, Phone, Building2, Award, Clock } from 'lucide-react';

// Shared reviewer data — same source as Reviewers.jsx
// In a real app this would come from Redux/API
const REVIEWERS_DATA = [
  { id: 1, name: 'Prof. Imisioluwa Hannah', email: 'imisioluwa.h@babcock.edu.ng', phone: '+234 801 234 5678', specialization: 'Public Health & Epidemiology', institution: 'Babcock University', department: 'Department of Public Health', title: 'Prof.', yearsInPractice: 15, ongoingAssignments: 10, status: 'active' },
  { id: 2, name: 'Prof. Adeyemi Samuel', email: 'adeyemi.s@babcock.edu.ng', phone: '+234 802 345 6789', specialization: 'Clinical Psychology', institution: 'Babcock University', department: 'Department of Psychology', title: 'Prof.', yearsInPractice: 12, ongoingAssignments: 8, status: 'active' },
  { id: 3, name: 'Dr. Okafor Chinwe', email: 'okafor.c@babcock.edu.ng', phone: '+234 803 456 7890', specialization: 'Anatomy & Cell Biology', institution: 'Babcock University', department: 'Department of Anatomy', title: 'Dr.', yearsInPractice: 8, ongoingAssignments: 5, status: 'active' },
  { id: 4, name: 'Prof. Adetunde Adeyemo', email: 'adetunde.a@babcock.edu.ng', phone: '+234 804 567 8901', specialization: 'Biomedical Sciences', institution: 'Babcock University', department: 'Department of Biomedical Sciences', title: 'Prof.', yearsInPractice: 20, ongoingAssignments: 12, status: 'active' },
  { id: 5, name: 'Dr. Balogun Fatima', email: 'balogun.f@babcock.edu.ng', phone: '+234 805 678 9012', specialization: 'Public Health & Epidemiology', institution: 'Babcock University', department: 'Department of Public Health', title: 'Dr.', yearsInPractice: 6, ongoingAssignments: 3, status: 'active' },
];

const ReviewerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const reviewer = REVIEWERS_DATA.find(r => String(r.id) === String(id));

  if (!reviewer) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full mb-4">
          <ArrowLeft size={24} />
        </button>
        <p className="text-gray-500 text-lg font-bold">Reviewer not found</p>
      </div>
    );
  }

  const initials = reviewer.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Top bar with back + 3-dot menu */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={24} className="text-gray-700" />
          </button>
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowDeactivateModal(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  {isDeactivated ? 'Reactivate Account' : 'Deactivate Account'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#F3F4F6] rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-3xl flex-shrink-0 border-4 border-white shadow-md">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{reviewer.name}</h1>
              {isDeactivated ? (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Deactivated</span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
              )}
            </div>
            <p className="text-gray-500 font-medium">{reviewer.specialization}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-center gap-4 bg-[#F3F4F6] p-5 rounded-2xl">
          <div className="p-3 bg-[#003B95]/10 rounded-xl"><Mail size={20} className="text-[#003B95]" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
            <p className="font-semibold text-gray-900">{reviewer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#F3F4F6] p-5 rounded-2xl">
          <div className="p-3 bg-[#003B95]/10 rounded-xl"><Phone size={20} className="text-[#003B95]" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
            <p className="font-semibold text-gray-900">{reviewer.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#F3F4F6] p-5 rounded-2xl">
          <div className="p-3 bg-[#003B95]/10 rounded-xl"><Building2 size={20} className="text-[#003B95]" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Institution</p>
            <p className="font-semibold text-gray-900">{reviewer.institution}</p>
            <p className="text-gray-500 text-sm">{reviewer.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#F3F4F6] p-5 rounded-2xl">
          <div className="p-3 bg-[#003B95]/10 rounded-xl"><Award size={20} className="text-[#003B95]" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Specialization</p>
            <p className="font-semibold text-gray-900">{reviewer.specialization}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#F3F4F6] p-5 rounded-2xl">
          <div className="p-3 bg-[#003B95]/10 rounded-xl"><Clock size={20} className="text-[#003B95]" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Years in Practice</p>
            <p className="font-semibold text-gray-900">{reviewer.yearsInPractice} years</p>
          </div>
        </div>
      </div>

      {/* Quick Stats + View Assignments Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-[#F3F4F6] px-6 py-4 rounded-2xl text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Ongoing</p>
            <p className="text-2xl font-bold text-gray-900">{reviewer.ongoingAssignments}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/reviewers/${id}/assignments`)}
          className="bg-[#003B95] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors shadow-md"
        >
          View Assignments
        </button>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeactivateModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isDeactivated ? 'Reactivate Account?' : 'Deactivate Account?'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isDeactivated
                ? `This will reactivate ${reviewer.name}'s account. They will regain access to the review portal.`
                : `This will deactivate ${reviewer.name}'s account. They will no longer be able to access the review portal.`
              }
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeactivated(!isDeactivated);
                  setShowDeactivateModal(false);
                }}
                className={`flex-1 text-white py-3 rounded-full font-bold transition-all ${
                  isDeactivated
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-[#C10000] hover:bg-red-700'
                }`}
              >
                {isDeactivated ? 'Reactivate' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerProfile;
