import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '../../components/commerce/ProductCard';
import { useCart } from '../../hooks/useCart';
import { useRTL } from '../../hooks/useRTL';
import { useWishlist } from '../../hooks/useWishlist';
import { useAppTheme } from '../../theme';

export function WishlistScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { addToCart, itemMap, removeFromCart, updateQty } = useCart();
  const { getWishlistProducts, toggle, wishlistSet } = useWishlist();

  const wishlistProducts = getWishlistProducts();
  const wishlistProductsWithState = useMemo(
    () =>
      wishlistProducts.map((product) => ({
        product,
        cartQuantity: itemMap.get(product.id)?.quantity ?? 0,
        wishlisted: wishlistSet.has(product.id),
      })),
    [itemMap, wishlistProducts, wishlistSet]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white' }]}>{t('wishlist.title')}</Text>
        <Text style={[theme.typography.bodyMain, { color: 'white', opacity: 0.8 }]}>({wishlistProducts.length})</Text>
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="heart-outline" size={80} color={theme.colors.outline} />
          <Text style={[theme.typography.sectionTitle, { color: theme.colors.onSurface, marginTop: 16 }]}>{t('wishlist.empty')}</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 8 }]}>Add products to compare and revisit them later.</Text>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[theme.typography.bodyMain, { color: 'white' }]}>{t('common.browse_products')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistProductsWithState}
          renderItem={({ item }) => (
            <ProductCard
              product={item.product}
              cartQuantity={item.cartQuantity}
              wishlisted={item.wishlisted}
              onAddToCart={() => addToCart(item.product.id, 1)}
              onIncreaseQuantity={() => addToCart(item.product.id, 1)}
              onDecreaseQuantity={() => {
                if (item.cartQuantity <= 1) {
                  removeFromCart(item.product.id);
                  return;
                }
                updateQty(item.product.id, item.cartQuantity - 1);
              }}
              onToggleWishlist={() => toggle(item.product.id)}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
            />
          )}
          keyExtractor={(item) => item.product.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { padding: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  ctaButton: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28 },
  list: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 },
});
