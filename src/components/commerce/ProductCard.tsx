import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, DimensionValue } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectCartItemById } from '../../store/slices/cartSlice';
import { selectWishlistItems, selectIsWishlisted } from '../../store/slices/wishlistSlice';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { Product } from '../../types/app';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBanner } from '../../hooks/useBanner';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../hooks/useRTL';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  width?: DimensionValue;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onPress,
  width = '46%',
}: ProductCardProps) {
  const cartItem = useSelector((state: RootState) => selectCartItemById(state, product.id));
  const cartQuantity = cartItem?.quantity || 0;
  const wishlisted = useSelector((state: RootState) => selectIsWishlisted(state, product.id));

  const { addToCart, updateQty, removeFromCart } = useCart();
  const { toggle } = useWishlist();

  const onToggleWishlist = useCallback(() => {
    toggle(product.id);
  }, [product.id, toggle]);

  const onAddToCart = useCallback(() => {
    addToCart(product, 1);
  }, [product, addToCart]);

  const onIncreaseQuantity = useCallback(() => {
    addToCart(product, 1);
  }, [product, addToCart]);

  const onDecreaseQuantity = useCallback(() => {
    if (cartQuantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQty(product.id, cartQuantity - 1);
    }
  }, [product.id, cartQuantity, removeFromCart, updateQty]);
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { showSuccess } = useBanner();
  const { t, i18n } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const [imageIndex, setImageIndex] = React.useState(0);
  const imageList = React.useMemo(() => {
    const list = [product.image];
    if (product.images) {
      product.images.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product.image, product.images]);

  const currentImage = imageList[imageIndex] || product.image;

  const handleImageError = useCallback(() => {
    if (imageIndex < imageList.length - 1) {
      setImageIndex(prev => prev + 1);
    }
  }, [imageIndex, imageList.length]);

  const handleAddToCart = () => {
    // Ensure the cart uses the same successful image the user sees
    const productWithActualImage = { ...product, image: currentImage };
    addToCart(productWithActualImage, 1);
    showSuccess(t('cart.added_success', { name: product.name }));
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.container, { width }]}
    >
      <Animated.View style={[styles.card, theme.elevation.card, { backgroundColor: theme.colors.surfaceContainerLowest, borderColor: theme.colors.border, borderRadius: theme.radius.card }, animatedStyle]}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.lg }]}>
          <Image 
            source={{ uri: currentImage }} 
            style={[styles.image, { borderRadius: theme.radius.default, opacity: product.inStock ? 1 : 0.5 }]} 
            contentFit="cover"
            transition={200}
            onError={handleImageError}
          />
          {!product.inStock && (
            <View style={[styles.outOfStockOverlay, { borderRadius: theme.radius.default }]}>
              <Text style={[theme.typography.meta, { color: 'white', fontWeight: '700' }]}>{t('common.out_of_stock')}</Text>
            </View>
          )}
          {product.badges && product.badges.length > 0 && (
            <View style={[styles.badgeContainer, { [isRTL ? 'left' : 'right']: 12 }]}>
              {product.badges.map((badge, index) => (
                <Badge key={index} type={badge} />
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[styles.wishlistButton, { [isRTL ? 'right' : 'left']: 8 }]}
            onPress={onToggleWishlist}
            disabled={!onToggleWishlist}
          >
            <MaterialCommunityIcons 
              name={wishlisted ? 'heart' : 'heart-outline'} 
              size={20} 
              color={wishlisted ? theme.colors.error : theme.colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.info, { alignItems: 'flex-start' }]}>
          <Text style={[theme.typography.itemName, { color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
            {i18n.language.startsWith('en') ? (product.nameEn || product.name) : product.name}
          </Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 2, textAlign: isRTL ? 'right' : 'left' }]}>
            {i18n.language.startsWith('en') ? (product.weightEn || product.weight) : product.weight}
          </Text>
          
          {product.rating && (
            <View style={[styles.ratingRow, { flexDirection: flexRow }]}>
              <MaterialCommunityIcons name="star" size={14} color={theme.colors.secondaryContainer} />
              <Text style={[theme.typography.meta, { color: theme.colors.onSurfaceVariant, marginHorizontal: 4 }]}>
                {product.rating} ({product.reviewCount || 0})
              </Text>
            </View>
          )}
          
          <View style={[styles.footer, { flexDirection: flexRow }]}>
            {cartQuantity > 0 ? (
              <View style={[styles.quantityControl, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.stepper, flexDirection: flexRow }]}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={onDecreaseQuantity}
                >
                  <MaterialCommunityIcons name="minus" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={[theme.typography.meta, { color: theme.colors.primary, fontWeight: '700', minWidth: 20, textAlign: 'center' }]}>{cartQuantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={onIncreaseQuantity}
                >
                  <MaterialCommunityIcons name="plus" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ) : !product.inStock ? (
              <View 
                style={[styles.addButton, { backgroundColor: '#ef4444', borderRadius: theme.radius.full, opacity: 0.8 }]}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </View>
            ) : (
              <TouchableOpacity 
                onPress={handleAddToCart}
                style={[styles.addButton, theme.elevation.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius.full }]}
              >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
              </TouchableOpacity>
            )}
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="md" />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

export const ProductCardSkeleton = React.memo(({ width = '46%' }: { width?: DimensionValue }) => {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceContainerLowest, borderColor: theme.colors.border, borderRadius: theme.radius.card }]}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: theme.radius.lg }]} />
        <View style={styles.info}>
          <View style={{ height: 16, backgroundColor: theme.colors.surfaceContainerHigh, width: '80%', borderRadius: 4 }} />
          <View style={{ height: 12, backgroundColor: theme.colors.surfaceContainerHigh, width: '40%', marginTop: 8, borderRadius: 4 }} />
          <View style={styles.footer}>
            <View style={{ height: 24, backgroundColor: theme.colors.surfaceContainerHigh, width: 36, borderRadius: 18 }} />
            <View style={{ height: 20, backgroundColor: theme.colors.surfaceContainerHigh, width: 60, borderRadius: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    margin: '2%',
  },
  card: {
    overflow: 'hidden',
    padding: 0,
    borderWidth: 1,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    padding: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    gap: 4,
    zIndex: 1,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  info: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingRow: {
    marginTop: 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

