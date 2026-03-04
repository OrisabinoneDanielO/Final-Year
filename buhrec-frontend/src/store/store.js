import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import proposalsReducer from '../features/proposals/proposalsSlice';
import reviewersReducer from '../features/reviewers/reviewersSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import researchersReducer from '../features/researchers/researchersSlice';
import { saveUser, clearUser } from '../features/auth/authStorage';

const store = configureStore({
  reducer: {
    auth: authReducer,
    proposals: proposalsReducer,
    reviewers: reviewersReducer,
    reviews: reviewsReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    payments: paymentsReducer,
    researchers: researchersReducer,
  },
});

// Sync auth.user to localStorage for page refresh persistence
let currentUser = store.getState().auth.user;

store.subscribe(() => {
  const state = store.getState();

  const nextUser = state.auth.user;
  if (nextUser !== currentUser) {
    currentUser = nextUser;
    if (nextUser) { saveUser(nextUser); } else { clearUser(); }
  }
});

export default store;

