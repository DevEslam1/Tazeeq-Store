import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../hooks/useRTL';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/common/AppHeader';
import { CategoryCard } from '../../components/commerce/CategoryCard';
import { ProductCard, ProductCardSkeleton } from '../../components/commerce/ProductCard';
import { useDeviceType } from '../../hooks/useDeviceType';
import { CategoryRepository } from '../../services/categoryService';
import { ProductRepository } from '../../services/productService';
import { useAppTheme } from '../../theme';
import { Category, Product } from '../../types/app';

const INITIAL_FLASH_SALE_TIME = 2 * 3600 + 15 * 60 + 30;

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const SaleCountdown = React.memo(function SaleCountdown() {
  const { theme, isRTL } = useAppTheme();
  const [timeLeft, setTimeLeft] = useState(INITIAL_FLASH_SALE_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[styles.timerBadge, { alignSelf: 'flex-start', flexDirection: 'row' }]}>
      <MaterialCommunityIcons name="clock-outline" size={16} color="white" />
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
});

export function HomeScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow, shouldInvert } = useRTL();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isTablet } = useDeviceType();
  const productWidth = isTablet ? '31%' : '46%';
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = useCallback(async () => {
    try {
      const [categoriesData, featuredData] = await Promise.all([
        CategoryRepository.getAll(),
        ProductRepository.getFeatured()
      ]);
      setCategories(categoriesData);
      setFeaturedProducts(featuredData);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData();
  }, [loadHomeData]);

  const renderCategory = useCallback(({ item }: { item: any }) => (
    <CategoryCard
      category={item}
      onPress={() => navigation.navigate('ProductList', { 
        categoryId: item.id, 
        categoryName: i18n.language === 'en' && item.nameEn ? item.nameEn : item.name 
      })}
    />
  ), [navigation, i18n.language]);

  const navigateToProduct = useCallback((productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader loading={refreshing} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 140 }]}
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


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.sectionTitle, { color: theme.colors.primary }]}>
              {t('home.categories')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700' }]}>
                {t('common.view_all')}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            key={isRTL ? 'rtl' : 'ltr'}
            horizontal
            inverted={shouldInvert}
            showsHorizontalScrollIndicator={false}
            data={categories}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
            ListEmptyComponent={null}
          />
        </View>

        <View style={styles.promoContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: isRTL ? 1 : 0, y: 0 }}
            end={{ x: isRTL ? 0 : 1, y: 1 }}
            style={[styles.promoGradient, theme.elevation.panel]}
          >
            <View style={[styles.promoContent, { alignItems: 'flex-start' }]}>
              <View style={{ flex: 1, width: '100%', alignItems: 'flex-start' }}>
                <Text style={[theme.typography.pageTitle, { color: 'white', textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
                  {t('home.promo_title')}
                </Text>
                <SaleCountdown />
              </View>
              <TouchableOpacity
                style={[styles.ctaButton, { alignSelf: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: 'rgba(255,255,255,0.25)' }]}
                onPress={() => navigation.navigate('ProductList', { categoryName: t('home.shop_now') })}
              >
                <Text style={styles.ctaButtonText}>{t('home.shop_now')}</Text>
                <MaterialCommunityIcons name={isRTL ? 'arrow-left' : 'arrow-right'} size={18} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerWithIcon}>
              <MaterialCommunityIcons name="star-outline" size={24} color={theme.colors.primary} />
              <Text style={[theme.typography.sectionTitle, { color: theme.colors.primary, marginHorizontal: 8 }]}>
                {t('home.best_sellers')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList', { categoryName: t('home.best_sellers') })}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, fontWeight: '500' }]}>
                {t('common.view_all')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {loading ? (
              <>
                <ProductCardSkeleton width={productWidth} />
                <ProductCardSkeleton width={productWidth} />
                <ProductCardSkeleton width={productWidth} />
                <ProductCardSkeleton width={productWidth} />
              </>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  width={productWidth}
                  onPress={() => navigateToProduct(product.id)}
                />
              ))
            ) : (
              <Text style={[theme.typography.bodySecondary, { textAlign: 'center', width: '100%', marginVertical: 40, color: theme.colors.onSurfaceVariant }]}>
                {t('common.no_products')}
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  promoContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  promoGradient: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  promoContent: {
    padding: 24,
    minHeight: 140,
    justifyContent: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  timerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    marginTop: 12,
  },
  ctaButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
});
