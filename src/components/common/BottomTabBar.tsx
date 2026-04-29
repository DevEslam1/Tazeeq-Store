import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

export function BottomTabBar({ state, descriptors, navigation }: any) {
  const { theme, mode } = useAppTheme();
  const { t } = useTranslation();

  // RTL is handled by I18nManager.forceRTL(true) — use plain 'row'.

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

            const color = isFocused ? theme.colors.primary : theme.colors.outline;

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.tabItem}
                accessibilityRole="tab"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <MaterialCommunityIcons 
                  name={getIcon() as any} 
                  size={26} 
                  color={color} 
                />
                <Text style={[
                  styles.tabLabel, 
                  { 
                    color, 
                    fontWeight: isFocused ? '800' : '500',
                  }
                ]}>
                  {t(`nav.${route.name.toLowerCase()}`)}
                </Text>
                {isFocused && <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />}
              </TouchableOpacity>
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

