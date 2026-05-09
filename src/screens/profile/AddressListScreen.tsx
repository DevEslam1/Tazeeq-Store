import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAddresses, selectAndSyncAddress, fetchAddresses, selectAddressLoading } from '../../store/slices/addressSlice';
import { selectUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

import { useRTL } from '../../hooks/useRTL';

export function AddressListScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector(selectAllAddresses);
  const loading = useSelector(selectAddressLoading);
  const user = useSelector(selectUser);

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddresses(user.id));
    }
  }, [user?.id, dispatch]);

  const getIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    return titleLower.includes('منزل') || titleLower.includes('home') ? 'home' : 
           titleLower.includes('عمل') || titleLower.includes('work') || titleLower.includes('office') ? 'office-building' : 'map-marker';
  };

  const handleSelect = (id: string) => {
    if (user?.id) {
      dispatch(selectAndSyncAddress({ userId: user.id, addressId: id }));
    }
  };

  const renderItem = ({ item }: { item: typeof addresses[0] }) => (
    <GlassCard style={[styles.addressCard, item.selected && { borderWidth: 2, borderColor: theme.colors.secondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondaryContainer + '30' }]}>
        <MaterialCommunityIcons name={getIcon(item.title) as any} size={24} color={theme.colors.secondary} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface, fontWeight: '700' }]}>{item.title}</Text>
          {item.selected && (
            <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} style={styles.checkIcon} />
          )}
        </View>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }]}>{item.details}</Text>
        <Text style={[theme.typography.label, { color: theme.colors.onSurfaceVariant, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }]}>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => handleSelect(item.id)}>
        <MaterialCommunityIcons name={item.selected ? 'radiobox-marked' : 'radiobox-blank'} size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.onPrimary }]}>{t('profile.my_addresses')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
              <MaterialCommunityIcons name="map-marker-off-outline" size={64} color={theme.colors.outlineVariant} />
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 16 }]}>
                {t('profile.no_addresses') || 'لا توجد عناوين مسجلة'}
              </Text>
            </View>
          )
        }
      />

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, paddingBottom: insets.bottom + 20, borderTopColor: theme.colors.border, borderTopWidth: 1 }]}>
        <AppButton
          title={t('profile.add_new_address')}
          onPress={() => navigation.navigate('AddAddress')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { padding: 8 },
  list: { padding: 16, paddingBottom: 100 },
  addressCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 16, gap: 12 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { marginStart: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
});
