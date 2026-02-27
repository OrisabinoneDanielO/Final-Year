import React, { useState, useMemo, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { acceptFromDashboard, declineFromDashboard, beginReview } from '../../features/assignments/assignmentsSlice'

const Assignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const reduxAssignments = useSelector(s => s.assignments.items)

  // --- Modal State ---
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    id: null
  });

  const [activeFilter, setActiveFilter] = useState("Unaccepted");
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dateSort, setDateSort] = useState('none');

  const location = useLocation();

  // If navigated here with an activeTab in state, set that tab
  React.useEffect(() => {
    if (location?.state?.activeTab) {
      setActiveFilter(location.state.activeTab);
    }
  }, [location?.state?.activeTab]);

  // Logic to open modal
  const openConfirmModal = (id, type) => {
    setModalState({ isOpen: true, type, id });
  };

  // Logic to handle actual confirmation
  const handleConfirmAction = () => {
    if (modalState.type === 'decline') {
      dispatch(declineFromDashboard(modalState.id))
    }
    setModalState({ ...modalState, isOpen: false });
  };

  const sourceAssignments = reduxAssignments

  const filtered = useMemo(() => {
    const base = sourceAssignments.filter(
      (i) =>
        i.status === activeFilter &&
        i.title.toLowerCase().includes(search.toLowerCase())
    );

    if (dateSort === 'none') return base;

    return [...base].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return dateSort === 'asc' ? da - db : db - da;
    });
  }, [sourceAssignments, activeFilter, search, dateSort]);

  const cycleDateSort = () => {
    const next = dateSort === 'none' ? 'desc' : dateSort === 'desc' ? 'asc' : 'none';
    setDateSort(next);
  };

  return (
    <div className="flex flex-col min-h-full">
      <header className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Your Assignments</h1>
          <p className="text-gray-500 text-sm font-medium">View and manage your proposal reviews</p>
        </div>
      </header>

      {/* Tab Selection & Sort - Scrollable on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto">
          {["Unaccepted", "Not Reviewed", "Ongoing", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-black tracking-wide transition-all whitespace-nowrap shadow-sm shrink-0 ${activeFilter === tab ? "bg-[#003B95] text-white" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
          <button onClick={() => setIsSearchOpen((prev) => !prev)} className="p-2.5 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-90">
            <Search size={20} className="text-gray-600" />
          </button>
          <button onClick={cycleDateSort} className="p-2.5 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-90">
            <SlidersHorizontal className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="mb-8">
          <div className="relative w-full md:w-72 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Search assignments..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white rounded-lg w-full border-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {filtered.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm border border-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex-1 min-w-0">
                {activeFilter === "Completed" && item.reviewResult && (
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${item.reviewResult === "accepted" ? "text-[#003B95]" : "text-[#C10000]"}`}>
                    {item.reviewResult === "accepted" ? "Review Accepted" : "Review Rejected"}
                  </p>
                )}

                {activeFilter === "Ongoing" && item.hasChanges && (
                  <div className="flex items-center gap-2 mb-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-[#003B95] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#003B95]">Changes Effected</span>
                  </div>
                )}

                <p className="text-base sm:text-lg font-black text-gray-900 leading-tight">{item.title}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                {activeFilter === "Unaccepted" && (
                  <>
                    <button
                      className="w-full sm:w-auto bg-[#EAB308] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-yellow-600 transition-all active:scale-95"
                      onClick={() => dispatch(acceptFromDashboard(item.id))}
                    >
                      Accept
                    </button>
                    <button
                      className="w-full sm:w-auto bg-[#991B1B] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-red-900 transition-all active:scale-95"
                      onClick={() => openConfirmModal(item.id, 'decline')}
                    >
                      Decline
                    </button>
                  </>
                )}
                {activeFilter === "Not Reviewed" && (
                  <button
                    onClick={() => { dispatch(beginReview(item.id)); navigate(`/dashboard/review-details/${item.id}`); }}
                    className="w-full sm:w-auto bg-[#EAB308] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-yellow-600 transition-all active:scale-95"
                  >
                    Begin Review
                  </button>
                )}
                {activeFilter === "Ongoing" && (
                  <button
                    onClick={() => navigate(`/dashboard/review-details/${item.id}`)}
                    className="w-full sm:w-auto bg-[#003B95] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-blue-900 transition-all active:scale-95"
                  >
                    Continue Review
                  </button>
                )}
                {activeFilter === "Completed" && (
                  <button
                    onClick={() => navigate(`/dashboard/review-details/${item.id}`)}
                    className="w-full sm:w-auto bg-[#16A34A] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-green-700 transition-all active:scale-95"
                  >
                    Inspect Review
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Assignments;
