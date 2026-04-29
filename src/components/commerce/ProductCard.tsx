import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { Product } from '../../types/app';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
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
      <GlassCard style={styles.card} transparent>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: theme.radius.xl }]}>
          <Image source={{ uri: product.image }} style={styles.image} />
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
              color={wishlisted ? '#ef4444' : theme.colors.outline} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.weight, { color: theme.colors.outline }]}>
            {product.weight}
          </Text>
          
          {product.rating && (
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={14} color={theme.colors.secondary} />
              <Text style={[styles.rating, { color: theme.colors.outline }]}>
                {product.rating} ({product.reviewCount || 0})
              </Text>
            </View>
          )}
          
          <View style={styles.footer}>
            {cartItem ? (
              <View style={[styles.quantityControl, { backgroundColor: theme.colors.primaryContainer + '30' }]}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={handleDecrease}
                >
                  <MaterialCommunityIcons name="minus" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: theme.colors.primary }]}>{cartItem.quantity}</Text>
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
                style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
              </TouchableOpacity>
            )}
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="md" />
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '46%',
    margin: '2%',
  },
  card: {
    overflow: 'hidden',
    padding: 0,
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
    borderRadius: 12,
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
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#161d19',
    textAlign: 'left',
    writingDirection: 'rtl',
    width: '100%',
  },
  weight: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rating: {
    fontSize: 12,
    marginStart: 4,
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
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
});
