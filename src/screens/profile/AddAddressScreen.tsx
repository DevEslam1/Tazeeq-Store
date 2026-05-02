import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { addNewAddress } from '../../store/slices/addressSlice';
import { selectUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../hooks/useRTL';


export function AddAddressScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);

  const addressTypes = [t('address.home'), t('address.work'), t('address.other')];
  const cities = [t('address.riyadh'), t('address.jeddah'), t('address.dammam'), t('address.khobar'), t('address.makkah'), t('address.madinah')];

  const [type, setType] = useState(addressTypes[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');

  const handleSave = () => {
    if (!user?.id) return;

    const addressData = {
      title: type,
      details: `${city} - ${street} - ${building}`,
      phone: phone || '+966501234567',
      city: city,
      selected: false,
    };
    
    dispatch(addNewAddress({ userId: user.id, address: addressData }));
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white' }]}>{t('profile.add_new_address')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.card}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.address_type')}</Text>
          <View style={[styles.typeRow, { flexDirection: 'row' }]}>
            {addressTypes.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.typeButton,
                  { backgroundColor: type === item ? theme.colors.primary : theme.colors.surfaceContainerLow },
                ]}
                onPress={() => setType(item)}
              >
                <Text style={[theme.typography.bodySecondary, { color: type === item ? 'white' : theme.colors.onSurface }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('auth.name')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
              value={name}
              onChangeText={setName}
              placeholder={t('auth.name')}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('auth.phone')}</Text>
            <View style={[styles.phoneInput, { backgroundColor: theme.colors.surfaceContainerLow, flexDirection: 'row' }]}>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline }]}>+966</Text>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="5xxxxxxxx"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.city')}</Text>
            <View style={[styles.picker, { backgroundColor: theme.colors.surfaceContainerLow, flexDirection: 'row' }]}>
              {cities.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cityOption, c === city && { backgroundColor: theme.colors.primary + '20' }]}
                  onPress={() => setCity(c)}
                >
                  <Text style={[theme.typography.bodySecondary, { color: c === city ? theme.colors.primary : theme.colors.onSurface }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.street')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
              value={street}
              onChangeText={setStreet}
              placeholder={t('address.street')}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
          </View>

          <View style={[styles.row, { flexDirection: 'row' }]}>
            <View style={[styles.inputGroup, { flex: 1, marginEnd: 8 }]}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.building')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
                value={building}
                onChangeText={setBuilding}
                placeholder={t('address.building')}
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.floor')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
                value={floor}
                onChangeText={setFloor}
                placeholder={t('address.floor')}
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }]}>{t('address.apartment')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}
              value={apartment}
              onChangeText={setApartment}
              placeholder={t('address.apartment')}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
          </View>
        </GlassCard>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, paddingBottom: insets.bottom + 20, borderTopColor: theme.colors.border, borderTopWidth: 1 }]}>
        <AppButton title={t('common.save')} onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 16 },
  backButton: { padding: 8 },
  content: { padding: 16, paddingBottom: 100 },
  card: { padding: 20 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  typeButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  inputGroup: { marginBottom: 16 },
  input: { height: 56, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  phoneInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 12 },
  picker: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, borderRadius: 12, gap: 8 },
  cityOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  row: { flexDirection: 'row', gap: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
});
