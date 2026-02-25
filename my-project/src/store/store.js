import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    auth: authReducer,
  },
});

export default store;
