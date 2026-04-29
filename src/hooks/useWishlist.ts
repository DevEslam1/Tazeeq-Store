import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsWishlisted, 
  selectWishlistItems,
  toggleWishlistItem, 
  clearWishlist 
} from '../store/slices/wishlistSlice';
import { RootState, AppDispatch } from '../store';
import { products } from '../data/products';

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector(selectWishlistItems);

  const isWishlisted = (productId: string) => 
    useSelector((state: RootState) => selectIsWishlisted(state, productId));

  const toggle = (productId: string) => {
    dispatch(toggleWishlistItem(productId));
  };

  const clear = () => {
    dispatch(clearWishlist());
  };

  const getWishlistProducts = () => 
    products.filter(p => wishlistItems.includes(p.id));

  return {
    isWishlisted,
    toggle,
    items: wishlistItems,
    getWishlistProducts,
    clear,
  };
}