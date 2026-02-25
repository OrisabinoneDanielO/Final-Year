import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
};




const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));  // Correctly store user object
      console.log("Login action:", action.payload, "New state:", state); // Debugging
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    verifyEmail: (state) => {
      if (state.user) {
        state.user = { ...state.user, isVerified: true };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, verifyEmail } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;


export default authSlice.reducer;
