import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../components/commerce/ProductCard';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../../components/common/AppHeader';

export function OrganicScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  const organicProducts = products.filter(p => p.badges?.includes('organic'));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader />
      
      <View style={styles.banner}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop' }} 
          style={styles.bannerImage} 
        />
        <View style={[styles.overlay, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[theme.typography.h1, { color: 'white', textAlign: isRTL ? 'right' : 'left' }]}>{t('common.organic')}</Text>
          <Text style={[theme.typography.bodyMain, { color: 'white', opacity: 0.8, textAlign: isRTL ? 'right' : 'left' }]}>١٠٠٪ منتجات طبيعية وعضوية</Text>
        </View>
      </View>

      <FlatList
        data={organicProducts}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.getParent()?.navigate('Checkout', { screen: 'ProductDetail', params: { productId: item.id } }) || navigation.navigate('ProductDetail', { productId: item.id })}
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
  list: {
    padding: 8,
    paddingBottom: 100,
  },
});
