import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useBanner } from '../../hooks/useBanner';
import { seedDatabase } from '../../services/seedData';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AccountScreen({ navigation }: any) {
  const { theme, isRTL, locale, setLocale } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const user = useSelector((state: any) => state.auth.user);

  const { showSuccess, showError } = useBanner();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    Alert.alert(
      'Seed Database',
      'Are you sure you want to seed the database? This will overwrite existing products/categories with original IDs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Seed',
          onPress: async () => {
            setIsSeeding(true);
            const success = await seedDatabase();
            setIsSeeding(false);

            if (success) {
              showSuccess('Database seeded successfully!');
              return;
            }

            showError('Failed to seed database.');
          },
        },
      ]
    );
  };
  
  const menuItems = [
    { icon: 'account-outline', title: t('profile.edit_profile'), subtitle: t('profile.edit_profile_desc'), onPress: () => navigation.navigate('EditProfile') },
    { icon: 'package-variant-closed', title: t('profile.my_orders'), subtitle: t('profile.my_orders_desc'), onPress: () => navigation.navigate('OrderHistory') },
    { icon: 'map-marker-outline', title: t('profile.my_addresses'), subtitle: t('profile.my_addresses_desc'), onPress: () => navigation.navigate('AddressList') },
    { icon: 'heart-outline', title: t('profile.favorites'), subtitle: t('profile.favorites_desc'), onPress: () => navigation.navigate('Wishlist') },
    { icon: 'credit-card-outline', title: t('profile.payment_methods'), subtitle: t('profile.payment_methods_desc'), onPress: () => Alert.alert(t('common.coming_soon'), t('common.feature_coming_soon')) },
    { icon: 'bell-outline', title: t('profile.notifications'), subtitle: t('profile.notifications_desc'), onPress: () => navigation.navigate('Notifications') },
    { icon: 'cog-outline', title: t('profile.settings'), subtitle: t('profile.settings_desc'), onPress: () => navigation.navigate('Settings') },
  ];

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logout_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary, borderColor: theme.colors.border }]}>
            <MaterialCommunityIcons name="account" size={48} color={theme.colors.onPrimary} />
          </View>
          <Text style={[theme.typography.h1, { marginTop: 16, color: theme.colors.onSurface }]}>
            {user?.name || t('profile.guest')}
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>
            {user?.email || t('profile.login_prompt')}
          </Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <GlassCard style={{ padding: 16 }}>
                <View style={[styles.menuContent, { flexDirection: 'row' }]}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color={theme.colors.primary} />
                  </View>
                  <View style={[styles.menuText, { alignItems: 'flex-start' }]}>
                    <Text style={[theme.typography.bodyMain, { fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }]}>{item.title}</Text>
                    <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, textAlign: isRTL ? 'right' : 'left' }]}>{item.subtitle}</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={isRTL ? 'chevron-left' : 'chevron-right'} 
                    size={24} 
                    color={theme.colors.outlineVariant} 
                  />
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>



        <TouchableOpacity
          onPress={handleSeed}
          disabled={isSeeding}
          style={[styles.seedButton, { backgroundColor: theme.colors.surfaceContainerHigh, borderColor: theme.colors.primary }]}
        >
          {isSeeding ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <MaterialCommunityIcons name="database-import" size={20} color={theme.colors.primary} />
              <Text style={[theme.typography.itemName, { color: theme.colors.primary, marginStart: 8 }]}>Seed Firebase Data</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.error, fontWeight: '700' }]}>{t('profile.logout')}</Text>
        </TouchableOpacity>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  menu: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    marginHorizontal: 16,
  },
  seedButton: {
    marginHorizontal: 24,
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    margin: 40,
    alignItems: 'center',
  },
});

