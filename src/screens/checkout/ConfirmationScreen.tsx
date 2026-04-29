import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useSelector } from 'react-redux';
import { selectActiveOrder } from '../../store/slices/orderSlice';
import { products } from '../../data/products';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ConfirmationScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const activeOrder = useSelector(selectActiveOrder);

  const orderItems = activeOrder?.cartItems?.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product;
  }).filter(Boolean) || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'اليوم';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successHeader}>
          <View style={[styles.iconBadge, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="check" size={48} color={theme.colors.onPrimary} />
          </View>
          <Text style={[theme.typography.h1, { color: theme.colors.primary, marginTop: 24 }]}>
            تم طلبك بنجاح!
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, marginTop: 8 }]}>
            رقم الطلب: {activeOrder?.id || '#TZ-00000'}
          </Text>
        </View>

        <GlassCard style={styles.infoCard}>
          <View style={[styles.infoRow, { flexDirection: 'row' }]}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
            <View style={[styles.infoText, { alignItems: 'flex-start' }]}>
              <Text style={theme.typography.bodySecondary}>وقت التوصيل المتوقع</Text>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>{formatDate(activeOrder?.estimatedDelivery)}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={[styles.infoRow, { flexDirection: 'row' }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color={theme.colors.primary} />
            <View style={[styles.infoText, { alignItems: 'flex-start' }]}>
              <Text style={theme.typography.bodySecondary}>عنوان التوصيل</Text>
              <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>{activeOrder?.address?.details || 'العنوان غير محدد'}</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={[theme.typography.h2, { marginVertical: 16 }]}>ملخص المنتجات</Text>
        <View style={styles.itemsPreview}>
          {orderItems.slice(0, 3).map((product, index) => (
            product && (
              <Image 
                key={index}
                source={{ uri: product.image }} 
                style={[styles.itemThumb, { borderColor: theme.colors.outlineVariant }]} 
              />
            )
          ))}
          {orderItems.length > 3 && (
            <View style={[styles.moreThumb, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
              <Text style={[theme.typography.bodySecondary, { fontWeight: '700' }]}>+{orderItems.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.totalRow}>
          <Text style={theme.typography.bodyMain}>الإجمالي</Text>
          <Text style={[theme.typography.h2, { color: theme.colors.primary }]}>{activeOrder?.total?.toFixed(2) || '0'} ر.س</Text>
        </View>

        <View style={styles.actions}>
          <AppButton 
            title="تتبع الطلب" 
            onPress={() => navigation.navigate('Order', { screen: 'Tracking', params: { orderId: activeOrder?.id } })} 
            style={styles.actionBtn}
          />
          <AppButton 
            title="العودة للرئيسية" 
            onPress={() => navigation.navigate('Main')} 
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
    paddingHorizontal: 20,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  actions: {
    gap: 16,
    marginBottom: 40,
  },
  actionBtn: {
    width: '100%',
  },
});
