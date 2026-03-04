import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewerService from '../../services/reviewerService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchReviewers = createAsyncThunk(
  'reviewers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await reviewerService.getReviewers(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchReviewerById = createAsyncThunk(
  'reviewers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewerService.getReviewerById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addReviewer = createAsyncThunk(
  'reviewers/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reviewerService.addReviewer(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateReviewer = createAsyncThunk(
  'reviewers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await reviewerService.updateReviewer(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeReviewer = createAsyncThunk(
  'reviewers/remove',
  async (id, { rejectWithValue }) => {
    try {
      await reviewerService.removeReviewer(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const reviewersSlice = createSlice({
  name: 'reviewers',
  initialState: {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearReviewersError: (state) => {
      state.error = null;
    },
    clearCurrentReviewer: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReviewers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReviewers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchReviewerById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      .addCase(addReviewer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateReviewer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(removeReviewer.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearReviewersError, clearCurrentReviewer } = reviewersSlice.actions;

export const selectReviewers = (state) => state.reviewers.items;
export const selectCurrentReviewer = (state) => state.reviewers.currentItem;
export const selectReviewersStatus = (state) => state.reviewers.status;
export const selectReviewersError = (state) => state.reviewers.error;

export default reviewersSlice.reducer;
