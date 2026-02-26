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
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="flex items-start gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="mt-1 p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0" aria-label="Go back">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Your Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">Updates on proposals and researcher submissions</p>
        </div>
        {unread > 0 && (
          <button onClick={() => dispatch(markAllNotificationsRead())} className="shrink-0 px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 transition-colors">
            Mark all as read
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
            <div key={n.id} className={`bg-[#E5E7EB] rounded-2xl px-6 py-5 flex items-start justify-between gap-4 ${!n.read ? 'border-l-4 border-[#003B95]' : ''}`}>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/dashboard/assignments/${n.assignmentId}/view`)} className="text-left text-[#003B95] font-semibold text-sm leading-snug hover:underline">
                  {n.title}
                </button>
                <p className="text-xs text-gray-500 mt-1.5">
                  {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
              {!n.read
                ? <span className="text-xs font-bold text-[#C10000] bg-red-50 px-2 py-0.5 rounded-full shrink-0 mt-0.5">New</span>
                : <span className="text-xs text-gray-400 shrink-0 mt-0.5">Seen</span>
              }
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
  <div className="min-h-screen bg-[#F3F4F6] p-6">
    <div className="flex items-start gap-4 mb-6">
      <button onClick={() => navigate(-1)} className="mt-0.5 p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0" aria-label="Go back">
        <ArrowLeft size={20} className="text-gray-800" />
      </button>
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-900">Your Notifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">The following proposals have changes effected by the researchers</p>
      </div>
      {unreadCount > 0 && (
        <button onClick={() => dispatch(markAllNotificationsRead())} className="shrink-0 px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 transition-colors">
          Mark all as read
        </button>
      )}
    </div>
    {unreadCount > 0 && (
      <p className="text-sm text-gray-500 mb-4 max-w-3xl mx-auto">
        You have <span className="font-bold text-gray-800">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
      </p>
    )}
    <div className="space-y-3 max-w-3xl mx-auto">
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-500">No notifications</p>
          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className={`bg-white rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4 ${!n.read ? 'border-l-4 border-[#003B95]' : ''}`}>
            <div className="flex-1 min-w-0">
              <button onClick={() => { dispatch(markNotificationRead(n.id)); navigate(`/dashboard/review-details/${n.assignmentId}`); }} className="text-left text-[#003B95] font-semibold text-sm hover:underline leading-snug">
                {n.title}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">
                {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {!n.read ? <span className="text-xs font-bold text-[#C10000] bg-red-50 px-2 py-0.5 rounded-full">New</span> : <span className="text-xs text-gray-400">Seen</span>}
              {!n.read && (
                <button onClick={() => dispatch(markNotificationRead(n.id))} className="text-xs font-semibold text-gray-600 bg-[#E5E7EB] px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
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
  <div className="min-h-full bg-white p-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-400 mt-0.5">Updates on your proposals and payments</p>
        </div>
      </div>
      {unreadCount > 0 && (
        <span className="text-xs font-bold text-white bg-[#C10000] px-2.5 py-1 rounded-full">
          {unreadCount} new
        </span>
      )}
    </div>

    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-400 font-bold">No notifications yet</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-[#E5E7EB] rounded-2xl px-6 py-5 flex items-start justify-between gap-4 ${!n.read ? 'border-l-4 border-[#003B95]' : ''}`}
          >
            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {TYPE_ICON[n.type] ?? <Bell size={16} className="text-gray-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-snug">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Badge + mark read */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {!n.read
                ? <span className="text-xs font-bold text-[#C10000] bg-red-50 px-2 py-0.5 rounded-full">New</span>
                : <span className="text-xs text-gray-400">Seen</span>}
              {!n.read && (
                <button
                  onClick={() => dispatch(markResearcherNotificationRead(n.id))}
                  className="text-xs font-semibold text-gray-600 bg-white px-3 py-1 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
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
