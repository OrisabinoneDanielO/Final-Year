import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';

// Dummy reviewer for "Assigned" cards (since assignments don't store reviewer ref yet)
const DUMMY_REVIEWER = {
  name: 'Prof. Imisioluwa Hannah',
  initials: 'IH',
};

const TABS = [
  { label: 'Assigned',   statuses: ['Not Reviewed', 'Ongoing'] },
  { label: 'Unassigned', statuses: ['Unaccepted'] },
  { label: 'Completed',  statuses: ['Completed'] },
];

const AdminAssignments = () => {
  const navigate = useNavigate();
  const allAssignments = useSelector((s) => s.assignments.items);

  const [activeTab, setActiveTab] = useState('Assigned');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentStatuses = TABS.find((t) => t.label === activeTab)?.statuses ?? [];

  const filtered = useMemo(() => {
    return allAssignments.filter((a) => {
      if (!currentStatuses.includes(a.status)) return false;
      if (!searchQuery.trim()) return true;
      return a.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allAssignments, currentStatuses, searchQuery]);

  // Navigate to the admin read-only view
  const handleViewDetails = (id) => {
    navigate(`/dashboard/assignments/${id}/view`);
  };

  // Button style + label per tab / item state
  const getButtonProps = (item) => {
    if (activeTab === 'Completed') {
      return { label: 'View Details', cls: 'bg-green-500 hover:bg-green-600 text-white' };
    }
    if (activeTab === 'Unassigned') {
      return { label: 'View Details', cls: 'bg-[#EAB308] hover:bg-yellow-600 text-white' };
    }
    // Assigned — yellow if researcher made changes, blue otherwise
    if (item.hasChanges) {
      return { label: 'View Details', cls: 'bg-[#EAB308] hover:bg-yellow-600 text-white' };
    }
    return { label: 'View Details', cls: 'bg-[#003B95] hover:bg-blue-900 text-white' };
  };

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Assignments</h1>

      {/* Tabs + icons */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setSearchQuery(''); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.label
                  ? 'bg-[#003B95] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSearchOpen((s) => !s); setSearchQuery(''); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
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
            placeholder="Search for an ongoing assignment"
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
            const showReviewer = activeTab === 'Assigned' || activeTab === 'Completed';

            return (
              <div
                key={item.id}
                className="bg-[#F3F4F6] rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
              >
                {/* Left content */}
                <div className="flex-1 min-w-0">
                  {/* Review result label for Completed */}
                  {activeTab === 'Completed' && item.reviewResult && (
                    <p className={`text-xs font-bold mb-1 ${
                      item.reviewResult === 'accepted' ? 'text-[#003B95]' : 'text-[#C10000]'
                    }`}>
                      {item.reviewResult === 'accepted' ? 'Review Accepted' : 'Review Rejected'}
                    </p>
                  )}

                  <p className="font-bold text-gray-900 leading-snug">{item.title}</p>

                  {/* Reviewer info */}
                  {showReviewer && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-[9px] shrink-0 border border-gray-300">
                        {DUMMY_REVIEWER.initials}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{DUMMY_REVIEWER.name}</span>
                    </div>
                  )}
                </div>

                {/* View Details button */}
                <button
                  onClick={() => handleViewDetails(item.id)}
                  className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${btn.cls}`}
                >
                  {btn.label}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAssignments;
