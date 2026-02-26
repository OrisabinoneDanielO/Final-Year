import { createSlice } from '@reduxjs/toolkit';
import { loadUser } from './authStorage';

const storedUser = loadUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
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
        state.user = { ...state.user, isVerified: true };
      }
    },
  },
});

export const { login, logout, verifyEmail } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;


export default authSlice.reducer;
