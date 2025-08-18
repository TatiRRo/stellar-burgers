import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  hasError: false
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.hasError = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { setIngredients, setLoading, setError } =
  ingredientsSlice.actions;

export const ingredientsReducer = ingredientsSlice.reducer;
