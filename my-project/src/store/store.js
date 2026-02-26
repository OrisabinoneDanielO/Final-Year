import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import authReducer from '../features/auth/authSlice';
import reviewersReducer from '../features/reviewers/reviewersSlice';
import { saveUser, clearUser } from '../features/auth/authStorage';

const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    auth: authReducer,
    reviewers: reviewersReducer,
  },
});

// Sync auth.user to localStorage in one place
let currentUser = store.getState().auth.user;
store.subscribe(() => {
  const nextUser = store.getState().auth.user;
  if (nextUser === currentUser) return;
  currentUser = nextUser;

  if (nextUser) {
    saveUser(nextUser);
  } else {
    clearUser();
  }
});

export default store;

