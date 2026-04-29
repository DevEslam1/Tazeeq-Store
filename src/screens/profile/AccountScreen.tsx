import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';

export function AccountScreen({ navigation }: any) {
  const { theme, isRTL, locale, setLocale } = useAppTheme();
  const { t } = useTranslation();

  const menuItems = [
    { icon: 'account-outline', title: 'الملف الشخصي', subtitle: 'تعديل بياناتك الشخصية' },
    { icon: 'map-marker-outline', title: 'عناويني', subtitle: 'إدارة مواقع التوصيل' },
    { icon: 'credit-card-outline', title: 'طرق الدفع', subtitle: 'البطاقات والمحافظ' },
    { icon: 'bell-outline', title: 'التنبيهات', subtitle: 'إعدادات الإشعارات' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=user' }} style={styles.avatar} />
          <Text style={[theme.typography.h1, { marginTop: 16 }]}>إسلام أحمد</Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>eslam@example.com</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <GlassCard style={{ padding: 16 }}>
                <View style={[styles.menuContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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
            style={[styles.menuContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
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

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.error, fontWeight: '700' }]}>تسجيل الخروج</Text>
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
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
