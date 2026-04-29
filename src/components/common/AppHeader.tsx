import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../hooks/useCart';
import { useRTL } from '../../hooks/useRTL';

export function AppHeader() {
  const { theme, locale } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  return (
    <View style={[styles.outerContainer, { marginTop: insets.top + 4 }]}>
      <BlurView intensity={40} tint="light" style={[styles.blurContainer, theme.elevation.panel, { backgroundColor: 'rgba(244, 249, 246, 0.9)', borderRadius: theme.radius.card }]}>
        <View style={[styles.topRow, { flexDirection: flexRow }]}>
          <TouchableOpacity style={[styles.actionButton, { borderRadius: theme.radius.headerButton }]} accessibilityLabel="القائمة">
            <MaterialCommunityIcons name="menu" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.logo, { color: theme.colors.primary }]}>
            {appName}
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { borderRadius: theme.radius.headerButton }]} 
              accessibilityLabel="الإشعارات"
              onPress={() => navigation.navigate('Notifications')}
            >
              <View>
                <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.primary} />
                <View style={[styles.notifDot, { backgroundColor: theme.colors.tertiary }]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { borderRadius: theme.radius.headerButton }]}
              onPress={() => navigation.navigate('Checkout', { screen: 'Cart' })}
              accessibilityLabel="سلة التسوق"
            >
              <View>
                <MaterialCommunityIcons name="cart-outline" size={24} color={theme.colors.primary} />
                {itemCount > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
          <TouchableOpacity
            style={[styles.searchBar, { borderColor: theme.colors.border, backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.full }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Search')}
          >
            <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginHorizontal: 10 }]}>
              {t('home.search_placeholder', { defaultValue: 'بحث عن خضروات، بقالة...' })}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    marginHorizontal: 16,
  },
  blurContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 237, 233, 0.5)',
  },
  topRow: {
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontWeight: '800',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(244, 249, 246, 0.9)',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
});