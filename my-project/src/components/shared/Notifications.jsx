import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { markNotificationRead, markAllNotificationsRead } from '../../features/assignments/assignmentsSlice'

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const notifications = useSelector(s => s.assignments.notifications)

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <header className="bg-white px-4 sm:px-6 py-6 border-b border-gray-200 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold">Your Notifications</h1>
          <p className="text-gray-500 text-sm">The following proposals have changes effected by the researchers</p>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">You have <span className="font-bold">{unreadCount}</span> unread notifications</div>
            <div className="flex gap-2">
              <button onClick={() => dispatch(markAllNotificationsRead())} className="text-sm text-gray-700 bg-white px-3 py-2 rounded shadow">Mark all as read</button>
            </div>
          </div>

          {notifications.length === 0 && (
            <div className="text-center text-gray-500 p-10 bg-white rounded">No notifications</div>
          )}

          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-6 rounded shadow flex justify-between items-start">
              <div>
                <button onClick={() => { dispatch(markNotificationRead(n.id)); navigate(`/dashboard/review-details/${n.assignmentId}`); }} className="text-left text-blue-700 font-semibold hover:underline">
                  {n.title}
                </button>
                <div className="text-xs text-gray-400 mt-2">{new Date(n.date).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.read ? <span className="text-xs font-bold text-[#C10000]">New</span> : <span className="text-xs text-gray-400">Seen</span>}
                <button onClick={() => dispatch(markNotificationRead(n.id))} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">Mark read</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
