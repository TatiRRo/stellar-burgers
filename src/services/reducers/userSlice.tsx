import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type UserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updateError: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null
};

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Не удалось загрузить пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TUser & { password?: string }>,
  { rejectValue: string }
>('user/updateUser', async (userData, thunkAPI) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Не удалось обновить данные пользователя'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.updateStatus = 'idle';
      state.error = null;
      state.updateError = null;
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
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Неизвестная ошибка';
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
