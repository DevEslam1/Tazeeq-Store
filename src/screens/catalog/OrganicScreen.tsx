import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/common/AppHeader';
import { ProductCard } from '../../components/commerce/ProductCard';
import { ProductRepository } from '../../services/productService';
import { useAppTheme } from '../../theme';
import { Product } from '../../types/app';

export function OrganicScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [organicProducts, setOrganicProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganicProducts = async () => {
      setLoading(true);
      try {
        const products = await ProductRepository.getAll();
        const organic = products.filter((p) => p.badges && p.badges.includes('organic'));
        setOrganicProducts(organic);
      } catch (error) {
        console.error('Error fetching organic products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganicProducts();
  }, []);


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader />

      <View style={[styles.banner, { marginTop: insets.top + 140, marginHorizontal: 20 }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop' }}
          style={styles.bannerImage}
          contentFit="cover"
          transition={300}
        />
        <View style={[styles.overlay, { alignItems: 'flex-start' }]}>
          <Text style={[theme.typography.h1, { color: 'white', textAlign: isRTL ? 'right' : 'left' }]}>{t('common.organic')}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={organicProducts}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('Shop', { screen: 'ProductDetail', params: { productId: item.id } })}
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
  container: {
    flex: 1,
  },
  banner: {
    height: 160,
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 8,
    paddingBottom: 120,
  },
});
