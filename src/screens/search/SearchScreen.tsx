import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductCard } from '../../components/commerce/ProductCard';
import { products } from '../../data/products';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, addRecentSearch, setSearchResults, clearSearch, selectSearchQuery, selectRecentSearches, selectSearchResults } from '../../store/slices/searchSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SearchScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  
  const query = useSelector(selectSearchQuery);
  const recentSearches = useSelector(selectRecentSearches);
  const results = useSelector(selectSearchResults);

  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        p.description?.toLowerCase().includes(inputValue.toLowerCase())
      );
      dispatch(setSearchResults(filtered));
    } else {
      dispatch(setSearchResults([]));
    }
  }, [inputValue]);

  const handleSearch = (text: string) => {
    setInputValue(text);
    dispatch(setQuery(text));
    if (text.length > 0 && !recentSearches.includes(text)) {
      dispatch(addRecentSearch(text));
    }
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
  };

  const handleRecentPress = (item: string) => {
    handleSearch(item);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchBarContainer, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.outline} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface, textAlign: 'left' }]}
            placeholder="بحث عن منتجات..."
            placeholderTextColor={theme.colors.outline}
            value={inputValue}
            onChangeText={handleSearch}
            autoFocus
          />
          {inputValue.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {inputValue.length === 0 && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface }]}>البحث الأخير</Text>
            <TouchableOpacity>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary }]}>مسح</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {recentSearches.slice(0, 6).map((item, index) => (
              <TouchableOpacity key={index} style={[styles.chip, { backgroundColor: theme.colors.surfaceContainerLow }]} onPress={() => handleRecentPress(item)}>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurface }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {inputValue.length > 0 && results.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={64} color={theme.colors.outline} />
          <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginTop: 16 }]}>لا توجد نتائج</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 8 }]}>جرب كلمات مختلفة</Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
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
  input: { flex: 1, fontSize: 16, marginHorizontal: 12 },
  recentSection: { paddingHorizontal: 20 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
});