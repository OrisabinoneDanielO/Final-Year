import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import {
  markNotificationRead,
  markAllNotificationsRead,
  markResearcherNotificationRead,
} from '../../features/assignments/assignmentsSlice';

// ── Icon per notification type ────────────────────────────────────────────────
const TYPE_ICON = {
  comment: <MessageSquare size={16} className="text-[#003B95]" />,
  revision: <MessageSquare size={16} className="text-yellow-500" />,
  approved: <CheckCircle size={16} className="text-green-500" />,
  rejected: <XCircle size={16} className="text-[#C10000]" />,
  payment: <CreditCard size={16} className="text-purple-500" />,
};

// ── Admin view ────────────────────────────────────────────────────────────────
const AdminNotifications = ({ notifications, navigate, dispatch }) => {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4 flex-1">
          <button onClick={() => navigate(-1)} className="mt-1 p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0" aria-label="Go back">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">Your Notifications</h1>
            <p className="text-gray-500 text-sm mt-0.5 font-medium">Updates on proposals and researcher submissions</p>
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={() => dispatch(markAllNotificationsRead())}
            className="w-full sm:w-auto px-6 py-2.5 bg-white rounded-full text-xs font-black uppercase tracking-widest text-[#003B95] shadow-sm hover:bg-gray-50 transition-all border border-[#003B95]/10 active:scale-95"
          >
            Mark all read
          </button>
        )}
      </div>
      {unread > 0 && (
        <p className="text-sm text-gray-500 mb-4 max-w-3xl mx-auto">
          You have <span className="font-bold text-gray-800">{unread}</span> unread notification{unread !== 1 ? 's' : ''}
        </p>
      )}
      <div className="space-y-3 max-w-3xl mx-auto">
        {notifications.length === 0 ? (
          <div className="bg-[#E5E7EB] rounded-2xl p-12 text-center">
            <Bell size={28} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`bg-white rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-transparent hover:border-blue-100 transition-all ${!n.read ? 'border-l-4 border-l-[#003B95]' : ''}`}>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => { dispatch(markNotificationRead(n.id)); navigate(`/dashboard/assignments/${n.assignmentId}/view`); }}
                  className="text-left text-[#003B95] font-black text-sm leading-snug hover:underline block mb-2"
                >
                  {n.title}
                </button>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {!n.read
                  ? <span className="text-[10px] font-black uppercase tracking-widest text-[#C10000] bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse">New</span>
                  : <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seen</span>
                }
              </div>
            </div>
          ))
        )}
      </div>
      <p className="text-right text-sm text-gray-400 font-medium mt-8 max-w-3xl mx-auto">
        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

// ── Reviewer view ─────────────────────────────────────────────────────────────
const ReviewerNotifications = ({ notifications, unreadCount, navigate, dispatch }) => (
  <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-start gap-4 flex-1">
        <button onClick={() => navigate(-1)} className="mt-1 p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0" aria-label="Go back">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Your Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Proposal updates from researchers</p>
        </div>
      </div>
      {unreadCount > 0 && (
        <button
          onClick={() => dispatch(markAllNotificationsRead())}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#003B95] rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:bg-blue-900 transition-all active:scale-95"
        >
          Mark all read
        </button>
      )}
    </div>
    {unreadCount > 0 && (
      <p className="text-sm text-gray-500 mb-6 max-w-3xl mx-auto flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#003B95] animate-pulse" />
        You have <span className="font-black text-gray-900">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
      </p>
    )}
    <div className="space-y-4 max-w-3xl mx-auto">
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
            <Bell size={28} className="text-[#003B95] opacity-50" />
          </div>
          <p className="font-black text-gray-900 text-lg">No notifications</p>
          <p className="text-gray-400 text-sm mt-2 font-medium">You're all caught up for now!</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className={`bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all hover:shadow-md ${!n.read ? 'border-l-4 border-l-[#003B95]' : ''}`}>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => { dispatch(markNotificationRead(n.id)); navigate(`/dashboard/review-details/${n.assignmentId}`); }}
                className="text-left text-[#003B95] font-black text-sm hover:underline leading-snug block mb-2"
              >
                {n.title}
              </button>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4 shrink-0">
              {!n.read
                ? <span className="text-[10px] font-black uppercase tracking-widest text-[#C10000] bg-red-50 px-3 py-1 rounded-full border border-red-100">New</span>
                : <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seen</span>}
              {!n.read && (
                <button
                  onClick={() => dispatch(markNotificationRead(n.id))}
                  className="px-4 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ── Researcher view ───────────────────────────────────────────────────────────
const ResearcherNotifications = ({ notifications, unreadCount, navigate, dispatch }) => (
  <div className="min-h-full bg-white p-4 sm:p-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-[22px] sm:text-2xl font-black text-gray-900 leading-tight">Notifications</h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">Updates on your proposals and payments</p>
        </div>
      </div>
      {unreadCount > 0 && (
        <span className="text-[10px] font-black text-white bg-[#C10000] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
          {unreadCount} new
        </span>
      )}
    </div>

    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Bell size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-black tracking-wide">No notifications yet</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-[#F9FAFB] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all hover:bg-[#F3F4F6] border border-transparent hover:border-blue-50 ${!n.read ? 'border-l-4 border-l-[#003B95] shadow-sm' : ''}`}
          >
            {/* Icon + text */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                {TYPE_ICON[n.type] ?? <Bell size={18} className="text-gray-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm leading-snug mb-1">{n.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-2">{n.body}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Badge + mark read */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-3 shrink-0">
              {!n.read
                ? <span className="text-[10px] font-black uppercase tracking-widest text-[#C10000] bg-red-50 px-3 py-1 rounded-full border border-red-100">New</span>
                : <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seen</span>}
              {!n.read && (
                <button
                  onClick={() => dispatch(markResearcherNotificationRead(n.id))}
                  className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ── Unified export ────────────────────────────────────────────────────────────
const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const notifications = useSelector((s) => s.assignments.notifications ?? []);
  const researcherNotifications = useSelector((s) => s.assignments.researcherNotifications ?? []);
  const unreadCount = (notifications).filter((n) => !n.read).length;
  const researcherUnreadCount = (researcherNotifications).filter((n) => !n.read).length;

  if (user?.role === 'admin') {
    return <AdminNotifications notifications={notifications} navigate={navigate} dispatch={dispatch} />;
  }

  if (user?.role === 'researcher') {
    return (
      <ResearcherNotifications
        notifications={researcherNotifications}
        unreadCount={researcherUnreadCount}
        navigate={navigate}
        dispatch={dispatch}
      />
    );
  }

  return (
    <ReviewerNotifications
      notifications={notifications}
      unreadCount={unreadCount}
      navigate={navigate}
      dispatch={dispatch}
    />
  );
};

export default Notifications;
