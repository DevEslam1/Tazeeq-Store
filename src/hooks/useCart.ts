import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartItemCount,
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  selectCartItemById 
} from '../store/slices/cartSlice';
import { RootState, AppDispatch } from '../store';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const itemMap = useMemo(
    () => new Map(items.map((item) => [item.productId, item])),
    [items]
  );

  const addToCart = (productId: string, quantity: number = 1) => {
    dispatch(addItem({ productId, quantity }));
  };

  const removeFromCart = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const updateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const clear = () => {
    dispatch(clearCart());
  };

  const getItem = (productId: string) => 
    itemMap.get(productId);

  return {
    items,
    itemMap,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQty,
    clear,
    getItem,
  };
}
