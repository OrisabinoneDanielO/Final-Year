import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as commentService from '../../services/commentService';

// ── Async thunks ─────────────────────────────────────────────────────────────

export const fetchComments = createAsyncThunk(
  'comments/fetchAll',
  async (id, { rejectWithValue, getState }) => {
    try {
      const role = getState().auth.user?.role;
      const response = await commentService.getComments(id, role, null, id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ assignmentId, text, section }, { rejectWithValue }) => {
    try {
      const response = await commentService.addComment(assignmentId, { text, section });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editComment = createAsyncThunk(
  'comments/edit',
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const response = await commentService.editComment(commentId, { text });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCommentsError } = commentsSlice.actions;

export const selectComments = (state) => state.comments.items;
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
