import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';

export function SettingsScreen({ navigation }: any) {
  const { theme, isRTL, locale, setLocale, isDark, toggleTheme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { flexRow } = useRTL();

  const SettingItem = ({ icon, title, subtitle, value, onValueChange, type = 'switch', onPress }: any) => (
    <GlassCard style={styles.settingCard}>
      <TouchableOpacity 
        style={[styles.settingContent, { flexDirection: 'row' }]} 
        onPress={onPress}
        disabled={type === 'switch'}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={[styles.textContainer, { alignItems: 'flex-start' }]}>
          <Text style={[theme.typography.bodyMain, { fontWeight: '700', textAlign: isRTL ? 'right' : 'left', color: theme.colors.onSurface }]}>{title}</Text>
          {subtitle && <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, textAlign: isRTL ? 'right' : 'left' }]}>{subtitle}</Text>}
        </View>
        {type === 'switch' ? (
          <Switch 
            value={value} 
            onValueChange={onValueChange}
            trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary + '80' }}
            thumbColor={value ? theme.colors.primary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        ) : (
          <MaterialCommunityIcons 
            name={isRTL ? 'chevron-left' : 'chevron-right'} 
            size={24} 
            color={theme.colors.outlineVariant} 
          />
        )}
      </TouchableOpacity>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('settings.title') || 'الإعدادات'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.outline, textAlign: isRTL ? 'right' : 'left' }]}>{t('settings.appearance')}</Text>
        <SettingItem 
          icon="brightness-4" 
          title={t('settings.dark_mode')} 
          subtitle={t('settings.dark_mode_desc')} 
          value={isDark} 
          onValueChange={toggleTheme} 
        />
        
        <SettingItem 
          icon="translate" 
          title={t('settings.language')} 
          subtitle={locale === 'ar' ? 'العربية' : 'English'} 
          type="chevron"
          onPress={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.outline, textAlign: isRTL ? 'right' : 'left', marginTop: 24 }]}>{t('settings.notifications')}</Text>
        <SettingItem 
          icon="bell-outline" 
          title={t('settings.promo_notifications')} 
          subtitle={t('settings.promo_notifications_desc')} 
          value={true} 
          onValueChange={() => {}} 
        />
        <SettingItem 
          icon="truck-delivery-outline" 
          title={t('settings.order_status')} 
          subtitle={t('settings.order_status_desc')} 
          value={true} 
          onValueChange={() => {}} 
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.outline, textAlign: isRTL ? 'right' : 'left', marginTop: 24 }]}>{t('settings.legal')}</Text>
        <SettingItem 
          icon="shield-check-outline" 
          title={t('settings.privacy_policy')} 
          type="chevron"
          onPress={() => {}}
        />
        <SettingItem 
          icon="file-document-outline" 
          title={t('settings.terms')} 
          type="chevron"
          onPress={() => {}}
        />

        <View style={styles.footer}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outlineVariant }]}>{t('settings.app_version', { version: '2.2.0' })}</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outlineVariant, marginTop: 4 }]}>Tazeeq © 2026</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    marginBottom: 12,
    padding: 12,
  },
  settingContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
});

