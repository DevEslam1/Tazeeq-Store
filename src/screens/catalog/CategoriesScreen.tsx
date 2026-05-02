import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryCard } from '../../components/commerce/CategoryCard';
import { CategoryRepository } from '../../services/categoryService';
import { Category } from '../../types/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

import { useRTL } from '../../hooks/useRTL';

export function CategoriesScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryRepository.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('categories.title')}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginBottom: 20 }]}>
          {t('categories.subtitle')}
        </Text>

        <FlatList
          data={categories}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <CategoryCard 
                category={item} 
                onPress={() => navigation.navigate('ProductList', { categoryId: item.id, categoryName: item.name })} 
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.list}
          ListEmptyComponent={loading ? <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} /> : null}
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 110,
  },
  itemContainer: {
    flex: 1/3,
    alignItems: 'center',
    marginBottom: 16,
  },
});

