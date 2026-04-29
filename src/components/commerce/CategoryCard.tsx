import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { Category } from '../../types/app';
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
      <View
        style={[
          styles.card,
          theme.elevation.card,
          {
            backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            borderRadius: theme.radius.card,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? theme.colors.primary + '20' : theme.colors.surfaceContainer, borderRadius: theme.radius.full }]}>
          <MaterialCommunityIcons
            name={category.icon as any}
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <Text style={[theme.typography.meta, { color: isSelected ? theme.colors.primary : theme.colors.onSurface, textAlign: 'center' }]}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    marginHorizontal: 6,
    marginVertical: 8,
  },
  card: {
    alignItems: 'center',
    padding: 12,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

