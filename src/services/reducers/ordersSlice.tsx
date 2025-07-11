import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, getFeedsApi } from '../../utils/burger-api';

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data.orders;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при загрузке заказов');
  }
});

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке заказов');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<TOrder>) {
      state.orders.unshift(action.payload);
    },
    clearOrder(state) {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addOrder, clearOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
