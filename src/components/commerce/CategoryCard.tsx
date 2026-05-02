import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { Category } from '../../types/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

const getCategoryColor = (iconName: string) => {
  const icon = iconName.toLowerCase();
  if (icon.includes('fish')) return '#0EA5E9'; // Blue
  if (icon.includes('bottle') || icon.includes('cow') || icon.includes('milk') || icon.includes('cheese')) return '#94A3B8'; // Slate/Dairy
  if (icon.includes('leaf') || icon.includes('carrot') || icon.includes('fruit') || icon.includes('food-apple') || icon.includes('salad')) return '#10B981'; // Green
  if (icon.includes('bread') || icon.includes('grain') || icon.includes('wheat') || icon.includes('pastry')) return '#F59E0B'; // Amber
  if (icon.includes('meat') || icon.includes('food-steak') || icon.includes('drumstick')) return '#EF4444'; // Red
  if (icon.includes('basket') || icon.includes('cart') || icon.includes('grocery') || icon.includes('store')) return '#8B5CF6'; // Violet
  if (icon.includes('coffee') || icon.includes('tea') || icon.includes('cup')) return '#92400E'; // Brown
  if (icon.includes('water') || icon.includes('cup-water') || icon.includes('shimmer')) return '#38BDF8'; // Light Blue
  if (icon.includes('candy') || icon.includes('ice-cream') || icon.includes('cake')) return '#EC4899'; // Pink
  return null; 
};

export function CategoryCard({ category, isSelected, onPress }: CategoryCardProps) {
  const { theme } = useAppTheme();
  const { i18n } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

    const categoryColor = getCategoryColor(category.icon) || theme.colors.primary;

    return (
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.card,
            theme.elevation.card,
            {
              backgroundColor: isSelected ? categoryColor + '10' : theme.colors.surfaceContainerLowest,
              borderWidth: 1,
              borderColor: isSelected ? categoryColor : theme.colors.border,
              borderRadius: theme.radius.card,
            },
            animatedStyle
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '15', borderRadius: theme.radius.full }]}>
            <MaterialCommunityIcons
              name={category.icon as any}
              size={32}
              color={categoryColor}
            />
          </View>
          <Text style={[theme.typography.meta, { color: isSelected ? categoryColor : theme.colors.onSurface, textAlign: 'center', fontWeight: isSelected ? '700' : '500' }]}>
            {i18n.language === 'en' && category.nameEn ? category.nameEn : category.name}
          </Text>
        </Animated.View>
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

