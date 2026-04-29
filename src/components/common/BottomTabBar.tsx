import React from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';

function TabItem({ isFocused, onPress, icon, label, theme }: any) {
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.2 : 1, { damping: 12, stiffness: 100 }) }],
      opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
      transform: [{ translateY: withSpring(isFocused ? 0 : 2) }],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isFocused ? 5 : 0),
      height: withSpring(isFocused ? 5 : 0),
      opacity: withTiming(isFocused ? 1 : 0),
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={isFocused ? { selected: true } : {}}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedIconStyle}>
        <MaterialCommunityIcons 
          name={icon as any} 
          size={24} 
          color={isFocused ? theme.colors.primary : theme.colors.outline} 
        />
      </Animated.View>
      <Animated.Text style={[
        styles.tabLabel, 
        { 
          color: isFocused ? theme.colors.primary : theme.colors.outline, 
          fontWeight: isFocused ? '800' : '500',
        },
        animatedLabelStyle
      ]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.activeDot, { backgroundColor: theme.colors.primary }, animatedDotStyle]} />
    </TouchableOpacity>
  );
}

export function BottomTabBar({ state, descriptors, navigation }: any) {
  const { theme, mode } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <BlurView
        intensity={Platform.OS === 'android' ? 0 : 75}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.tabBarInner,
          {
            backgroundColor: theme.colors.surface + (Platform.OS === 'android' ? 'F0' : '90'),
            borderColor: theme.colors.border,
            shadowColor: theme.colors.primary,
          }
        ]}
      >
        <View style={styles.tabContent}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const getIcon = () => {
              switch (route.name) {
                case 'Shop': return isFocused ? 'storefront' : 'storefront-outline';
                case 'Organic': return isFocused ? 'leaf' : 'leaf';
                case 'Orders': return isFocused ? 'file-document' : 'file-document-outline';
                case 'Account': return isFocused ? 'account' : 'account-outline';
                default: return 'help';
              }
            };

            return (
              <TabItem 
                key={index}
                isFocused={isFocused}
                onPress={onPress}
                icon={getIcon()}
                label={t(`nav.${route.name.toLowerCase()}`)}
                theme={theme}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 20,
    right: 20,
    height: 80,
  },
  tabBarInner: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
});

