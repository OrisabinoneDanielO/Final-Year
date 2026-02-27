import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';

const FILTER_DAYS_MAP = {
  'This Week': 7,
  'This Month': 30,
  'Last 3 Months': 90,
  'Last 6 Months': 180,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const assignments = useSelector((s) => s.assignments.items);
  const [activeFilter, setActiveFilter] = React.useState('This Week');

  const filterOptions = ['This Week', 'This Month', 'Last 3 Months', 'Last 6 Months'];

  const filteredAssignments = React.useMemo(() => {
    const days = FILTER_DAYS_MAP[activeFilter] ?? 7;
    const now = new Date();
    const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
    return assignments.filter((a) => {
      if (!a.date) return false;
      const t = new Date(a.date).getTime();
      return Number.isFinite(t) && t >= cutoff;
    });
  }, [assignments, activeFilter]);

  const stats = React.useMemo(() => {
    const unassigned = filteredAssignments.filter((a) => a.status === 'Unaccepted').length;
    const assigned = filteredAssignments.filter((a) => a.status === 'Not Reviewed').length;
    const completed = filteredAssignments.filter((a) => a.status === 'Completed').length;
    const incomplete = filteredAssignments.filter((a) => a.status === 'Ongoing').length;
    const ugSubmissions = filteredAssignments.filter((a) => (a.draftData?.category || a.category || 'UG') === 'UG').length;
    const pgSubmissions = filteredAssignments.filter((a) => {
      const cat = a.draftData?.category || a.category || 'UG';
      return cat !== 'UG';
    }).length;
    const newApps = filteredAssignments.length;

    return { unassigned, assigned, completed, incomplete, ugSubmissions, pgSubmissions, newApps };
  }, [filteredAssignments]);

  // Map the stats object to an array for easy rendering
  const statCards = [
    { label: 'Unassigned Assignments', value: stats.unassigned },
    { label: 'Assigned Assignments', value: stats.assigned },
    { label: 'Completed Assignments', value: stats.completed },
    { label: 'Incomplete Assignments', value: stats.incomplete },
    { label: 'UG Application Submissions', value: stats.ugSubmissions },
    { label: 'PG Application Submissions', value: stats.pgSubmissions },
    { label: 'New Applications', value: stats.newApps },
  ];

  const displayName = (user?.name || user?.email?.split('@')[0] || 'Admin').split(/[\s._-]/)[0];

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">Welcome, {displayName}</h1>
          <p className="text-gray-500 text-sm font-medium">Here are your stats!</p>
        </div>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <span className="sr-only">Notifications</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
        </button>
      </header>

      {/* Row 1: Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.slice(0, 4).map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-2 tracking-wider">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Filter Row - Scrollable on mobile */}
      <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:overflow-visible space-x-3 mb-8 no-scrollbar scroll-smooth">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setActiveFilter(option)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shrink-0 sm:shrink ${activeFilter === option
              ? 'bg-[#003B95] text-white shadow-md'
              : 'bg-[#F3F4F6] text-gray-500 hover:bg-gray-200'
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Row 2: Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.slice(4).map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-2 tracking-wider">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Clickable Action Bar */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 font-sans">Your Unassigned Assignments</h2>
      <div
        onClick={() => navigate('/dashboard/assignments')}
        className="group bg-[#F3F4F6] p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
      >
        <p className="text-base sm:text-lg font-semibold text-gray-900">
          You have <span className="text-[#003B95]">{stats.unassigned}</span> Unassigned Assignments
        </p>
        <div className="p-3 bg-gray-200 rounded-full group-hover:bg-[#003B95] group-hover:text-white transition-colors self-end sm:self-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
