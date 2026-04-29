import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

export function BottomTabBar({ state, descriptors, navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="light" style={styles.tabBarInner}>
        <View style={[styles.tabContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
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
              >
                <MaterialCommunityIcons 
                  name={getIcon() as any} 
                  size={28} 
                  color={color} 
                />
                <Text style={[
                  theme.typography.labelCaps, 
                  { color, marginTop: 4, fontSize: 11, fontWeight: isFocused ? '800' : '500', letterSpacing: 0.8 }
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
    bottom: 24,
    left: 20,
    right: 20,
    height: 90,
  },
  tabBarInner: {
    flex: 1,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: -4,
  },
});
