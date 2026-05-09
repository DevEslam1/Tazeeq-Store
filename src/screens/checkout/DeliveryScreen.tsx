import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAddresses, selectAndSyncAddress, fetchAddresses } from '../../store/slices/addressSlice';
import { selectUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { darkMapStyle } from '../../constants/MapStyles';

export function DeliveryScreen({ navigation }: any) {
  const { theme, mode } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector(selectAllAddresses);
  const selectedAddressId = useSelector((state: any) => state.address.selectedAddressId);
  const user = useSelector(selectUser);
  
  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [addressName, setAddressName] = useState('');
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddresses(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion(newRegion);
      fetchAddress(newRegion.latitude, newRegion.longitude);
    })();
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=${isRTL ? 'ar' : 'en'}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddressName(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchAddress(newRegion.latitude, newRegion.longitude);
    }, 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('delivery.title')}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[theme.typography.h2, { marginBottom: 16, color: theme.colors.onSurface }]}>{t('delivery.saved_addresses')}</Text>
        
        {addresses.map((address) => (
          <TouchableOpacity 
            key={address.id} 
            onPress={() => user?.id && dispatch(selectAndSyncAddress({ userId: user.id, addressId: address.id }))}
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
                  <Text style={[theme.typography.bodyMain, { fontWeight: '700', color: theme.colors.onSurface }]}>{address.title}</Text>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{address.details}</Text>
                </View>
                {selectedAddressId === address.id && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
                )}
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.addNewButton, { flexDirection: 'row' }]}
          onPress={() => navigation.navigate('Profile', { screen: 'AddAddress' })}
        >
          <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
          <Text style={[theme.typography.bodyMain, { color: theme.colors.primary, fontWeight: '700', marginHorizontal: 8 }]}>
            {t('delivery.add_new')}
          </Text>
        </TouchableOpacity>

        <View style={styles.mapPreview}>
          <GlassCard style={styles.mapCard}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={onRegionChangeComplete}
              customMapStyle={mode === 'dark' ? darkMapStyle : []}
            >
              <Marker coordinate={region} pinColor={theme.colors.primary} />
            </MapView>
            <View style={styles.markerFixed} pointerEvents="none">
              <MaterialCommunityIcons name="map-marker" size={40} color={theme.colors.primary} />
            </View>
          </GlassCard>
          {addressName ? (
            <View style={[styles.addressBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="map-marker-check" size={16} color={theme.colors.primary} />
              <Text style={[theme.typography.meta, { color: theme.colors.onSurfaceVariant, marginStart: 8 }]} numberOfLines={1}>
                {addressName}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.form}>
          <Text style={[theme.typography.h2, { marginBottom: 16, color: theme.colors.onSurface }]}>{t('delivery.details') || 'تفاصيل إضافية'}</Text>
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
  map: {
    flex: 1,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: -10,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  form: {
    marginBottom: 100,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    height: 100,
    fontSize: 15,
    fontFamily: 'Cairo_400Regular',
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

