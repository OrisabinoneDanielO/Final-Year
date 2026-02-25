import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MoreVertical } from 'lucide-react';

// Reviewer data with stats
const DUMMY_REVIEWERS = [
  {
    id: 1,
    name: 'Prof. Imisioluwa Hannah',
    specialization: 'Public Health & Epidemiology',
    institution: 'Babcock University',
    title: 'Professor',
    yearsInPractice: 15,
    ongoingAssignments: 10,
    avatar: null,
    stats: { accepted: 10, completed: 2, incomplete: 8, pendingFeedback: 3 },
  },
  {
    id: 2,
    name: 'Prof. Adeyemi Samuel',
    specialization: 'Clinical Psychology',
    institution: 'Babcock University',
    title: 'Professor',
    yearsInPractice: 12,
    ongoingAssignments: 8,
    avatar: null,
    stats: { accepted: 8, completed: 4, incomplete: 4, pendingFeedback: 2 },
  },
  {
    id: 3,
    name: 'Dr. Okafor Chinwe',
    specialization: 'Anatomy & Cell Biology',
    institution: 'Babcock University',
    title: 'Doctor',
    yearsInPractice: 8,
    ongoingAssignments: 5,
    avatar: null,
    stats: { accepted: 5, completed: 3, incomplete: 2, pendingFeedback: 1 },
  },
  {
    id: 4,
    name: 'Prof. Adetunde Adeyemo',
    specialization: 'Biomedical Sciences',
    institution: 'Babcock University',
    title: 'Professor',
    yearsInPractice: 20,
    ongoingAssignments: 12,
    avatar: null,
    stats: { accepted: 12, completed: 6, incomplete: 6, pendingFeedback: 4 },
  },
  {
    id: 5,
    name: 'Dr. Balogun Fatima',
    specialization: 'Public Health & Epidemiology',
    institution: 'Babcock University',
    title: 'Doctor',
    yearsInPractice: 6,
    ongoingAssignments: 3,
    avatar: null,
    stats: { accepted: 3, completed: 1, incomplete: 2, pendingFeedback: 0 },
  },
];

const FILTER_OPTIONS = ['Title', 'Years in Practice', 'Specialization', 'Institution'];

// ── Reviewer Profile Modal ───────────────────────────────────────────────────
const ReviewerModal = ({ reviewer, onClose }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const initials = reviewer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const statCards = [
    { label: 'Accepted Assignments', value: reviewer.stats.accepted },
    { label: 'Completed Assignments', value: reviewer.stats.completed },
    { label: 'Incomplete Assignments', value: reviewer.stats.incomplete },
    { label: 'Pending Feedback', value: reviewer.stats.pendingFeedback },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="p-8">
          {/* ── Profile Header ─────────────────────────────── */}
          <div className="flex items-center gap-5 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-2xl flex-shrink-0 border-4 border-gray-100 shadow overflow-hidden">
              {reviewer.avatar ? (
                <img
                  src={reviewer.avatar}
                  alt={reviewer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Name + specialization */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {reviewer.name}
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">{reviewer.specialization}</p>
            </div>

            {/* 3-dot menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowDeactivateConfirm(true);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {isDeactivated ? 'Reactivate Reviewer' : 'Deactivate Reviewer'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Info Row ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Title</p>
              <p className="font-bold text-gray-900 text-sm">{reviewer.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Speciality</p>
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {reviewer.specialization}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Institution</p>
              <p className="font-bold text-gray-900 text-sm">{reviewer.institution}</p>
            </div>
          </div>

          {/* ── Statistics ────────────────────────────────── */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-3">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-[#F3F4F6] rounded-2xl p-4 flex flex-col"
                >
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide leading-tight mb-2">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── View Assignments Button ───────────────────── */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                onClose();
                navigate(`/dashboard/reviewers/${reviewer.id}/assignments`);
              }}
              className="bg-[#003B95] text-white px-10 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors shadow-md"
            >
              View Assignments
            </button>
          </div>
        </div>
      </div>

      {/* ── Deactivate Confirm Modal ──────────────────────── */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeactivateConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isDeactivated ? 'Reactivate Account?' : 'Deactivate Account?'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isDeactivated
                ? `This will reactivate ${reviewer.name}'s account. They will regain access to the review portal.`
                : `This will deactivate ${reviewer.name}'s account. They will no longer be able to access the review portal.`}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeactivated(!isDeactivated);
                  setShowDeactivateConfirm(false);
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

// ── Main Reviewers Page ──────────────────────────────────────────────────────
const Reviewers = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const filteredReviewers = DUMMY_REVIEWERS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registered Reviewers</h1>
          <p className="text-gray-500 text-sm font-medium">Here are all registered reviewers!</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-900 transition-colors text-sm"
        >
          Add Reviewer
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setActiveFilter(activeFilter === option ? null : option)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === option
                ? 'bg-[#003B95] text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Reviewers List */}
      <div className="space-y-3">
        {filteredReviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            onClick={() => setSelectedReviewer(reviewer)}
            className="bg-[#F3F4F6] p-5 rounded-2xl flex items-center justify-between hover:shadow-md hover:bg-[#E9EEF8] transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {reviewer.avatar ? (
                  <img src={reviewer.avatar} alt={reviewer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg">
                    {reviewer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{reviewer.name}</p>
                <p className="text-gray-500 text-sm">{reviewer.specialization}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm">
              {reviewer.ongoingAssignments} ongoing assignments
            </div>
          </div>
        ))}
      </div>

      {filteredReviewers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold text-lg">No reviewers found</p>
        </div>
      )}

      {/* Reviewer Profile Modal */}
      {selectedReviewer && (
        <ReviewerModal
          reviewer={selectedReviewer}
          onClose={() => setSelectedReviewer(null)}
        />
      )}

      {/* Add Reviewer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add a Reviewer</h2>
            <p className="text-gray-400 text-sm mb-6">Fill in the details below to register a new reviewer</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Prof. John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <select className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Prof.</option>
                  <option>Dr.</option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Specialization</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Public Health & Epidemiology" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Institution</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Babcock University" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Years in Practice</label>
                <input type="number" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input type="email" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. reviewer@university.edu" />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-[#003B95] text-white px-10 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors"
              >
                Add Reviewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviewers;
