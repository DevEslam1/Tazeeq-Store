import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { PriceTag } from '../../components/common/PriceTag';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllOrders } from '../../store/slices/orderSlice';
import { useCart } from '../../hooks/useCart';
import { addItem } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OrderHistoryScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const orders = useSelector(selectAllOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return theme.colors.primary;
      case 'On the way': return theme.colors.secondary;
      case 'Processing': return theme.colors.tertiary;
      case 'Placed': return theme.colors.primaryContainer;
      case 'Cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Delivered': return 'تم التوصيل';
      case 'On the way': return 'في الطريق';
      case 'Processing': return 'قيد التجهيز';
      case 'Placed': return 'تم الطلب';
      case 'Cancelled': return 'ملغي';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleReorder = (order: any) => {
    order.cartItems?.forEach((item: any) => {
      addToCart(item.productId, item.quantity);
    });
    navigation.navigate('Checkout', { screen: 'Cart' });
  };

  const displayOrders = orders.length > 0 ? orders : [
    { id: 'TZ-98241', date: new Date().toISOString(), status: 'Delivered', total: 85, items: 5 },
    { id: 'TZ-98120', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', total: 120.50, items: 8 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: 'row', paddingTop: insets.top + 10 }]}>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'left', paddingHorizontal: 20 }]}>
          طلباتي
        </Text>
      </View>

      <FlatList
        data={displayOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Tracking', { orderId: item.id })}>
            <GlassCard style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[theme.typography.labelCaps, { color: getStatusColor(item.status) }]}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{formatDate(item.date)}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.info}>
                  <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>طلب #{item.id}</Text>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{item.items} منتجات</Text>
                </View>
                <PriceTag price={item.total} size="md" />
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
              
              <TouchableOpacity 
                style={styles.reorderBtn}
                onPress={() => handleReorder(item)}
              >
                <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary} />
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700', marginHorizontal: 8 }]}>إعادة طلب</Text>
              </TouchableOpacity>
            </GlassCard>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="receipt" size={64} color={theme.colors.outlineVariant} />
            <Text style={[theme.typography.bodyMain, { color: theme.colors.outlineVariant, marginTop: 16 }]}>لا توجد طلبات سابقة</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});
