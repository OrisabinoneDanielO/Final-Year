import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewService from '../../services/reviewService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchReviews = createAsyncThunk(
  'reviews/fetchAll',
  async (params, { rejectWithValue, getState }) => {
    try {
      const role = getState().auth.user?.role;
      const response = await reviewService.getAssignments(params, role);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  'reviews/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewService.getAssignmentById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const acceptAssignment = createAsyncThunk(
  'reviews/accept',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewService.acceptAssignment(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const declineAssignment = createAsyncThunk(
  'reviews/decline',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewService.declineAssignment(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const beginReview = createAsyncThunk(
  'reviews/begin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewService.beginReview(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const completeReview = createAsyncThunk(
  'reviews/complete',
  async ({ id, result, notes }, { rejectWithValue }) => {
    try {
      const response = await reviewService.completeReview(id, { result, notes });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentReview: (state) => {
      state.currentItem = null;
    },
    clearReviewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchReviewById
      .addCase(fetchReviewById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentItem = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // acceptAssignment
      .addCase(acceptAssignment.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // declineAssignment
      .addCase(declineAssignment.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // beginReview
      .addCase(beginReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // completeReview
      .addCase(completeReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearCurrentReview, clearReviewsError } = reviewsSlice.actions;

export const selectReviews = (state) => state.reviews.items;
export const selectCurrentReview = (state) => state.reviews.currentItem;
export const selectReviewsStatus = (state) => state.reviews.status;
export const selectReviewsError = (state) => state.reviews.error;

export default reviewsSlice.reducer;
