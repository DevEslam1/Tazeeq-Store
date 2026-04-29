import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  transparent?: boolean;
}

export function GlassCard({ children, style, intensity = 25, transparent = false }: GlassCardProps) {
  const { theme } = useAppTheme();

  // Android doesn't support BlurView well — use solid backgrounds
  if (Platform.OS === 'android') {
    const bgColor = transparent 
      ? theme.colors.surfaceContainerLowest 
      : theme.colors.surfaceContainerLowest;
    return (
      <View style={[
        styles.container, 
        { 
          borderRadius: theme.radius.card, 
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        theme.elevation.card,
        style
      ]}>
        {children}
      </View>
    );
  }

  // iOS — true glassmorphism
  const bgOpacity = transparent ? 0.6 : 0.85;
  const bgColor = theme.mode === 'light' 
    ? `rgba(255, 255, 255, ${bgOpacity})` 
    : `rgba(20, 20, 20, ${bgOpacity})`;

  return (
    <View style={[styles.container, { borderRadius: theme.radius.card }, theme.elevation.card, style]}>
      <BlurView 
        intensity={intensity} 
        tint={theme.mode === 'light' ? 'light' : 'dark'}
        style={[
          styles.blur, 
          { 
            borderRadius: theme.radius.card, 
            backgroundColor: bgColor,
            borderColor: theme.colors.border
          }
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blur: {
    borderWidth: 1,
  },
});

