import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TrackingScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.mapContainer}>
        {/* Mock Map */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop' }} 
          style={styles.map} 
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: 'white' }]}>
          <MaterialCommunityIcons name="arrow-right" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.etaContainer}>
          <GlassCard style={styles.etaCard}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>يصل خلال</Text>
            <Text style={[theme.typography.h1, { color: theme.colors.primary }]}>١٨ دقيقة</Text>
          </GlassCard>
        </View>
      </View>

      <View style={styles.content}>
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
              <TouchableOpacity style={[styles.actionIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                <MaterialCommunityIcons name="phone" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                <MaterialCommunityIcons name="message-text" size={24} color="white" />
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
    top: 16,
    left: 20,
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
});
