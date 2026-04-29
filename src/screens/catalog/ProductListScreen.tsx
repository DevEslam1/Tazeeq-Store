import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../components/commerce/ProductCard';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function ProductListScreen({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params;
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  const filteredProducts = products.filter(p => p.category === categoryId);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: theme.colors.primary }]}>
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

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onAddToCart={() => {}}
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
    height: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 8,
  },
});
