import React, { createContext, useMemo, useState } from 'react';

const AssignmentsContext = createContext(null);

const INITIAL_DATA = [
  // Unaccepted
  { id: 1, applicationCode: 'BUH-0001', title: 'The impact of sleep deprivation on academic performance', status: 'Unaccepted', date: '2025-10-24' },
  { id: 6, applicationCode: 'BUH-0006', title: 'Knowledge and attitudes toward mental health disorders', status: 'Unaccepted', date: '2025-10-22' },
  { id: 9, applicationCode: 'BUH-0009', title: 'Digital media usage and attention span in teenagers', status: 'Unaccepted', date: '2025-10-20' },
  { id: 10, applicationCode: 'BUH-0010', title: 'Nutritional habits and obesity among secondary school students', status: 'Unaccepted', date: '2025-10-18' },

  // Not Reviewed
  { id: 2, applicationCode: 'BUH-0002', title: 'Knowledge and attitudes toward mental health disorders', status: 'Not Reviewed', date: '2025-10-17' },
  { id: 5, applicationCode: 'BUH-0005', title: 'Sleep quality and exam performance in undergraduates', status: 'Not Reviewed', date: '2025-10-16' },
  { id: 11, applicationCode: 'BUH-0011', title: 'Perception of online learning among final year students', status: 'Not Reviewed', date: '2025-10-15' },
  { id: 12, applicationCode: 'BUH-0012', title: 'Social support and academic resilience in first-year students', status: 'Not Reviewed', date: '2025-10-14' },

  // Ongoing
  { id: 3, applicationCode: 'BUH-0003', title: 'Physical exercise and stress management', status: 'Ongoing', hasChanges: true, date: '2025-10-13' },
  { id: 7, applicationCode: 'BUH-0007', title: 'Time management skills and academic achievement', status: 'Ongoing', date: '2025-10-12' },
  { id: 13, applicationCode: 'BUH-0013', title: 'The role of sleep hygiene education on student wellbeing', status: 'Ongoing', hasChanges: true, date: '2025-10-11' },
  { id: 14, applicationCode: 'BUH-0014', title: 'Impact of part-time work on academic success', status: 'Ongoing', date: '2025-10-10' },

  // Completed
  { id: 4, applicationCode: 'BUH-0004', title: 'Sleep patterns in professional athletes', status: 'Completed', reviewResult: 'accepted', date: '2025-10-09' },
  { id: 8, applicationCode: 'BUH-0008', title: 'Effects of mindfulness meditation on test anxiety', status: 'Completed', reviewResult: 'rejected', date: '2025-10-08' },
  { id: 15, applicationCode: 'BUH-0015', title: 'Bullying experiences and mental health outcomes', status: 'Completed', reviewResult: 'accepted', date: '2025-10-07' },
  { id: 16, applicationCode: 'BUH-0016', title: 'Use of mobile phones during lectures and comprehension', status: 'Completed', reviewResult: 'rejected', date: '2025-10-06' },
];

export const AssignmentsProvider = ({ children }) => {
  const [assignments, setAssignments] = useState(INITIAL_DATA);
  const [notifications, setNotifications] = useState(() => {
    // Initialize notifications for assignments that have changes
    return INITIAL_DATA.filter(a => a.hasChanges).map(a => ({
      id: `notif-${a.id}`,
      assignmentId: a.id,
      title: `Researcher has made changes to ${a.title}`,
      date: a.date || new Date().toISOString(),
      read: false,
    }));
  });

  const addNotification = (assignmentId, title) => {
    const id = `notif-${Date.now()}`;
    setNotifications((prev) => [{ id, assignmentId, title, date: new Date().toISOString(), read: false }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const updateAssignment = (id, updates) => {
    setAssignments((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  // Dashboard actions
  const acceptFromDashboard = (id) => {
    // New review accepted -> Not Reviewed queue
    updateAssignment(id, { status: 'Not Reviewed', reviewResult: undefined });
  };

  const declineFromDashboard = (id) => {
    // New review declined immediately -> Completed (rejected)
    updateAssignment(id, { status: 'Completed', reviewResult: 'rejected' });
  };

  // Assignments page actions
  const beginReview = (id) => {
    updateAssignment(id, { status: 'Ongoing' });
  };

  const completeReview = (id, accepted = true) => {
    updateAssignment(id, {
      status: 'Completed',
      reviewResult: accepted ? 'accepted' : 'rejected',
    });
  };

  // When a researcher sends changes for an assignment, call this to flag notification + update assignment
  const notifyAssignmentChange = (id) => {
    const a = assignments.find(x => x.id === id);
    if (a) {
      updateAssignment(id, { hasChanges: true });
      addNotification(id, `Researcher has made changes to ${a.title}`);
    }
  };

  // Comments state (simple in-memory store for UI)
  const [comments, setComments] = useState([
    { id: 1, assignmentId: 3, text: 'Please clarify sampling section', date: '2026-01-18' },
    { id: 2, assignmentId: 3, text: 'Add ethics approval details', date: '2026-01-19' },
  ]);

  const addComment = (assignmentId, text) => {
    const id = Date.now();
    setComments(prev => [{ id, assignmentId, text, date: new Date().toISOString() }, ...prev]);
  };

  const editComment = (commentId, newText) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: newText, editedAt: new Date().toISOString() } : c));
  };

  const deleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const stats = useMemo(() => {
    const accepted = assignments.filter((a) => a.status === 'Completed' && a.reviewResult === 'accepted').length;
    const completed = assignments.filter((a) => a.status === 'Completed').length;
    const incomplete = assignments.filter((a) => a.status !== 'Completed').length;
    const feedback = completed; // simple proxy
    return { accepted, completed, incomplete, feedback };
  }, [assignments]);

  const value = {
    assignments,
    stats,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    notifyAssignmentChange,
    comments,
    addComment,
    editComment,
    deleteComment,
    acceptFromDashboard,
    declineFromDashboard,
    beginReview,
    completeReview,
    setAssignments, // expose if needed later
  };

  return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
};

// This context is deprecated - use Redux store instead
// Kept for reference and backward compatibility

