import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useDeviceType } from '../../hooks/useDeviceType';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryCard } from '../../components/commerce/CategoryCard';
import { ProductCard } from '../../components/commerce/ProductCard';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { FadeInView } from '../../components/animations/FadeInView';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function HomeScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[theme.typography.h2, { color: theme.colors.primary }]}>
              {t('home.categories')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.primaryContainer, fontWeight: '700' }]}>
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
            contentContainerStyle={[styles.categoriesList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            inverted={isRTL}
          />
        </View>

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <LinearGradient
            colors={['#10b981', '#fea619']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.h2, { color: 'white', textAlign: isRTL ? 'right' : 'left' }]}>
                  خصم ٤٠٪ على الخضروات الطازجة 🔥
                </Text>
                <View style={[styles.timerBadge, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="white" />
                  <Text style={styles.timerText}>02:15:30</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Best Sellers Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.headerWithIcon, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <MaterialCommunityIcons name="star-outline" size={24} color={theme.colors.primaryContainer} />
              <Text style={[theme.typography.h2, { color: theme.colors.primary, marginHorizontal: 8 }]}>
                {t('home.best_sellers')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList', { categoryName: t('home.best_sellers') })}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, fontWeight: '500' }]}>
                {t('common.view_all')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.productGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                onAddToCart={() => {}}
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
    paddingBottom: 20,
    paddingTop: 160,
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
  },
  timerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  headerWithIcon: {
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
