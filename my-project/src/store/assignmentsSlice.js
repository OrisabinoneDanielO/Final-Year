import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  status: 'idle',
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
      if (idx !== -1) state.items[idx] = action.payload
    },
    removeAssignment(state, action) {
      state.items = state.items.filter(a => a.id !== action.payload)
    },
  },
})

export const { setAssignments, addAssignment, updateAssignment, removeAssignment } = assignmentsSlice.actions
export default assignmentsSlice.reducer
