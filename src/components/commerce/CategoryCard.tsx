import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { Category } from '../../types/app';
import { GlassCard } from '../common/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export function CategoryCard({ category, isSelected, onPress }: CategoryCardProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.card, { backgroundColor: isSelected ? theme.colors.primaryContainer + '20' : 'white' }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 20 }]}>
          <MaterialCommunityIcons 
            name={category.icon as any} 
            size={36} 
            color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant} 
          />
        </View>
        <Text style={[styles.text, { color: isSelected ? theme.colors.primary : theme.colors.onSurface, fontWeight: '700' }]}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    marginHorizontal: 8,
    marginVertical: 12,
  },
  card: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
  },
});
