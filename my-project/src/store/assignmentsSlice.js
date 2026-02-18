import { createSlice } from '@reduxjs/toolkit'

// Initial data copied from AssignmentsContext
const INITIAL_DATA = [
  { id: 1, applicationCode: 'BUH-0001', title: 'The impact of sleep deprivation on academic performance', status: 'Unaccepted', date: '2025-10-24' },
  { id: 6, applicationCode: 'BUH-0006', title: 'Knowledge and attitudes toward mental health disorders', status: 'Unaccepted', date: '2025-10-22' },
  { id: 9, applicationCode: 'BUH-0009', title: 'Digital media usage and attention span in teenagers', status: 'Unaccepted', date: '2025-10-20' },
  { id: 10, applicationCode: 'BUH-0010', title: 'Nutritional habits and obesity among secondary school students', status: 'Unaccepted', date: '2025-10-18' },
  { id: 2, applicationCode: 'BUH-0002', title: 'Knowledge and attitudes toward mental health disorders', status: 'Not Reviewed', date: '2025-10-17' },
  { id: 5, applicationCode: 'BUH-0005', title: 'Sleep quality and exam performance in undergraduates', status: 'Not Reviewed', date: '2025-10-16' },
  { id: 11, applicationCode: 'BUH-0011', title: 'Perception of online learning among final year students', status: 'Not Reviewed', date: '2025-10-15' },
  { id: 12, applicationCode: 'BUH-0012', title: 'Social support and academic resilience in first-year students', status: 'Not Reviewed', date: '2025-10-14' },
  { id: 3, applicationCode: 'BUH-0003', title: 'Physical exercise and stress management', status: 'Ongoing', hasChanges: true, date: '2025-10-13' },
  { id: 7, applicationCode: 'BUH-0007', title: 'Time management skills and academic achievement', status: 'Ongoing', date: '2025-10-12' },
  { id: 13, applicationCode: 'BUH-0013', title: 'The role of sleep hygiene education on student wellbeing', status: 'Ongoing', hasChanges: true, date: '2025-10-11' },
  { id: 14, applicationCode: 'BUH-0014', title: 'Impact of part-time work on academic success', status: 'Ongoing', date: '2025-10-10' },
  { id: 4, applicationCode: 'BUH-0004', title: 'Sleep patterns in professional athletes', status: 'Completed', reviewResult: 'accepted', date: '2025-10-09' },
  { id: 8, applicationCode: 'BUH-0008', title: 'Effects of mindfulness meditation on test anxiety', status: 'Completed', reviewResult: 'rejected', date: '2025-10-08' },
  { id: 15, applicationCode: 'BUH-0015', title: 'Bullying experiences and mental health outcomes', status: 'Completed', reviewResult: 'accepted', date: '2025-10-07' },
  { id: 16, applicationCode: 'BUH-0016', title: 'Use of mobile phones during lectures and comprehension', status: 'Completed', reviewResult: 'rejected', date: '2025-10-06' },
]

const initialState = {
  items: INITIAL_DATA,
  status: 'idle',
  notifications: INITIAL_DATA.filter(a => a.hasChanges).map(a => ({
    id: `notif-${a.id}`,
    assignmentId: a.id,
    title: `Researcher has made changes to ${a.title}`,
    date: a.date || new Date().toISOString(),
    read: false,
  })),
  comments: [
    { id: 1, assignmentId: 3, text: 'Please clarify sampling section', date: '2026-01-18' },
    { id: 2, assignmentId: 3, text: 'Add ethics approval details', date: '2026-01-19' },
  ],
}

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments(state, action) {
      state.items = action.payload
    },
    addAssignment(state, action) {
      state.items.push(action.payload)
    },
    updateAssignment(state, action) {
      const idx = state.items.findIndex(a => a.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    removeAssignment(state, action) {
      state.items = state.items.filter(a => a.id !== action.payload)
    },

    // Dashboard actions
    acceptFromDashboard(state, action) {
      const id = action.payload
      const idx = state.items.findIndex(a => a.id === id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], status: 'Not Reviewed', reviewResult: undefined }
      }
    },
    declineFromDashboard(state, action) {
      const id = action.payload
      const idx = state.items.findIndex(a => a.id === id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], status: 'Completed', reviewResult: 'rejected' }
      }
    },

    // Review lifecycle
    beginReview(state, action) {
      const id = action.payload
      const idx = state.items.findIndex(a => a.id === id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], status: 'Ongoing' }
    },
    completeReview(state, action) {
      const { id, accepted } = action.payload
      const idx = state.items.findIndex(a => a.id === id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], status: 'Completed', reviewResult: accepted ? 'accepted' : 'rejected' }
    },

    // Notifications
    addNotification(state, action) {
      const n = action.payload
      state.notifications.unshift(n)
    },
    markNotificationRead(state, action) {
      const id = action.payload
      state.notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    },
    markAllNotificationsRead(state) {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }))
    },

    notifyAssignmentChange(state, action) {
      const id = action.payload
      const a = state.items.find(x => x.id === id)
      if (a) {
        const idx = state.items.findIndex(x => x.id === id)
        if (idx !== -1) state.items[idx] = { ...state.items[idx], hasChanges: true }
        const newNotif = { id: `notif-${Date.now()}`, assignmentId: id, title: `Researcher has made changes to ${a.title}`, date: new Date().toISOString(), read: false }
        state.notifications.unshift(newNotif)
      }
    },

    // Comments
    addComment(state, action) {
      const { assignmentId, text } = action.payload
      const id = Date.now()
      state.comments.unshift({ id, assignmentId, text, date: new Date().toISOString() })
    },
    editComment(state, action) {
      const { commentId, newText } = action.payload
      state.comments = state.comments.map(c => c.id === commentId ? { ...c, text: newText, editedAt: new Date().toISOString() } : c)
    },
    deleteComment(state, action) {
      const id = action.payload
      state.comments = state.comments.filter(c => c.id !== id)
    }
  },
})

export const {
  setAssignments,
  addAssignment,
  updateAssignment,
  removeAssignment,
  acceptFromDashboard,
  declineFromDashboard,
  beginReview,
  completeReview,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  notifyAssignmentChange,
  addComment,
  editComment,
  deleteComment,
} = assignmentsSlice.actions

export default assignmentsSlice.reducer
