import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { ProductRepository } from '../../services/productService';
import { Product } from '../../types/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from '../../components/common/Badge';
import { PriceTag } from '../../components/common/PriceTag';
import { AppButton } from '../../components/common/AppButton';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';
import { ActivityIndicator } from 'react-native';

import { useBanner } from '../../hooks/useBanner';
import { useDeviceType } from '../../hooks/useDeviceType';

export function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { isTablet } = useDeviceType();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { showSuccess } = useBanner();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await ProductRepository.getById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      showSuccess(t('cart.added_success', { name: product.name }));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={theme.colors.outlineVariant} />
        <Text style={[theme.typography.h2, { color: theme.colors.onSurface, marginTop: 16, textAlign: 'center' }]}>
          {t('product.not_found') || 'المنتج غير متوفر'}
        </Text>
        <AppButton title={t('common.go_back')} onPress={() => navigation.goBack()} style={{ marginTop: 24, width: '100%' }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image} 
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[
              styles.backButton, 
              { 
                top: insets.top + 10,
                [isRTL ? 'right' : 'left']: 20,
                backgroundColor: theme.colors.surface + '80' 
              }
            ]}
          >
            <MaterialCommunityIcons 
              name={isRTL ? 'arrow-right' : 'arrow-left'} 
              size={28} 
              color={theme.colors.onSurface} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.pageTitle, { color: theme.colors.onSurface }]}>
                {product.name}
              </Text>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>
                {product.weight}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleWishlist(product.id)}>
              <MaterialCommunityIcons 
                name={wishlisted ? 'heart' : 'heart-outline'} 
                size={28} 
                color={wishlisted ? '#ef4444' : theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={20} color={theme.colors.secondary} />
            <Text style={[theme.typography.itemName, { marginHorizontal: 4 }]}>
              {product.rating}
            </Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
              ({product.reviewCount} {t('common.reviews')})
            </Text>
          </View>

          <View style={styles.badges}>
            {product.badges?.map((badge, index) => (
              <Badge key={index} type={badge} />
            ))}
          </View>

          <Text style={[theme.typography.sectionTitle, { marginTop: 24, marginBottom: 8 }]}>
            {t('product.description')}
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, lineHeight: 24 }]}>
            {product.description}
          </Text>

          <View style={styles.quantityRow}>
            <Text style={[theme.typography.sectionTitle]}>{t('common.quantity')}</Text>
            <View style={[styles.stepper, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.stepper }]}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={[styles.stepperButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm }]}>
                <MaterialCommunityIcons name="minus" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={[theme.typography.itemName, { marginHorizontal: 16, color: theme.colors.primary }]}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={[styles.stepperButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm }]}>
                <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[
        styles.footer, 
        { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: Math.max(insets.bottom, 20) + (isTablet ? 0 : 90) 
        }
      ]}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
            {t('common.total_price')}
          </Text>
          <Text style={[theme.typography.priceLarge, { color: theme.colors.primary }]}>
            {product.price * quantity} {t('common.currency')}
          </Text>
        </View>
        <AppButton 
          title={t('common.add_to_cart')} 
          onPress={handleAddToCart} 
          style={{ flex: 1, marginStart: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 4,
  },
  stepperButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
  },
});

