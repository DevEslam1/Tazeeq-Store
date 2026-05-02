import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types/app';
import { OrderRepository } from '../../services/orderService';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
};

export const createNewOrder = createAsyncThunk(
  'orders/create',
  async ({ userId, order }: { userId: string; order: Omit<Order, 'id'> }) => {
    const id = await OrderRepository.create(userId, order);
    return { id, ...order } as Order;
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (userId: string) => {
    return await OrderRepository.getAll(userId);
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setActiveOrder: (state, action: PayloadAction<Order | null>) => {
      state.activeOrder = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.activeOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.activeOrder = action.payload;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { setActiveOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;

export const selectAllOrders = (state: { orders: OrderState }) => state.orders.orders;
export const selectActiveOrder = (state: { orders: OrderState }) => state.orders.activeOrder;
export const selectOrderLoading = (state: { orders: OrderState }) => state.orders.loading;
export const selectOrderById = (state: { orders: OrderState }, orderId: string) => 
  state.orders.orders.find(o => o.id === orderId);