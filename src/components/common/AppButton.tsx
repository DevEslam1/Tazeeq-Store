import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle, StyleProp, View, Platform } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

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

  const getButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color="#ffffff" />;
    }
    return (
      <Text style={[styles.text, theme.typography.button, { color: '#ffffff' }, textStyle]}>
        {title}
      </Text>
    );
  };

  if (variant === 'primary') {
    return (
      <View style={[
        styles.buttonWrapper, 
        { borderRadius: theme.radius.checkout },
        Platform.OS === 'ios' && theme.elevation.button,
        style,
        disabled && { opacity: 0.5 },
      ]}>
        <TouchableOpacity 
          onPress={onPress} 
          disabled={disabled || loading}
          activeOpacity={0.85}
          style={styles.touchable}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { borderRadius: theme.radius.checkout }]}
          >
            {getButtonContent()}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const bgColor = variant === 'secondary' ? theme.colors.secondaryContainer : 'rgba(255, 255, 255, 0.2)';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[
        styles.button, 
        { 
          borderRadius: theme.radius.card, 
          backgroundColor: bgColor,
          borderColor: theme.colors.border
        },
        style,
        disabled && { opacity: 0.5 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'glass' ? theme.colors.primary : '#ffffff'} />
      ) : (
        <Text style={[
          styles.text, 
          theme.typography.button, 
          { 
            color: variant === 'glass' ? theme.colors.primary : '#ffffff',
          }, 
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    height: 56,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});