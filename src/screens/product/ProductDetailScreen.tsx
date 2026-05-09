import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
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
import { HeaderProgressBar } from '../../components/common/HeaderProgressBar';

import { useBanner } from '../../hooks/useBanner';
import { useDeviceType } from '../../hooks/useDeviceType';

export function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { theme } = useAppTheme();
  const { isRTL, flexRow, shouldInvert } = useRTL();
  const { isTablet } = useDeviceType();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { showSuccess } = useBanner();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await ProductRepository.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProduct();
  }, [productId]);

  const wishlisted = product ? isWishlisted(product.id) : false;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageList = React.useMemo(() => {
    if (!product) return [];
    const list = [product.image];
    if (product.images) {
      product.images.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product]);

  const currentImage = imageList[activeImageIndex] || (product?.image || '');

  const handleImageError = useCallback(() => {
    if (activeImageIndex < imageList.length - 1) {
      setActiveImageIndex(prev => prev + 1);
    }
  }, [activeImageIndex, imageList.length]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      // Use the currently viewed image for the cart snapshot
      const productWithActualImage = { ...product, image: currentImage };
      addToCart(productWithActualImage, quantity);
      showSuccess(t('cart.added_success', { name: product.name }));
    }
  };

  if (loading && !product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <HeaderProgressBar loading={true} />
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
      <HeaderProgressBar loading={loading || refreshing} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['transparent']} 
            tintColor={'transparent'}
            progressBackgroundColor={'transparent'}
          />
        }
      >
        <View style={styles.imageContainer}>
          <FlatList
            key={isRTL ? 'rtl' : 'ltr'}
            horizontal
            data={imageList}
            inverted={shouldInvert}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / windowWidth);
              if (index !== activeImageIndex && index < imageList.length) {
                setActiveImageIndex(index);
              }
            }}
            scrollEventThrottle={16}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                style={[styles.image, { width: windowWidth }]} 
                contentFit="cover"
                transition={300}
                onError={handleImageError}
              />
            )}
          />

          {imageList.length > 1 && (
            <View style={styles.paginationDots}>
              {imageList.map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.dot, 
                    { 
                      backgroundColor: activeImageIndex === idx ? theme.colors.primary : 'rgba(255,255,255,0.5)',
                      width: activeImageIndex === idx ? 20 : 8
                    }
                  ]} 
                />
              ))}
            </View>
          )}

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
          <View style={[styles.headerRow, { flexDirection: flexRow }]}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.pageTitle, { color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}>
                {i18n.language.startsWith('en') ? (product.nameEn || product.name) : product.name}
              </Text>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, textAlign: isRTL ? 'right' : 'left' }]}>
                {i18n.language.startsWith('en') ? (product.weightEn || product.weight) : product.weight}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleWishlist(product.id)}>
              <MaterialCommunityIcons 
                name={wishlisted ? 'heart' : 'heart-outline'} 
                size={28} 
                color={wishlisted ? theme.colors.error : theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.ratingRow, { flexDirection: flexRow }]}>
            <MaterialCommunityIcons name="star" size={20} color={theme.colors.secondaryContainer} />
            <Text style={[theme.typography.itemName, { marginHorizontal: 4, color: theme.colors.onSurface }]}>
              {product.rating}
            </Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
              ({product.reviewCount} {t('common.reviews')})
            </Text>
          </View>

          <View style={[styles.badges, { flexDirection: flexRow, justifyContent: isRTL ? 'flex-end' : 'flex-start' }]}>
            {product.badges?.map((badge, index) => (
              <Badge key={index} type={badge} />
            ))}
          </View>

          <Text style={[theme.typography.sectionTitle, { marginTop: 24, marginBottom: 8, textAlign: isRTL ? 'right' : 'left', color: theme.colors.onSurface }]}>
            {t('product.description')}
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, lineHeight: 24, textAlign: isRTL ? 'right' : 'left' }]}>
            {i18n.language === 'en' && product.descriptionEn ? product.descriptionEn : product.description}
          </Text>

          {product.inStock && (
            <View style={[styles.quantityRow, { flexDirection: flexRow }]}>
              <Text style={[theme.typography.sectionTitle, { color: theme.colors.onSurface }]}>{t('common.quantity')}</Text>
              <View style={[styles.stepper, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.stepper, flexDirection: flexRow }]}>
                <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={[styles.stepperButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm }]}>
                  <MaterialCommunityIcons name="minus" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={[theme.typography.itemName, { marginHorizontal: 16, color: theme.colors.primary }]}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={[styles.stepperButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm }]}>
                  <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[
        styles.footer, 
        { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: Math.max(insets.bottom, 20) + (isTablet ? 0 : 90),
          flexDirection: flexRow
        }
      ]}>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
            {t('common.total_price')}
          </Text>
          <Text style={[theme.typography.priceLarge, { color: theme.colors.primary }]}>
            {(product.price * quantity).toFixed(2)} {t('common.currency')}
          </Text>
        </View>
        <AppButton 
          title={product.inStock ? t('common.add_to_cart') : t('common.out_of_stock')} 
          onPress={handleAddToCart} 
          disabled={!product.inStock}
          style={{ 
            flex: 1, 
            marginStart: 16,
            backgroundColor: product.inStock ? theme.colors.primary : '#ef4444'
          }}
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
  paginationDots: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

