import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, MoreVertical } from 'lucide-react';

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

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
          {/* ── Profile Header ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
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
              <p className="text-gray-500 text-sm mt-1">{reviewer.specialization}</p>
            </div>

            {/* 3-dot menu */}
            <div className="relative flex-shrink-0 self-end sm:self-start">
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

          {/* ── Info Grid ──────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Title</p>
              <p className="font-bold text-gray-900 text-sm">{reviewer.title}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Speciality</p>
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {reviewer.specialization}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Institution</p>
              <p className="font-bold text-gray-900 text-sm">{reviewer.institution}</p>
            </div>
          </div>

          {/* ── Statistics ────────────────────────────────── */}
          <div className="mb-8">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-4">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-[#F3F4F6] rounded-2xl p-4 flex flex-col justify-center items-center text-center"
                >
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-wide leading-tight mb-2">
                    {card.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── View Assignments Button ───────────────────── */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/dashboard/reviewers/${reviewer.id}/assignments`);
              }}
              className="w-full sm:w-auto bg-[#003B95] text-white px-12 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
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
                className={`flex-1 text-white py-3 rounded-full font-bold transition-all ${isDeactivated
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

// Helper for initials
const initialsForReviewer = (name) => name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??';

// ── Main Reviewers Page ──────────────────────────────────────────────────────
const Reviewers = () => {
  const navigate = useNavigate();
  const reviewers = useSelector(state => state.reviewers.items);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const filteredReviewers = reviewers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registered Reviewers</h1>
          <p className="text-gray-500 text-sm font-medium">Here are all registered reviewers!</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/reviewers/add')}
          className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-900 transition-colors text-sm"
        >
          Add Reviewer
        </button>
      </header>

      {/* Filter Tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto pb-4 sm:pb-0 no-scrollbar space-x-4 mb-8">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setActiveFilter(activeFilter === option ? null : option)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shrink-0 ${activeFilter === option
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
            className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md hover:bg-[#E9EEF8] transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {reviewer.avatar ? (
                  <img src={reviewer.avatar} alt={reviewer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg">
                    {initialsForReviewer(reviewer.name)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 truncate">{reviewer.name}</p>
                <p className="text-gray-500 text-sm truncate">{reviewer.specialization}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm self-end sm:self-auto shrink-0">
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

    </div>
  );
};

export default Reviewers;
