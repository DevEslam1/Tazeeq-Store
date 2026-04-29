import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryCard } from '../../components/commerce/CategoryCard';
import { ProductCard } from '../../components/commerce/ProductCard';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600 * 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 140 }]}>
        {/* Categories Section */}
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
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => (
              <CategoryCard 
                category={item} 
                onPress={() => navigation.navigate('ProductList', { categoryId: item.id, categoryName: item.name })} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

{/* Promo Banner */}
        <View style={styles.promoContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.promoGradient, theme.elevation.panel]}
          >
            <View style={styles.promoContent}>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.pageTitle, { color: 'white', textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('home.promo_title')} 🔥
                </Text>
                <View style={[styles.timerBadge, { alignSelf: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="white" />
                  <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.ctaButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: 'rgba(255,255,255,0.25)' }]}
                onPress={() => navigation.navigate('ProductList', { categoryName: 'العروض' })}
              >
                <Text style={styles.ctaButtonText}>تسوق الآن</Text>
                <MaterialCommunityIcons name={isRTL ? "arrow-left" : "arrow-right"} size={18} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Best Sellers Section */}
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
            {products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onPress={() => navigation.getParent()?.navigate('Shop', { screen: 'ProductDetail', params: { productId: product.id } }) || navigation.navigate('ProductDetail', { productId: product.id })}
              />
            ))}
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

