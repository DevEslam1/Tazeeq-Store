import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

export function BottomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  // RTL is handled by I18nManager.forceRTL(true) — use plain 'row'.

  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="light" style={styles.tabBarInner}>
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

            const color = isFocused ? theme.colors.primaryContainer : theme.colors.outline;

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
                {isFocused && <View style={[styles.activeDot, { backgroundColor: theme.colors.primaryContainer }]} />}
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
    backgroundColor: 'rgba(244, 251, 244, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    // Tinted ambient shadow
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
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
