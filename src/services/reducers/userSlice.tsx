import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type UserState = {
  user: TUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null
};

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch user');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.user = null;
      });
  }
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
