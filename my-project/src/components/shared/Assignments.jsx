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
      <header className="flex flex-col md:flex-row justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Assignments</h1>
          <p className="text-gray-500 font-medium">View all your assignments</p>
        </div>
      </header>

      {/* Tab Selection & Sort */}
      <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 gap-4">
        <div className="flex space-x-3">
          {["Unaccepted", "Not Reviewed", "Ongoing", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab ? "bg-[#003B95] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setIsSearchOpen((prev) => !prev)} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>
          <button onClick={cycleDateSort} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#E5E7EB] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex-1">
                {activeFilter === "Completed" && item.reviewResult && (
                  <p className={`text-xs font-bold mb-1 ${item.reviewResult === "accepted" ? "text-[#003B95]" : "text-[#C10000]"}`}>
                    {item.reviewResult === "accepted" ? "Review Accepted" : "Review Rejected"}
                  </p>
                )}

                {activeFilter === "Ongoing" && item.hasChanges && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003B95]" />
                    <span className="text-xs font-bold text-[#003B95]">Changes effected by researcher</span>
                  </div>
                )}

                <p className="text-lg font-bold text-gray-900">{item.title}</p>
              </div>

              <div className="flex space-x-3 w-full md:w-auto">
                {activeFilter === "Unaccepted" && (
                  <>
                    <button
                      className="flex-1 md:flex-none bg-[#EAB308] text-white px-10 py-2.5 rounded-full font-bold active:scale-95 transition-transform"
                      onClick={() => dispatch(acceptFromDashboard(item.id))}
                    >
                      Accept
                    </button>
                    <button
                      className="flex-1 md:flex-none bg-[#990000] text-white px-10 py-2.5 rounded-full font-bold active:scale-95 transition-transform"
                      onClick={() => openConfirmModal(item.id, 'decline')}
                    >
                      Decline
                    </button>
                  </>
                )}
                {activeFilter === "Not Reviewed" && (
                  <button onClick={() => { dispatch(beginReview(item.id)); navigate(`/dashboard/review-details/${item.id}`); }} className="flex-1 md:flex-none bg-[#EAB308] text-white px-10 py-2.5 rounded-full font-bold">
                    Begin Review
                  </button>
                )}
                {activeFilter === "Ongoing" && (
                  <button onClick={() => navigate(`/dashboard/review-details/${item.id}`)} className="flex-1 md:flex-none bg-[#003B95] text-white px-10 py-2.5 rounded-full font-bold">
                    Continue Review
                  </button>
                )}
                {activeFilter === "Completed" && (
                  <button onClick={() => navigate(`/dashboard/review-details/${item.id}`)} className="flex-1 md:flex-none bg-[#16A34A] hover:bg-[#15803D] text-white px-10 py-2.5 rounded-full font-bold">
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
