import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
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
  const bgOpacity = transparent ? 0.05 : 0.65;
  const bgColor = theme.mode === 'light' 
    ? `rgba(255, 255, 255, ${bgOpacity})` 
    : `rgba(20, 20, 20, ${bgOpacity})`;

  return (
    <View style={[styles.container, Platform.OS !== 'android' && theme.elevation.card, style]}>
      <BlurView 
        intensity={intensity} 
        tint={theme.mode === 'light' ? 'light' : 'dark'}
        style={[
          styles.blur, 
          { 
            borderRadius: theme.radius.xl, 
            backgroundColor: bgColor,
            borderColor: theme.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'
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
