import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../components/commerce/ProductCard';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../hooks/useRTL';

const filterOptions = ['الكل', 'الأكثر مبيعاً', 'الأقل سعراً', 'الأعلى سعراً'];

export function ProductListScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params;
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('الكل');

  let filteredProducts = products.filter(p => p.category === categoryId);

  if (activeFilter === 'الأقل سعراً') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (activeFilter === 'الأعلى سعراً') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (activeFilter === 'الأكثر مبيعاً') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              { backgroundColor: activeFilter === filter ? theme.colors.primary : 'white' },
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === filter ? 'white' : theme.colors.onSurface },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.getParent()?.navigate('Shop', { screen: 'ProductDetail', params: { productId: item.id } }) || navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
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
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 8,
    paddingBottom: 110,
  },
});
