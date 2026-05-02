import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectWishlistItems,
  toggleWishlistItem, 
  clearWishlist 
} from '../store/slices/wishlistSlice';
import { AppDispatch } from '../store';
import { products } from '../data/products';

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistSet = useMemo(() => new Set(wishlistItems), [wishlistItems]);

  const isWishlisted = (productId: string) => 
    wishlistSet.has(productId);

  const toggle = (productId: string) => {
    dispatch(toggleWishlistItem(productId));
  };

  const clear = () => {
    dispatch(clearWishlist());
  };

  const getWishlistProducts = () => 
    products.filter(p => wishlistSet.has(p.id));

  return {
    isWishlisted,
    toggle,
    items: wishlistItems,
    wishlistSet,
    getWishlistProducts,
    clear,
  };
}
