import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import authReducer from '../features/auth/authSlice';
import reviewersReducer from '../features/reviewers/reviewersSlice';
import { saveUser, clearUser } from '../features/auth/authStorage';

// ── localStorage helpers for full-state persistence ──────────────────────────
const ASSIGNMENTS_KEY = 'buhrec_assignments';
const REVIEWERS_KEY = 'buhrec_reviewers';

const loadState = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};
const persistState = (key, state) => {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
};

const persistedAssignments = loadState(ASSIGNMENTS_KEY);
const persistedReviewers = loadState(REVIEWERS_KEY);

const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    auth: authReducer,
    reviewers: reviewersReducer,
  },
  preloadedState: {
    ...(persistedAssignments && { assignments: persistedAssignments }),
    ...(persistedReviewers && { reviewers: persistedReviewers }),
  },
});

// Sync auth.user to localStorage in one place
let currentUser = store.getState().auth.user;
let prevAssignments = store.getState().assignments;
let prevReviewers = store.getState().reviewers;

store.subscribe(() => {
  const state = store.getState();

  // Auth persistence (existing)
  const nextUser = state.auth.user;
  if (nextUser !== currentUser) {
    currentUser = nextUser;
    if (nextUser) { saveUser(nextUser); } else { clearUser(); }
  }

  // Assignments persistence
  if (state.assignments !== prevAssignments) {
    prevAssignments = state.assignments;
    persistState(ASSIGNMENTS_KEY, state.assignments);
  }

  // Reviewers persistence
  if (state.reviewers !== prevReviewers) {
    prevReviewers = state.reviewers;
    persistState(REVIEWERS_KEY, state.reviewers);
  }
});

export default store;

