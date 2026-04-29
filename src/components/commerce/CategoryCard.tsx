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
      <GlassCard 
        style={[
          styles.card, 
          { 
            backgroundColor: isSelected ? theme.colors.secondaryContainer + '20' : 'white',
            borderWidth: isSelected ? 2 : 0,
            borderColor: theme.colors.secondaryContainer,
          }
        ]}
        transparent
      >
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? theme.colors.secondaryContainer + '30' : theme.colors.surfaceContainerLow }]}>
          <MaterialCommunityIcons 
            name={category.icon as any} 
            size={32} 
            color={isSelected ? theme.colors.secondary : theme.colors.onSurfaceVariant} 
          />
        </View>
        <Text style={[styles.text, { color: isSelected ? theme.colors.secondary : theme.colors.onSurface, fontWeight: '700' }]}>
          {category.name}
        </Text>
      </GlassCard>
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 11,
  },
});
