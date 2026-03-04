import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as researcherService from '../../services/researcherService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchResearchers = createAsyncThunk(
  'researchers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await researcherService.getResearchers(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchResearcherById = createAsyncThunk(
  'researchers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await researcherService.getResearcherById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const researchersSlice = createSlice({
  name: 'researchers',
  initialState: {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearResearchersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResearchers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResearchers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchResearchers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchResearcherById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      });
  },
});

export const { clearResearchersError } = researchersSlice.actions;

export const selectResearchers = (state) => state.researchers.items;
export const selectResearchersStatus = (state) => state.researchers.status;

export default researchersSlice.reducer;
