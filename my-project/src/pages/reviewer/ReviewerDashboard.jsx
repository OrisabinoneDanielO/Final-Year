import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';
import { acceptFromDashboard, declineFromDashboard } from '../../features/assignments/assignmentsSlice';
import { Bell, X } from 'lucide-react';

const ReviewerDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allAssignments = useSelector(s => s.assignments.items);
  const notifications = useSelector(s => s.assignments.notifications);
  const [declineTarget, setDeclineTarget] = React.useState(null);

  // Compute stats from Redux
  const stats = React.useMemo(() => {
    const accepted = allAssignments.filter(a => a.status === 'Not Reviewed' || a.status === 'Ongoing').length;
    const completed = allAssignments.filter(a => a.status === 'Completed').length;
    const incomplete = allAssignments.filter(a => a.status === 'Ongoing').length;
    const feedback = allAssignments.filter(a => a.status === 'Completed').length;
    return { accepted, completed, incomplete, feedback };
  }, [allAssignments]);

  // Show unaccepted assignments on the dashboard
  const unacceptedAssignments = allAssignments.filter(a => a.status === 'Unaccepted').slice(0, 3);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 capitalize leading-tight">
            Welcome, {(user?.name || user?.email?.split('@')[0] || 'Reviewer').split(/[\s._-]/)[0]}
          </h1>
          <p className="text-gray-500 text-sm font-medium">Here are your stats!</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="p-3 bg-gray-100 rounded-full relative hover:bg-gray-200 transition-all active:scale-90"
        >
          <Bell size={22} className="text-gray-700" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
              {unreadNotifCount}
            </span>
          )}
        </button>
      </header>

      {/* Reviewer Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Accepted Assignments', value: stats.accepted },
          { label: 'Completed Assignments', value: stats.completed },
          { label: 'Incomplete Assignments', value: stats.incomplete },
          { label: 'Pending Feedback', value: stats.feedback },
        ].map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
            <p className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-[0.2em] leading-tight">{stat.label}</p>
            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6">Your Recent Assignments</h2>
      {unacceptedAssignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 font-bold text-lg">No pending assignments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unacceptedAssignments.map((task) => (
            <div key={task.id} className="bg-[#F3F4F6] p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">New Assignment</p>
                <h3 className="text-lg font-black text-gray-900 max-w-xl leading-tight">{task.title}</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => dispatch(acceptFromDashboard(task.id))}
                  className="w-full sm:w-auto bg-[#EAB308] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-yellow-600 shadow-md transition-all active:scale-95"
                >
                  Accept
                </button>
                <button
                  onClick={() => setDeclineTarget(task.id)}
                  className="w-full sm:w-auto bg-[#991B1B] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-red-900 shadow-md transition-all active:scale-95"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {declineTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeclineTarget(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <button onClick={() => setDeclineTarget(null)} className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full">
              <X size={18} className="text-gray-500" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Decline this assignment?</h3>
            <p className="text-sm text-gray-400 mb-6">This action will mark the assignment as rejected and cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeclineTarget(null)}
                className="flex-1 py-2.5 rounded-full bg-[#E5E7EB] text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { dispatch(declineFromDashboard(declineTarget)); setDeclineTarget(null); }}
                className="flex-1 py-2.5 rounded-full bg-[#991B1B] text-white font-semibold text-sm hover:bg-red-900 transition-colors"
              >
                Yes, Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;