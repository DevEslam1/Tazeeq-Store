import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductCard } from '../../components/commerce/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { GlassCard } from '../../components/common/GlassCard';

export function WishlistScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const { getWishlistProducts, toggle } = useWishlist();
  const { addToCart } = useCart();
  
  const wishlistProducts = getWishlistProducts();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white' }]}>المفضلة</Text>
        <Text style={[theme.typography.bodyMain, { color: 'white', opacity: 0.8 }]}>({wishlistProducts.length})</Text>
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="heart-outline" size={80} color={theme.colors.outline} />
          <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginTop: 16 }]}>المفضلة فارغة</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 8 }]}>أضف منتجات للمفضلة</Text>
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[theme.typography.bodyMain, { color: 'white' }]}>تصفح المنتجات</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 48 },
  backButton: { padding: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  ctaButton: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28 },
  list: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 },
});