import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { assignReviewer, unassignReviewer } from '../../features/assignments/assignmentsSlice';

// Reviewer logic - MOVED TO REDUX
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

const TABS = [
  { label: 'Assigned', statuses: ['Not Reviewed', 'Ongoing'] },
  { label: 'Unassigned', statuses: ['Unaccepted'] },
  { label: 'Completed', statuses: ['Completed'] },
];

// ── Assign Reviewer Modal ─────────────────────────────────────────────────────
const AssignModal = ({ assignment, onClose, onAssign, onUnassign, reviewers }) => {
  const [selected, setSelected] = useState(assignment.reviewerId ?? null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 p-1.5 hover:bg-gray-100 rounded-full">
          <X size={18} className="text-gray-500" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Assign Reviewer</h2>
        <p className="text-sm text-gray-400 mb-5 leading-snug">{assignment.title}</p>

        <div className="space-y-2">
          {reviewers.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${selected === r.id
                ? 'bg-[#003B95] text-white'
                : 'bg-[#F3F4F6] text-gray-800 hover:bg-gray-200'
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selected === r.id ? 'bg-white/20 text-white' : 'bg-[#003B95]/20 text-[#003B95]'
                }`}>
                {getInitials(r.name)}
              </div>
              <span className="font-semibold text-sm">{r.name}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {assignment.reviewerId && (
            <button
              onClick={() => { onUnassign(assignment.id); onClose(); }}
              className="flex-1 py-2.5 rounded-full border border-[#C10000] text-[#C10000] font-bold text-sm hover:bg-red-50 transition-colors"
            >
              Unassign
            </button>
          )}
          <button
            onClick={() => { if (selected) { onAssign(assignment.id, selected); onClose(); } }}
            disabled={!selected || selected === assignment.reviewerId}
            className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-colors ${selected && selected !== assignment.reviewerId
              ? 'bg-[#003B95] text-white hover:bg-blue-900'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminAssignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allAssignments = useSelector((s) => s.assignments.items);
  const reviewersList = useSelector((s) => s.reviewers.items);

  const [activeTab, setActiveTab] = useState('Assigned');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningItem, setAssigningItem] = useState(null);

  const getReviewer = (id) => reviewersList.find(r => r.id === id) ?? null;

  const currentStatuses = TABS.find((t) => t.label === activeTab)?.statuses ?? [];

  const filtered = useMemo(() => {
    return allAssignments.filter((a) => {
      if (!currentStatuses.includes(a.status)) return false;
      if (!searchQuery.trim()) return true;
      return a.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allAssignments, currentStatuses, searchQuery]);

  const handleViewDetails = (id) => navigate(`/dashboard/assignments/${id}/view`);

  const handleAssign = (assignmentId, reviewerId) => {
    dispatch(assignReviewer({ assignmentId, reviewerId }));
  };

  const handleUnassign = (assignmentId) => {
    dispatch(unassignReviewer(assignmentId));
  };

  const getButtonProps = (item) => {
    if (activeTab === 'Completed') {
      return { label: 'View Details', cls: 'bg-green-500 hover:bg-green-600 text-white' };
    }
    if (activeTab === 'Unassigned') {
      return { label: 'Assign Reviewer', cls: 'bg-[#EAB308] hover:bg-yellow-600 text-white' };
    }
    if (item.hasChanges) {
      return { label: 'View Details', cls: 'bg-[#EAB308] hover:bg-yellow-600 text-white' };
    }
    return { label: 'View Details', cls: 'bg-[#003B95] hover:bg-blue-900 text-white' };
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Assignments</h1>

      {/* Tabs + icons */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setSearchQuery(''); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.label
                ? 'bg-[#003B95] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSearchOpen((s) => !s); setSearchQuery(''); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
            <Search size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Filter">
            <SlidersHorizontal size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an assignment"
            className="w-full bg-[#F3F4F6] rounded-xl pl-10 pr-4 py-3 text-sm outline-none border border-transparent focus:border-[#003B95] transition-colors"
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-lg">No {activeTab.toLowerCase()} assignments</p>
          </div>
        ) : (
          filtered.map((item) => {
            const btn = getButtonProps(item);
            const reviewer = getReviewer(item.reviewerId);
            const showReviewer = (activeTab === 'Assigned' || activeTab === 'Completed') && reviewer;

            return (
              <div key={item.id} className="bg-[#F3F4F6] rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
                {/* Left content */}
                <div className="flex-1 min-w-0">
                  {activeTab === 'Completed' && item.reviewResult && (
                    <p className={`text-xs font-bold mb-1 ${item.reviewResult === 'accepted' ? 'text-[#003B95]' : 'text-[#C10000]'
                      }`}>
                      {item.reviewResult === 'accepted' ? 'Review Accepted' : 'Review Rejected'}
                    </p>
                  )}
                  <p className="font-bold text-gray-900 leading-snug">{item.title}</p>

                  {/* Reviewer info */}
                  {showReviewer && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-[9px] shrink-0 border border-gray-300">
                        {getInitials(reviewer.name)}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{reviewer.name}</span>
                      {activeTab === 'Assigned' && (
                        <button
                          onClick={() => setAssigningItem(item)}
                          className="ml-1 text-xs text-gray-400 hover:text-[#003B95] font-semibold underline transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    if (activeTab === 'Unassigned') {
                      navigate(`/dashboard/assignments/${item.id}/assign`);
                    } else {
                      handleViewDetails(item.id);
                    }
                  }}
                  className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${btn.cls}`}
                >
                  {btn.label}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Modal */}
      {assigningItem && (
        <AssignModal
          assignment={assigningItem}
          reviewers={reviewersList}
          onClose={() => setAssigningItem(null)}
          onAssign={handleAssign}
          onUnassign={handleUnassign}
        />
      )}
    </div>
  );
};

export default AdminAssignments;
