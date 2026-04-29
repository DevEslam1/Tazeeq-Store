import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types/app';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.activeOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.activeOrder?.id === action.payload.orderId) {
        state.activeOrder.status = action.payload.status;
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
      if (state.activeOrder?.id === action.payload) {
        state.activeOrder = null;
      }
    },
    setActiveOrder: (state, action: PayloadAction<Order | null>) => {
      state.activeOrder = action.payload;
    },
  },
});

export const { placeOrder, updateOrderStatus, cancelOrder, setActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const selectAllOrders = (state: { orders: OrderState }) => state.orders.orders;
export const selectActiveOrder = (state: { orders: OrderState }) => state.orders.activeOrder;
export const selectOrderById = (state: { orders: OrderState }, orderId: string) => 
  state.orders.orders.find(o => o.id === orderId);