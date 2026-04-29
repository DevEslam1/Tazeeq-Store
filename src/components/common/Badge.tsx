import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

interface BadgeProps {
  type: 'organic' | 'prime' | 'premium' | 'tazeeq';
  label?: string;
}

export function Badge({ type, label }: BadgeProps) {
  const { theme } = useAppTheme();

  const getBadgeStyle = () => {
    switch (type) {
      case 'prime':
      case 'premium':
      case 'tazeeq':
        return { backgroundColor: theme.colors.secondaryContainer, color: theme.colors.onSecondaryContainer };
      case 'organic':
        return { backgroundColor: theme.colors.primaryContainer, color: 'white' };
      default:
        return { backgroundColor: theme.colors.primaryContainer, color: 'white' };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor, borderRadius: 20 }]}>
      <Text style={[styles.text, theme.typography.labelCaps, { color: style.color }]}>
        {label || type.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderRadius: 20, // Pill shaped
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 10,
  },
});
