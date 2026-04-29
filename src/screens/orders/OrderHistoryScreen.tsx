import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { PriceTag } from '../../components/common/PriceTag';

export function OrderHistoryScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  const orders = [
    { id: 'TZ-98241', date: '٢٤ أبريل ٢٠٢٤', status: 'delivered', total: 85.00, items: 5 },
    { id: 'TZ-98120', date: '١٨ أبريل ٢٠٢٤', status: 'delivered', total: 120.50, items: 8 },
    { id: 'TZ-97900', date: '١٠ أبريل ٢٠٢٤', status: 'cancelled', total: 45.00, items: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return theme.colors.primary;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: isRTL ? 'right' : 'left', paddingHorizontal: 20 }]}>
          طلباتي
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Tracking')}>
            <GlassCard style={styles.orderCard}>
              <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[theme.typography.labelCaps, { color: getStatusColor(item.status) }]}>
                    {item.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                  </Text>
                </View>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{item.date}</Text>
              </View>

              <View style={[styles.cardBody, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.info, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>طلب #{item.id}</Text>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{item.items} منتجات</Text>
                </View>
                <PriceTag price={item.total} size="md" />
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
              
              <TouchableOpacity style={[styles.reorderBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary} />
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700', marginHorizontal: 8 }]}>إعادة طلب</Text>
              </TouchableOpacity>
            </GlassCard>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    alignItems: 'center',
    paddingTop: 20,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardBody: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.3,
  },
  reorderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
