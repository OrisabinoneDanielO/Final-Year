import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';

// Tabs map to assignment statuses
const TABS = [
  { label: 'Drafts', statuses: ['Unaccepted'] },
  { label: 'Not Reviewed', statuses: ['Not Reviewed'] },
  { label: 'Ongoing', statuses: ['Ongoing'] },
  { label: 'Completed', statuses: ['Completed'] },
];

// Status label config per item
const getStatusLabel = (item) => {
  if (item.status === 'Completed') {
    if (item.reviewResult === 'accepted') return { text: 'Review Accepted', color: 'text-[#003B95]' };
    if (item.reviewResult === 'rejected') return { text: 'Review Rejected', color: 'text-[#C10000]' };
  }
  if (item.status === 'Ongoing' && item.hasChanges) {
    return { text: 'Revisions Needed', color: 'text-[#EAB308]' };
  }
  return null;
};

// View Details button style per status / result
const getButtonStyle = (item) => {
  if (item.reviewResult === 'accepted' || item.reviewResult === 'rejected') {
    return 'bg-green-500 hover:bg-green-600 text-white';
  }
  if (item.status === 'Ongoing' && item.hasChanges) {
    return 'bg-[#003B95] hover:bg-blue-900 text-white';
  }
  return 'bg-[#003B95] hover:bg-blue-900 text-white';
};

const Submissions = () => {
  const navigate = useNavigate();
  const allItems = useSelector((s) => s.assignments.items);
  const reviewersList = useSelector((s) => s.reviewers.items);

  const [activeTab, setActiveTab] = useState('Drafts');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const currentStatuses = TABS.find((t) => t.label === activeTab)?.statuses ?? [];
    return allItems.filter((a) => {
      if (!currentStatuses.includes(a.status)) return false;
      if (!searchQuery.trim()) return true;
      return a.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allItems, activeTab, searchQuery]);

  const showReviewer = activeTab !== 'Drafts';

  return (
    <div className="min-h-full bg-white -m-4 sm:-m-6 lg:-m-10 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Proposals</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here are your proposals!</p>
      </div>

      {/* Tabs + icons */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-wrap gap-2">
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
        <div className="flex items-center gap-2 ml-2">
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
            autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your proposals..."
            className="w-full bg-[#F3F4F6] rounded-xl pl-10 pr-4 py-3 text-sm outline-none border border-transparent focus:border-[#003B95] transition-colors"
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-gray-400 font-bold text-lg">You have no proposals</p>
            <button
              onClick={() => navigate('/dashboard/submissions/new')}
              className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
            >
              New Submission
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const statusLabel = getStatusLabel(item);
            const btnStyle = getButtonStyle(item);
            const showBtn = activeTab === 'Drafts' || (activeTab === 'Completed' && !!item.reviewResult) || (activeTab === 'Ongoing') || (activeTab === 'Not Reviewed');

            return (
              <div
                key={item.id}
                className="bg-[#E5E7EB] rounded-2xl px-8 py-6 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  {statusLabel && (
                    <p className={`text-xs font-bold mb-1 ${statusLabel.color}`}>{statusLabel.text}</p>
                  )}
                  <p className="font-bold text-gray-900 leading-snug">{item.title}</p>
                  {showReviewer && (() => {
                    const reviewer = reviewersList.find((r) => r.id === item.reviewerId);
                    const rName = reviewer?.name ?? 'Not assigned';
                    const rInitials = reviewer
                      ? reviewer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : '??';
                    return (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-[#003B95]/20 border border-gray-300 flex items-center justify-center text-[#003B95] font-bold text-[9px] shrink-0">
                        {rInitials}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{rName}</span>
                    </div>
                    );
                  })()}
                </div>
                {showBtn && (
                  <button
                    onClick={() => {
                      if (activeTab === 'Drafts') {
                        navigate(`/dashboard/submissions/new?draft=${item.id}`);
                      } else if (activeTab === 'Ongoing' && item.hasChanges) {
                        navigate(`/dashboard/submissions/${item.id}/review`);
                      } else {
                        navigate(`/dashboard/submissions/${item.id}/review`);
                      }
                    }}
                    className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${btnStyle}`}
                  >
                    {activeTab === 'Drafts' ? 'Continue' : 'View Details'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Submissions;
