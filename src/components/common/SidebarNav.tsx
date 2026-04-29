import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function SidebarNav({ navigation, state }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  const menuItems = [
    { name: 'Shop', icon: 'storefront' },
    { name: 'Categories', icon: 'view-grid' },
    { name: 'Orders', icon: 'receipt' },
    { name: 'Wishlist', icon: 'heart' },
    { name: 'Account', icon: 'account' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceContainerLow, borderRightWidth: isRTL ? 0 : 1, borderLeftWidth: isRTL ? 1 : 0, borderColor: theme.colors.outlineVariant }]}>
      <View style={styles.header}>
        <Text style={[theme.typography.h1, { color: theme.colors.primary }]}>Tazeeq</Text>
        <Text style={[theme.typography.labelCaps, { color: theme.colors.secondaryContainer }]}>Elite Member</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.name}
            style={[styles.menuItem, { flexDirection: 'row' }]}
          >
            <MaterialCommunityIcons name={item.icon as any} size={24} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.menuText, theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginStart: 16 }]}>
              {t(`nav.${item.name.toLowerCase()}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <View style={{ marginStart: 12 }}>
          <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>Eslam</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>eslam@example.com</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: '100%',
    padding: 24,
  },
  header: {
    marginBottom: 48,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  menuText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
