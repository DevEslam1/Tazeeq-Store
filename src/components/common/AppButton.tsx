import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle, StyleProp, View, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const getButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.onSecondaryContainer} />;
    }
    return (
      <Text style={[styles.text, theme.typography.button, { color: variant === 'primary' ? theme.colors.onPrimary : theme.colors.onSecondaryContainer }, textStyle]}>
        {title}
      </Text>
    );
  };

  if (variant === 'primary') {
    return (
      <Animated.View style={[
        styles.buttonWrapper, 
        { borderRadius: theme.radius.checkout },
        Platform.OS === 'ios' && theme.elevation.button,
        style,
        disabled && { opacity: 0.5 },
        animatedStyle
      ]}>
        <TouchableOpacity 
          onPress={onPress} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
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
      </Animated.View>
    );
  }

  const bgColor = variant === 'secondary' ? theme.colors.secondaryContainer : 'rgba(255, 255, 255, 0.2)';

  return (
    <Animated.View style={[animatedStyle, style, { borderRadius: theme.radius.card }]}>
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button, 
          { 
            borderRadius: theme.radius.card, 
            backgroundColor: bgColor,
            borderColor: theme.colors.border,
            borderWidth: variant === 'glass' ? 1 : 0,
          },
          disabled && { opacity: 0.5 }
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'glass' ? theme.colors.primary : (variant === 'primary' ? theme.colors.onPrimary : theme.colors.onSecondaryContainer)} />
        ) : (
          <Text style={[
            styles.text, 
            theme.typography.button, 
            { 
              color: variant === 'glass' ? theme.colors.primary : (variant === 'primary' ? theme.colors.onPrimary : theme.colors.onSecondaryContainer),
            }, 
            textStyle
          ]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
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