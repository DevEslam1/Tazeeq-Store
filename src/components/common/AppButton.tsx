import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'glass';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading, 
  disabled, 
  style,
  textStyle
}: AppButtonProps) {
  const { theme } = useAppTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.colors.primary, ...theme.elevation.card };
      case 'secondary':
        return { backgroundColor: theme.colors.secondaryContainer };
      case 'glass':
        return { ...theme.glassmorphism.card, backgroundColor: 'rgba(255, 255, 255, 0.15)' };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: theme.colors.onPrimary };
      case 'secondary':
        return { color: theme.colors.onSecondaryContainer };
      case 'glass':
        return { color: theme.colors.primary };
      default:
        return { color: theme.colors.onPrimary };
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[
        styles.button, 
        { borderRadius: theme.radius.default },
        getButtonStyle(),
        style,
        disabled && { opacity: 0.5 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <Text style={[styles.text, theme.typography.bodyMain, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '700',
  },
});
