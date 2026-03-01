import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as proposalService from '../../services/proposalService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchProposals = createAsyncThunk(
  'proposals/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await proposalService.getProposals(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProposalById = createAsyncThunk(
  'proposals/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalService.getProposalById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createProposal = createAsyncThunk(
  'proposals/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalService.createProposal(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProposal = createAsyncThunk(
  'proposals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await proposalService.updateProposal(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const submitProposal = createAsyncThunk(
  'proposals/submit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalService.submitProposal(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const resubmitProposal = createAsyncThunk(
  'proposals/resubmit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await proposalService.resubmitProposal(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const assignReviewer = createAsyncThunk(
  'proposals/assignReviewer',
  async ({ proposalId, reviewerId }, { rejectWithValue }) => {
    try {
      const response = await proposalService.assignReviewer(proposalId, reviewerId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unassignReviewer = createAsyncThunk(
  'proposals/unassignReviewer',
  async (proposalId, { rejectWithValue }) => {
    try {
      const response = await proposalService.unassignReviewer(proposalId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const proposalsSlice = createSlice({
  name: 'proposals',
  initialState: {
    items: [],
    currentItem: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearCurrentProposal: (state) => {
      state.currentItem = null;
    },
    clearProposalsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProposals
      .addCase(fetchProposals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchProposalById
      .addCase(fetchProposalById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentItem = action.payload;
      })
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // createProposal
      .addCase(createProposal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateProposal
      .addCase(updateProposal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      // submitProposal
      .addCase(submitProposal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // resubmitProposal
      .addCase(resubmitProposal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // assignReviewer
      .addCase(assignReviewer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // unassignReviewer
      .addCase(unassignReviewer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearCurrentProposal, clearProposalsError } = proposalsSlice.actions;

export const selectProposals = (state) => state.proposals.items;
export const selectCurrentProposal = (state) => state.proposals.currentItem;
export const selectProposalsStatus = (state) => state.proposals.status;
export const selectProposalsError = (state) => state.proposals.error;

export default proposalsSlice.reducer;
