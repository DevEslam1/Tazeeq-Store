import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';

export function ConfirmationScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.successHeader}>
          <View style={[styles.iconBadge, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="check" size={48} color="white" />
          </View>
          <Text style={[theme.typography.h1, { color: theme.colors.primary, marginTop: 24 }]}>
            تم طلبك بنجاح!
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginTop: 8 }]}>
            رقم الطلب: #TZ-98241
          </Text>
        </View>

        <GlassCard style={styles.infoCard}>
          <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
            <View style={[styles.infoText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={theme.typography.bodySecondary}>وقت التوصيل المتوقع</Text>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>اليوم، ١٠:٣٠ م - ١١:٠٠ م</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color={theme.colors.primary} />
            <View style={[styles.infoText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={theme.typography.bodySecondary}>عنوان التوصيل</Text>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>حي الصحافة، شارع الملك فهد، الرياض</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={[theme.typography.h2, { marginVertical: 16 }]}>ملخص المنتجات</Text>
        <View style={styles.itemsPreview}>
          {[1, 2, 3].map((i) => (
            <Image 
              key={i}
              source={{ uri: `https://images.unsplash.com/photo-${1591189863430 + i}?q=80&w=100&auto=format&fit=crop` }} 
              style={[styles.itemThumb, { borderColor: theme.colors.outlineVariant }]} 
            />
          ))}
          <View style={[styles.moreThumb, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
            <Text style={[theme.typography.bodySecondary, { fontWeight: '700' }]}>+٢</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton 
            title="تتبع الطلب" 
            onPress={() => navigation.navigate('Tracking')} 
            style={styles.actionBtn}
          />
          <AppButton 
            title="العودة للرئيسية" 
            onPress={() => navigation.navigate('Home')} 
            variant="glass"
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginHorizontal: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.3,
  },
  itemsPreview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  itemThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
  },
  moreThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 16,
    marginBottom: 40,
  },
  actionBtn: {
    width: '100%',
  },
});
