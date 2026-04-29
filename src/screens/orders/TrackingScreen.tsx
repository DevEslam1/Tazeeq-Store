import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { darkMapStyle } from '../../constants/MapStyles';

export function TrackingScreen({ navigation }: any) {
  const { theme, isRTL, mode } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [region] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const driverPos = { latitude: 24.7200, longitude: 46.6800 };
  const destinationPos = { latitude: 24.7136, longitude: 46.6753 };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          customMapStyle={mode === 'dark' ? darkMapStyle : []}
        >
          <Marker coordinate={destinationPos} title="منزلك">
            <View style={[styles.markerContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]}>
              <MaterialCommunityIcons name="home" size={20} color={theme.colors.primary} />
            </View>
          </Marker>
          <Marker coordinate={driverPos} title="المندوب">
            <View style={[styles.markerContainer, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="moped" size={20} color="white" />
            </View>
          </Marker>
          <Polyline 
            coordinates={[driverPos, destinationPos]} 
            strokeWidth={3} 
            strokeColor={theme.colors.primary} 
            lineDashPattern={[1, 5]}
          />
        </MapView>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[
            styles.backButton, 
            { 
              backgroundColor: theme.colors.surface,
              top: insets.top + 16,
              [isRTL ? 'right' : 'left']: 20
            }
          ]}
        >
          <MaterialCommunityIcons 
            name={isRTL ? 'arrow-left' : 'arrow-right'} 
            size={28} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>

        <View style={styles.etaContainer}>
          <GlassCard style={styles.etaCard}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>يصل خلال</Text>
            <Text style={[theme.typography.h1, { color: theme.colors.primary }]}>١٨ دقيقة</Text>
          </GlassCard>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.stepper, { flexDirection: 'row' }]}>
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <View style={[styles.stepDot, { backgroundColor: step <= 3 ? theme.colors.primary : theme.colors.outlineVariant }]} />
              {step < 4 && <View style={[styles.stepLine, { backgroundColor: step < 3 ? theme.colors.primary : theme.colors.outlineVariant }]} />}
            </React.Fragment>
          ))}
        </View>
        <View style={[styles.stepLabels, { flexDirection: 'row' }]}>
          <Text style={[theme.typography.labelCaps, { color: theme.colors.primary }]}>تم الطلب</Text>
          <Text style={[theme.typography.labelCaps, { color: theme.colors.primary }]}>تجهيز</Text>
          <Text style={[theme.typography.labelCaps, { color: theme.colors.primary }]}>في الطريق</Text>
          <Text style={[theme.typography.labelCaps, { color: theme.colors.outline }]}>وصل</Text>
        </View>

        <GlassCard style={styles.driverCard}>
          <View style={[styles.driverInfo, { flexDirection: 'row' }]}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=driver' }} style={styles.driverAvatar} />
            <View style={[styles.driverText, { alignItems: 'flex-start' }]}>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>محمد مبروك</Text>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>مندوب توصيل • ٤.٩ ★</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="phone" size={24} color={theme.colors.onPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIcon, { backgroundColor: theme.colors.secondary }]}>
                <MaterialCommunityIcons name="message-text" size={24} color={theme.colors.onSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  etaContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  etaCard: {
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  stepper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  stepLabels: {
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  driverCard: {
    padding: 16,
  },
  driverInfo: {
    alignItems: 'center',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  driverText: {
    flex: 1,
    marginHorizontal: 16,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

