import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, selectAllOrders, selectOrderLoading } from '../../store/slices/orderSlice';
import { selectUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';
import { HeaderProgressBar } from '../../components/common/HeaderProgressBar';

export function OrderHistoryScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrderLoading);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [user?.id, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#10B981';
      case 'Processing': return '#3B82F6';
      case 'On the way': return '#F59E0B';
      case 'Placed': return '#6B7280';
      default: return theme.colors.primary;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
      <GlassCard style={styles.orderCard}>
        <View style={[styles.cardHeader, { flexDirection: flexRow }]}>
          <Text style={[theme.typography.bodyMain, { fontWeight: '700', textAlign: isRTL ? 'right' : 'left', color: theme.colors.onSurface }]}>{t('common.order')} #{item.id.slice(-6).toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[theme.typography.label, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
        
        <View style={[styles.cardBody, { flexDirection: flexRow }]}>
          <View style={styles.infoGroup}>
            <Text style={[theme.typography.label, { color: theme.colors.onSurfaceVariant }]}>{t('common.date')}</Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurface }]}>{item.date}</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={[theme.typography.label, { color: theme.colors.onSurfaceVariant }]}>{t('common.total')}</Text>
            <Text style={[theme.typography.bodyMain, { fontWeight: '700', color: theme.colors.primary, textAlign: isRTL ? 'right' : 'left' }]}>{item.total.toFixed(2)} {t('common.sar')}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.onPrimary }]}>{t('order.title')}</Text>
        <View style={{ width: 44 }} />
        <HeaderProgressBar loading={loading} color={theme.colors.onPrimary} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="package-variant" size={64} color={theme.colors.outlineVariant} />
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 16 }]}>{t('profile.no_previous_orders')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.shopNow}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{t('profile.shop_now')}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 8 },
  list: { padding: 16, paddingBottom: 40 },
  orderCard: { padding: 16, marginBottom: 16 },
  cardHeader: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  divider: { height: 1, marginVertical: 8 },
  cardBody: { justifyContent: 'space-between', marginTop: 8 },
  infoGroup: { flex: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  shopNow: { marginTop: 12, padding: 10 },
});
