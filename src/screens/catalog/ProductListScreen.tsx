import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard, ProductCardSkeleton } from '../../components/commerce/ProductCard';
import { useDeviceType } from '../../hooks/useDeviceType';
import { useRTL } from '../../hooks/useRTL';
import { ProductRepository } from '../../services/productService';
import { useAppTheme } from '../../theme';
import { Product } from '../../types/app';

type FilterType = 'All' | 'Best Sellers' | 'Price: Low to High' | 'Price: High to Low';

export function ProductListScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params || {};
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { isTablet } = useDeviceType();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const numColumns = isTablet ? 3 : 2;
  const productWidth = isTablet ? '31.3%' : '46%';
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'All', label: t('catalog.filter_all') },
    { id: 'Best Sellers', label: t('catalog.filter_best_sellers') },
    { id: 'Price: Low to High', label: t('catalog.filter_price_low') },
    { id: 'Price: High to Low', label: t('catalog.filter_price_high') },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductRepository.getAll(categoryId);
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    const result = [...allProducts];

    if (activeFilter === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeFilter === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeFilter === 'Best Sellers') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [activeFilter, allProducts]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10, backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white', flex: 1, textAlign: 'center' }]}>
          {categoryName}
        </Text>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="tune-variant" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ zIndex: 10, backgroundColor: theme.colors.background }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterPill,
                {
                  backgroundColor: activeFilter === option.id ? theme.colors.primary : theme.colors.surface,
                  borderColor: activeFilter === option.id ? theme.colors.primary : theme.colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setActiveFilter(option.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === option.id ? theme.colors.onPrimary : theme.colors.onSurface },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        style={{ marginTop: -60, zIndex: 0 }}
        key={numColumns}
        data={loading ? Array(6).fill(null) : filteredProducts}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) =>
          loading || !item ? (
            <ProductCardSkeleton width={productWidth} />
          ) : (
            <ProductCard
              product={item}
              width={productWidth}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )
        }
        keyExtractor={(item, index) => (item ? item.id : `skeleton-${index}`)}
        numColumns={numColumns}
        contentContainerStyle={[styles.list, { paddingTop: 68 }]}
        ListEmptyComponent={
          !loading ? (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
              <MaterialCommunityIcons name="basket-remove-outline" size={64} color={theme.colors.outlineVariant} />
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 16 }]}>
                {t('common.no_products')}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    height: 60,
    backgroundColor: 'transparent',
  },
  filterContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
    height: '100%',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    padding: 8,
    paddingBottom: 110,
  },
});
