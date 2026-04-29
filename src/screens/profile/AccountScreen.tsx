import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
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

  const menuItems = [
    { icon: 'account-outline', title: 'الملف الشخصي', subtitle: 'تعديل بياناتك الشخصية', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'map-marker-outline', title: 'عناويني', subtitle: 'إدارة مواقع التوصيل', onPress: () => navigation.navigate('AddressList') },
    { icon: 'heart-outline', title: 'المفضلة', subtitle: 'منتجاتك المفضلة', onPress: () => navigation.navigate('Wishlist') },
    { icon: 'credit-card-outline', title: 'طرق الدفع', subtitle: 'البطاقات والمحافظ', onPress: () => Alert.alert('قريباً', 'ستتوفر هذه الميزة قريباً') },
    { icon: 'bell-outline', title: 'التنبيهات', subtitle: 'إعدادات الإشعارات', onPress: () => navigation.navigate('Notifications') },
  ];

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="account" size={48} color="white" />
          </View>
          <Text style={[theme.typography.h1, { marginTop: 16 }]}>زائر</Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>سجل دخولك للحصول على ميزات أكثر</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <GlassCard style={{ padding: 16 }}>
                <View style={[styles.menuContent, { flexDirection: 'row' }]}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color="white" />
                  </View>
                  <View style={[styles.menuText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>{item.title}</Text>
                    <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{item.subtitle}</Text>
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

        <Text style={[theme.typography.h2, { marginHorizontal: 24, marginBottom: 16 }]}>الإعدادات</Text>
        <GlassCard style={{ marginHorizontal: 24, padding: 16 }}>
          <TouchableOpacity 
            onPress={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            style={[styles.menuContent, { flexDirection: 'row' }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
              <MaterialCommunityIcons name="translate" size={24} color="white" />
            </View>
            <View style={[styles.menuText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>اللغة</Text>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
                {locale === 'ar' ? 'العربية' : 'English'}
              </Text>
            </View>
            <MaterialCommunityIcons name="swap-horizontal" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </GlassCard>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={[theme.typography.bodyMain, { color: '#ef4444', fontWeight: '700' }]}>تسجيل الخروج</Text>
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
    borderColor: 'white',
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
  logoutBtn: {
    margin: 40,
    alignItems: 'center',
  },
});
