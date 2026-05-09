import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '../../components/commerce/ProductCard';
import { useRTL } from '../../hooks/useRTL';
import { useWishlist } from '../../hooks/useWishlist';
import { useAppTheme } from '../../theme';
import { HeaderProgressBar } from '../../components/common/HeaderProgressBar';

export function WishlistScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { getWishlistProducts } = useWishlist();

  const wishlistProducts = getWishlistProducts();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.onPrimary }]}>{t('wishlist.title')}</Text>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.onPrimary, opacity: 0.8 }]}>({wishlistProducts.length})</Text>
        <HeaderProgressBar loading={refreshing} color={theme.colors.onPrimary} />
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="heart-outline" size={80} color={theme.colors.onSurfaceVariant} />
          <Text style={[theme.typography.sectionTitle, { color: theme.colors.onSurface, marginTop: 16 }]}>{t('wishlist.empty')}</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 8 }]}>Add products to compare and revisit them later.</Text>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[theme.typography.bodyMain, { color: theme.colors.onPrimary }]}>{t('common.browse_products')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['transparent']} 
              tintColor={'transparent'}
              progressBackgroundColor={'transparent'}
            />
          }
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
