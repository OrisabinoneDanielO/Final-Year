import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentService from '../../services/paymentService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (params, { rejectWithValue, getState }) => {
    try {
      const role = getState().auth.user?.role;
      const response = await paymentService.getPayments(params, role);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'payments/initiate',
  async ({ proposalId, data }, { rejectWithValue }) => {
    try {
      const response = await paymentService.initiatePayment(proposalId, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await paymentService.verifyPayment(reference);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearPaymentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearPaymentsError } = paymentsSlice.actions;

export const selectPayments = (state) => state.payments.items;
export const selectPaymentsStatus = (state) => state.payments.status;
export const selectPaymentsError = (state) => state.payments.error;

export default paymentsSlice.reducer;
