import { createSlice } from '@reduxjs/toolkit';
import { loadUser } from './authStorage';

const storedUser = loadUser();

// Load registered researchers from localStorage
const loadRegisteredResearchers = () => {
  try {
    const raw = localStorage.getItem('buhrec_researchers_auth');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  // Stores { email, password, name } for researcher accounts created via sign-up
  registeredResearchers: loadRegisteredResearchers(),
  // Admin credentials (demo)
  adminCredentials: [
    { email: 'admin@babcock.edu.ng', password: 'admin123' },
    { email: 'buhrec@babcock.edu.ng', password: 'admin123' },
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    verifyEmail: (state) => {
      if (state.user) {
        // Update current session
        state.user = { ...state.user, isVerified: true };

        // Persist verified status if they are a researcher
        if (state.user.role === 'researcher') {
          const idx = state.registeredResearchers.findIndex(
            (r) => r.email.toLowerCase() === state.user.email.toLowerCase()
          );
          if (idx !== -1) {
            state.registeredResearchers[idx].isVerified = true;
          }
        }
      }
    },
    registerResearcher: (state, action) => {
      const { email, password, name } = action.payload;
      // Prevent duplicates
      if (!state.registeredResearchers.find((r) => r.email.toLowerCase() === email.toLowerCase())) {
        state.registeredResearchers.push({ email, password, name });
      }
    },
    updateRegisteredResearcher: (state, action) => {
      const { email, ...updates } = action.payload;
      const idx = state.registeredResearchers.findIndex(
        (r) => r.email.toLowerCase() === email.toLowerCase()
      );
      if (idx !== -1) {
        state.registeredResearchers[idx] = { ...state.registeredResearchers[idx], ...updates };
      }
    },
  },
});

export const { login, logout, verifyEmail, registerResearcher, updateRegisteredResearcher } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;


export default authSlice.reducer;
