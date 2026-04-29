import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAddresses, selectAddress } from '../../store/slices/addressSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../hooks/useRTL';

export function DeliveryScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector(selectAllAddresses);
  const selectedAddressId = useSelector((state: any) => state.address.selectedAddressId);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('delivery.title') || 'معلومات التوصيل'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[theme.typography.h2, { marginBottom: 16 }]}>{t('delivery.saved_addresses') || 'العناوين المحفوظة'}</Text>
        
        {addresses.map((address) => (
          <TouchableOpacity 
            key={address.id} 
            onPress={() => dispatch(selectAddress(address.id))}
            style={styles.addressWrapper}
          >
            <GlassCard 
              style={[
                styles.addressCard,
                selectedAddressId === address.id && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              intensity={selectedAddressId === address.id ? 30 : 15}
            >
              <View style={[styles.addressContent, { flexDirection: 'row' }]}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                  <MaterialCommunityIcons name={address.title === 'المنزل' ? 'home' : 'office-building' as any} size={24} color={theme.colors.primary} />
                </View>
                <View style={[styles.addressInfo, { alignItems: 'flex-start', flex: 1 }]}>
                  <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>{address.title}</Text>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{address.details}</Text>
                </View>
                {selectedAddressId === address.id && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
                )}
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.addNewButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
          <Text style={[theme.typography.bodyMain, { color: theme.colors.primary, fontWeight: '700', marginHorizontal: 8 }]}>
            {t('delivery.add_new') || 'إضافة عنوان جديد'}
          </Text>
        </TouchableOpacity>

        <View style={styles.mapPreview}>
          <GlassCard style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <MaterialCommunityIcons name="map-marker-radius" size={48} color={theme.colors.primary} />
              <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginTop: 12 }]}>
                {t('delivery.map_preview') || 'معاينة الموقع على الخريطة'}
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.form}>
          <Text style={[theme.typography.h2, { marginBottom: 16 }]}>{t('delivery.details') || 'تفاصيل إضافية'}</Text>
          <TextInput 
            placeholder={t('delivery.notes') || 'ملاحظات للمندوب (رقم الشقة، علامة مميزة...)'}
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surfaceContainerLowest, borderTopColor: theme.colors.outlineVariant }]}>
        <AppButton 
          title={t('common.next') || 'التالي: الدفع'} 
          onPress={() => navigation.navigate('Payment')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  addressWrapper: {
    marginBottom: 16,
  },
  addressCard: {
    padding: 16,
  },
  addressContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  addNewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
    padding: 12,
  },
  mapPreview: {
    marginBottom: 32,
  },
  mapCard: {
    height: 200,
    padding: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    marginBottom: 100,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
  },
});
