import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '../../components/commerce/ProductCard';
import { ProductRepository } from '../../services/productService';
import { AppDispatch } from '../../store';
import { addRecentSearch, clearRecentSearches, clearSearch, selectRecentSearches, selectSearchQuery, selectSearchResults, setQuery, setSearchResults } from '../../store/slices/searchSlice';
import { useAppTheme } from '../../theme';
import { Product } from '../../types/app';
import { useRTL } from '../../hooks/useRTL';

export function SearchScreen({ navigation }: any) {
   const { theme } = useAppTheme();
   const { t } = useTranslation();
   const { isRTL, flexRow } = useRTL();
   const insets = useSafeAreaInsets();
   const dispatch = useDispatch<AppDispatch>();

  const query = useSelector(selectSearchQuery);
  const recentSearches = useSelector(selectRecentSearches);
  const results = useSelector(selectSearchResults);

  const [inputValue, setInputValue] = useState(query);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const searchTerm = inputValue.trim();
    const handler = setTimeout(async () => {
      if (searchTerm.length < 2) {
        dispatch(setSearchResults([]));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await ProductRepository.search(searchTerm);
        dispatch(setSearchResults(searchResults));
      } catch (error) {
        console.error('Error searching products:', error);
        dispatch(setSearchResults([]));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [dispatch, inputValue]);

  const handleSearch = (text: string) => {
    setInputValue(text);
    dispatch(setQuery(text));
  };

  const handleSubmitSearch = () => {
    const searchTerm = inputValue.trim();
    if (searchTerm.length > 0 && !recentSearches.includes(searchTerm)) {
      dispatch(addRecentSearch(searchTerm));
    }
  };

  const handleClear = () => {
    setInputValue('');
    setLoading(false);
    dispatch(clearSearch());
  };

  const handleRecentPress = (item: string) => {
    handleSearch(item);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchBarContainer, { paddingTop: insets.top + 10 }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('search.placeholder')}
            placeholderTextColor={theme.colors.outline}
            value={inputValue}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmitSearch}
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : inputValue.length > 0 ? (
            <TouchableOpacity onPress={handleClear}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {inputValue.length === 0 && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface }]}>{t('search.recent')}</Text>
            <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary }]}>{t('search.clear_recent')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {recentSearches.slice(0, 6).map((item) => (
              <TouchableOpacity key={item} style={[styles.chip, { backgroundColor: theme.colors.surfaceContainerLow }]} onPress={() => handleRecentPress(item)}>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurface }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[theme.typography.bodySecondary, { textAlign: 'center', marginTop: 8, color: theme.colors.onSurfaceVariant }]}>
            {t('search.back_hint')}
          </Text>
        </View>
      )}

      {!loading && inputValue.trim().length >= 2 && results.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={64} color={theme.colors.outline} />
          <Text style={[theme.typography.sectionTitle, { color: theme.colors.onSurface, marginTop: 16 }]}>{t('search.no_results')}</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 8 }]}>Try a more specific keyword.</Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, borderRadius: 28 },
  input: { flex: 1, fontSize: 16, marginHorizontal: 12, fontFamily: 'Cairo_400Regular' },
  recentSection: { paddingHorizontal: 20 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
