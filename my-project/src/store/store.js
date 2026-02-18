import { configureStore } from '@reduxjs/toolkit'
import assignmentsReducer from './assignmentsSlice'

const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
})

export default store
