import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import addressReducer from './slices/addressSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    address: addressReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
