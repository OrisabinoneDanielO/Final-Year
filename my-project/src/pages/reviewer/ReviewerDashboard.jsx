import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';
import { acceptFromDashboard, declineFromDashboard } from '../../features/assignments/assignmentsSlice';
import { Bell } from 'lucide-react';

const ReviewerDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allAssignments = useSelector(s => s.assignments.items);
  const notifications = useSelector(s => s.assignments.notifications);

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
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Reviewer'}</h1>
          <p className="text-gray-500 text-sm font-medium">Here are your stats!</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/notifications')}
          className="p-2 bg-gray-100 rounded-full relative hover:bg-gray-200 transition-colors"
        >
          <Bell size={20} />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadNotifCount}
            </span>
          )}
        </button>
      </header>

      {/* Reviewer Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Accepted Assignments', value: stats.accepted },
          { label: 'Completed Assignments', value: stats.completed },
          { label: 'Incomplete Assignments', value: stats.incomplete },
          { label: 'Pending Feedback', value: stats.feedback },
        ].map((stat, i) => (
          <div key={i} className="bg-[#F3F4F6] p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-800 uppercase mb-2 tracking-widest">{stat.label}</p>
            <p className="text-4xl font-bold">{stat.value}</p>
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
            <div key={task.id} className="bg-[#F3F4F6] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">You've been assigned a new review</p>
                <h3 className="text-md font-bold text-gray-900 max-w-xl leading-snug">{task.title}</h3>
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button 
                  onClick={() => dispatch(acceptFromDashboard(task.id))}
                  className="flex-1 md:flex-none bg-[#EAB308] text-white px-8 py-2 rounded-full font-bold hover:bg-yellow-600 transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => dispatch(declineFromDashboard(task.id))}
                  className="flex-1 md:flex-none bg-[#991B1B] text-white px-8 py-2 rounded-full font-bold hover:bg-red-900 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;