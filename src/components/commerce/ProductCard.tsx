import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { Product } from '../../types/app';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const { theme, isRTL } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <GlassCard style={styles.card} transparent>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: theme.radius.xl }]}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {product.badges && product.badges.length > 0 && (
            <View style={[styles.badgeContainer, isRTL ? { left: 12 } : { right: 12 }]}>
              {product.badges.map((badge, index) => (
                <Badge key={index} type={badge} />
              ))}
            </View>
          )}
        </View>
        
        <View style={[styles.info, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.weight, { color: theme.colors.outline, textAlign: isRTL ? 'right' : 'left' }]}>
            {product.weight}
          </Text>
          
          {product.rating && (
            <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <MaterialCommunityIcons name="star" size={14} color={theme.colors.secondary} />
              <Text style={[styles.rating, { color: theme.colors.outline }]}>
                {product.rating} ({product.reviewCount || 0})
              </Text>
            </View>
          )}
          
          <View style={[styles.footer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity 
              onPress={onAddToCart}
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            >
              <MaterialCommunityIcons name="plus" size={20} color="white" />
            </TouchableOpacity>
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
  info: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#161d19',
  },
  weight: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 6,
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  footer: {
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
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
});
