import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { loadUser } from './authStorage';

const storedUser = loadUser();

// ── Async thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, role);
      const { token, user } = response.data;
      localStorage.setItem('buhrec_token', token);
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      const { token, user } = response.data;
      localStorage.setItem('buhrec_token', token);
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(email);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to change password');
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('buhrec_token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        if (state.user) {
          state.user.isVerified = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchProfile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
