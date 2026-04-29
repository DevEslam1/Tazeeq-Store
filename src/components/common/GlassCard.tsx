import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../theme/ThemeProvider';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  transparent?: boolean;
}

export function GlassCard({ children, style, intensity = 25, transparent = false }: GlassCardProps) {
  const { theme } = useAppTheme();
  const bgOpacity = transparent ? 0.08 : 0.85;

  return (
    <View style={[styles.container, theme.elevation.card, style]}>
      <BlurView 
        intensity={intensity} 
        tint={theme.mode === 'light' ? 'light' : 'dark'}
        style={[styles.blur, { borderRadius: theme.radius.xl, backgroundColor: `rgba(255, 255, 255, ${bgOpacity})` }]}
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
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
