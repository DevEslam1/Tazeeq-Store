import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { Product } from '../../types/app';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = React.memo(function ProductCard({ product, onPress }: ProductCardProps) {
  const { theme } = useAppTheme();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { addToCart, getItem, removeFromCart, updateQty } = useCart();
  
  const wishlisted = isWishlisted(product.id);
  const cartItem = getItem(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    const newQty = cartItem.quantity - 1;
    if (newQty <= 0) {
      removeFromCart(product.id);
    } else {
      updateQty(product.id, newQty);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.card, theme.elevation.card, { backgroundColor: theme.colors.surfaceContainerLowest, borderColor: theme.colors.border, borderRadius: theme.radius.card }]}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.lg }]}>
          <Image source={{ uri: product.image }} style={[styles.image, { borderRadius: theme.radius.default }]} />
          {product.badges && product.badges.length > 0 && (
            <View style={[styles.badgeContainer, { right: 12 }]}>
              {product.badges.map((badge, index) => (
                <Badge key={index} type={badge} />
              ))}
            </View>
          )}
          <TouchableOpacity 
            style={[styles.wishlistButton, { left: 8 }]}
            onPress={handleToggleWishlist}
          >
            <MaterialCommunityIcons 
              name={wishlisted ? 'heart' : 'heart-outline'} 
              size={20} 
              color={wishlisted ? '#ef4444' : theme.colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.info}>
          <Text style={[theme.typography.itemName, { color: theme.colors.onSurface }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 2 }]}>
            {product.weight}
          </Text>
          
          {product.rating && (
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={14} color="#f59e0b" />
              <Text style={[theme.typography.meta, { color: theme.colors.onSurfaceVariant, marginStart: 4 }]}>
                {product.rating} ({product.reviewCount || 0})
              </Text>
            </View>
          )}
          
          <View style={styles.footer}>
            {cartItem ? (
              <View style={[styles.quantityControl, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.stepper }]}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={handleDecrease}
                >
                  <MaterialCommunityIcons name="minus" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={[theme.typography.itemName, { color: theme.colors.primary, minWidth: 20, textAlign: 'center' }]}>{cartItem.quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => addToCart(product.id, 1)}
                >
                  <MaterialCommunityIcons name="plus" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
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
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '46%',
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
});

