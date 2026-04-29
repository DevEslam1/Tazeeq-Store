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
    useSelector((state: RootState) => selectCartItemById(state, productId));

  return {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQty,
    clear,
    getItem,
  };
}