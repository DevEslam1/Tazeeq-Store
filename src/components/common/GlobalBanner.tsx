import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectBanner, hideBanner } from '../../store/slices/uiSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { useRTL } from '../../hooks/useRTL';
import { BlurView } from 'expo-blur';

export function GlobalBanner() {
  const banner = useSelector(selectBanner);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useAppTheme();
  const { isRTL } = useRTL();
  
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // To prevent unmounting while animating out
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (banner.isVisible) {
      setShouldRender(true);
      
      // Clear existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Slide in animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: insets.top + 10,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();

      // Auto hide
      if (banner.duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, banner.duration);
      }
    } else {
      handleClose();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [banner.isVisible, banner.id]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShouldRender(false);
      if (banner.isVisible) dispatch(hideBanner());
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(insets.top + 10 + gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -20 || gestureState.vy < -0.5) {
          handleClose(); // Swipe up to dismiss
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: insets.top + 10,
            useNativeDriver: true,
            tension: 60,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  if (!shouldRender) return null;

  const getBannerStyles = () => {
    switch (banner.type) {
      case 'success':
        return { 
          icon: 'check-circle', 
          color: theme.colors.primary, 
          bgColor: mode === 'dark' ? 'rgba(20, 83, 45, 0.9)' : 'rgba(220, 252, 231, 0.95)' 
        };
      case 'error':
        return { 
          icon: 'alert-circle', 
          color: theme.colors.error, 
          bgColor: mode === 'dark' ? 'rgba(127, 29, 29, 0.9)' : 'rgba(254, 226, 226, 0.95)' 
        };
      case 'warning':
        return { 
          icon: 'alert', 
          color: '#D97706', 
          bgColor: mode === 'dark' ? 'rgba(120, 53, 15, 0.9)' : 'rgba(254, 243, 199, 0.95)' 
        };
      case 'info':
      default:
        return { 
          icon: 'information', 
          color: theme.colors.tertiary || '#3B82F6', 
          bgColor: mode === 'dark' ? 'rgba(30, 58, 138, 0.9)' : 'rgba(219, 234, 254, 0.95)' 
        };
    }
  };

  const styleConfig = getBannerStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <BlurView 
        intensity={80} 
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.blurContent,
          { 
            backgroundColor: styleConfig.bgColor,
            borderColor: styleConfig.color + '40', // 25% opacity border
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={styleConfig.icon as any} size={28} color={styleConfig.color} />
        </View>
        <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface, fontWeight: '600' }]}>
            {banner.message}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <MaterialCommunityIcons name="close" size={20} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 99,
  },
  blurContent: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    marginRight: 12,
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButton: {
    padding: 4,
    opacity: 0.7,
  },
});
