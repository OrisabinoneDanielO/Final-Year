import { createSlice } from '@reduxjs/toolkit'

// Initial data copied from AssignmentsContext
const INITIAL_DATA = [
  { id: 1, applicationCode: 'BUH-0001', title: 'The impact of sleep deprivation on academic performance', status: 'Unaccepted', reviewerId: null, date: '2025-10-24' },
  { id: 6, applicationCode: 'BUH-0006', title: 'Knowledge and attitudes toward mental health disorders', status: 'Unaccepted', reviewerId: null, date: '2025-10-22' },
  { id: 9, applicationCode: 'BUH-0009', title: 'Digital media usage and attention span in teenagers', status: 'Unaccepted', reviewerId: null, date: '2025-10-20' },
  { id: 10, applicationCode: 'BUH-0010', title: 'Nutritional habits and obesity among secondary school students', status: 'Unaccepted', reviewerId: null, date: '2025-10-18' },
  { id: 2, applicationCode: 'BUH-0002', title: 'Knowledge and attitudes toward mental health disorders', status: 'Not Reviewed', reviewerId: 1, date: '2025-10-17' },
  { id: 5, applicationCode: 'BUH-0005', title: 'Sleep quality and exam performance in undergraduates', status: 'Not Reviewed', reviewerId: 2, date: '2025-10-16' },
  { id: 11, applicationCode: 'BUH-0011', title: 'Perception of online learning among final year students', status: 'Not Reviewed', reviewerId: 3, date: '2025-10-15' },
  { id: 12, applicationCode: 'BUH-0012', title: 'Social support and academic resilience in first-year students', status: 'Not Reviewed', reviewerId: 4, date: '2025-10-14' },
  { id: 3, applicationCode: 'BUH-0003', title: 'Physical exercise and stress management', status: 'Ongoing', reviewerId: 1, hasChanges: true, date: '2025-10-13' },
  { id: 7, applicationCode: 'BUH-0007', title: 'Time management skills and academic achievement', status: 'Ongoing', reviewerId: 2, date: '2025-10-12' },
  { id: 13, applicationCode: 'BUH-0013', title: 'The role of sleep hygiene education on student wellbeing', status: 'Ongoing', reviewerId: 3, hasChanges: true, date: '2025-10-11' },
  { id: 14, applicationCode: 'BUH-0014', title: 'Impact of part-time work on academic success', status: 'Ongoing', reviewerId: 4, date: '2025-10-10' },
  { id: 4, applicationCode: 'BUH-0004', title: 'Sleep patterns in professional athletes', status: 'Completed', reviewerId: 1, reviewResult: 'accepted', date: '2025-10-09' },
  { id: 8, applicationCode: 'BUH-0008', title: 'Effects of mindfulness meditation on test anxiety', status: 'Completed', reviewerId: 2, reviewResult: 'rejected', date: '2025-10-08' },
  { id: 15, applicationCode: 'BUH-0015', title: 'Bullying experiences and mental health outcomes', status: 'Completed', reviewerId: 1, reviewResult: 'accepted', date: '2025-10-07' },
  { id: 16, applicationCode: 'BUH-0016', title: 'Use of mobile phones during lectures and comprehension', status: 'Completed', reviewerId: 3, reviewResult: 'rejected', date: '2025-10-06' },
]

const initialState = {
  items: INITIAL_DATA,
  status: 'idle',
  notifications: [
    {
      id: 'notif-3',
      assignmentId: 3,
      title: 'Physical exercise and stress management — researcher has submitted revisions',
      date: '2026-02-25',
      read: false,
    },
    {
      id: 'notif-13',
      assignmentId: 13,
      title: 'Sleep hygiene education proposal — researcher has effected requested changes',
      date: '2026-02-23',
      read: false,
    },
    {
      id: 'notif-2',
      assignmentId: 2,
      title: 'Mental health disorders study — new proposal assigned for review',
      date: '2026-02-20',
      read: true,
    },
    {
      id: 'notif-5',
      assignmentId: 5,
      title: 'Sleep quality and exam performance — review is now in progress',
      date: '2026-02-18',
      read: true,
    },
  ],
  comments: [
    { id: 1, assignmentId: 3, text: 'Please clarify sampling section', section: 'Chapter 3', date: '2026-01-18' },
    { id: 2, assignmentId: 3, text: 'Add ethics approval details', section: 'Chapter 3', date: '2026-01-19' },
  ],
  researcherNotifications: [
    { id: 'rn-1', type: 'comment', title: 'New comment on your proposal', body: 'Prof. Imisioluwa Hannah left a comment on "Physical exercise and stress management"', date: '2026-02-25', read: false, assignmentId: 3 },
    { id: 'rn-2', type: 'revision', title: 'Revisions requested', body: 'Your proposal "Physical exercise and stress management" requires revisions before it can proceed', date: '2026-02-24', read: false, assignmentId: 3 },
    { id: 'rn-3', type: 'approved', title: 'Proposal approved', body: 'Your proposal "Sleep patterns in professional athletes" has been approved by the reviewer', date: '2026-02-20', read: true, assignmentId: 4 },
    { id: 'rn-4', type: 'rejected', title: 'Proposal rejected', body: 'Your proposal "Effects of mindfulness meditation" was not approved. Check the reviewer\u2019s comment for details', date: '2026-02-18', read: true, assignmentId: 8 },
    { id: 'rn-5', type: 'payment', title: 'Payment confirmed', body: 'Your payment of N7,000 for application BUH-0004 was received successfully', date: '2026-02-15', read: true, assignmentId: 4 },
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

    // Assign / unassign a reviewer to a proposal
    assignReviewer(state, action) {
      const { assignmentId, reviewerId } = action.payload
      const idx = state.items.findIndex(a => a.id === assignmentId)
      if (idx !== -1) {
        state.items[idx].reviewerId = reviewerId
        // Move to Not Reviewed if it was Unaccepted
        if (state.items[idx].status === 'Unaccepted') {
          state.items[idx].status = 'Not Reviewed'
        }
      }
    },
    unassignReviewer(state, action) {
      const idx = state.items.findIndex(a => a.id === action.payload)
      if (idx !== -1) {
        state.items[idx].reviewerId = null
        // Revert to Unaccepted so admin can reassign
        if (state.items[idx].status === 'Not Reviewed') {
          state.items[idx].status = 'Unaccepted'
        }
      }
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
      const { assignmentId, text, section } = action.payload
      const id = Date.now()
      state.comments.unshift({ id, assignmentId, text, section, date: new Date().toISOString() })
    },
    editComment(state, action) {
      const { commentId, newText } = action.payload
      state.comments = state.comments.map(c => c.id === commentId ? { ...c, text: newText, editedAt: new Date().toISOString() } : c)
    },
    deleteComment(state, action) {
      const id = action.payload
      state.comments = state.comments.filter(c => c.id !== id)
    },

    // Save proposal draft (researcher)
    saveDraft(state, action) {
      const { id: existingId, title, researcherNames, institution, college, department, category, supervisor, supervisorEmail, turnItInReport } = action.payload
      const newId = existingId || Date.now()
      const existing = state.items.findIndex(a => a.id === existingId)
      const draftEntry = {
        id: newId,
        applicationCode: `BUH-DRAFT-${newId}`,
        title: title || 'Untitled Draft',
        status: 'Unaccepted',
        date: new Date().toISOString().split('T')[0],
        // store rich form data for continuation
        draftData: { researcherNames, institution, college, department, category, supervisor, supervisorEmail, turnItInReport },
      }
      if (existing !== -1) {
        state.items[existing] = { ...state.items[existing], ...draftEntry }
      } else {
        state.items.push(draftEntry)
      }
    },

    // Researcher notification actions
    markResearcherNotificationRead(state, action) {
      const n = state.researcherNotifications.find(n => n.id === action.payload)
      if (n) n.read = true
    },
    addResearcherNotification(state, action) {
      state.researcherNotifications.unshift(action.payload)
    },
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
  saveDraft,
  markResearcherNotificationRead,
  addResearcherNotification,
  assignReviewer,
  unassignReviewer,
} = assignmentsSlice.actions

export default assignmentsSlice.reducer
