import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { useCart } from '../../hooks/useCart';
import { useRTL } from '../../hooks/useRTL';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Move CartItem outside to prevent hook violation and unnecessary re-renders
const CartItem = ({ item, index, theme, t, updateQty, removeFromCart }: any) => {
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 70).duration(300)}
      style={[
        styles.itemCard,
        theme.elevation.card,
        { 
          backgroundColor: theme.colors.surfaceContainerLowest, 
          borderColor: theme.colors.border,
        }
      ]}
    >
      <View style={styles.itemContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.image }]}>
          <Text style={styles.emojiFallback}>🥬</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={[theme.typography.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 10 }]}>{item.weight || t('cart.one_unit')} • {t('cart.fresh_daily')}</Text>
          <View style={styles.itemFooter}>
            <View style={[styles.stepper, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.stepper }]}>
              <TouchableOpacity 
                style={styles.stepperButton}
                onPress={() => updateQty(item.cartId, Math.max(1, item.quantity - 1))}
              >
                <MaterialCommunityIcons name="minus" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={[theme.typography.itemName, { color: theme.colors.primary, marginHorizontal: 12, minWidth: 24, textAlign: 'center' }]}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.stepperButton}
                onPress={() => updateQty(item.cartId, item.quantity + 1)}
              >
                <MaterialCommunityIcons name="plus" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[theme.typography.price, { color: theme.colors.primary }]}>{(item.price * item.quantity).toFixed(2)} {t('common.currency')}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.deleteButton, { borderColor: theme.colors.errorContainer, backgroundColor: theme.colors.errorContainer + '40', borderRadius: theme.radius.deleteButton }]}
          onPress={() => removeFromCart(item.cartId)}
        >
          <MaterialCommunityIcons name="trash-can" size={15} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export function CartScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { items, total, removeFromCart, updateQty } = useCart();

  const cartProducts = items.map(item => {
    const product = item.productSnapshot || products.find(p => p.id === item.productId);
    return {
      ...product,
      id: item.productId,
      quantity: item.quantity,
      cartId: item.productId,
    };
  }).filter(p => p.id);

  const deliveryFee = 15.00;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity style={[styles.backButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[theme.typography.pageTitle, { color: theme.colors.primary }]}>🛒 {t('cart.title')}</Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[theme.typography.badge, { color: theme.colors.primary }]}>0 {t('cart.items_unit')}</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="cart-off" size={80} color={theme.colors.outlineVariant} />
          <Text style={[theme.typography.h2, { marginTop: 20, color: theme.colors.onSurface }]}>{t('cart.empty')}</Text>
          <AppButton 
            title={t('common.browse_products')}
            onPress={() => navigation.navigate('Main')}
            style={{ marginTop: 20, width: 200 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={[styles.backButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.pageTitle, { color: theme.colors.primary }]}>🛒 {t('cart.title')}</Text>
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={[theme.typography.badge, { color: theme.colors.primary }]}>{items.length} {t('cart.items_unit')}</Text>
        </View>
      </View>

      <FlatList
        data={cartProducts}
        keyExtractor={(item) => item.cartId}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 80, paddingBottom: 260 }]}
        renderItem={({ item, index }) => (
          <CartItem 
            item={item} 
            index={index} 
            theme={theme} 
            t={t} 
            updateQty={updateQty} 
            removeFromCart={removeFromCart} 
          />
        )}
        ListFooterComponent={
          <TouchableOpacity style={[styles.addMoreCard, { borderColor: theme.colors.border, borderRadius: theme.radius.card }]}>
            <View style={[styles.addMoreIcon, { backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.deleteButton }]}>
              <MaterialCommunityIcons name="plus" size={18} color={theme.colors.primary} />
            </View>
            <Text style={[theme.typography.bodyMain, { fontWeight: '600', color: theme.colors.primary }]}>{t('cart.add_more')}</Text>
          </TouchableOpacity>
        }
      />

      <View style={[styles.summary, theme.elevation.panel, { backgroundColor: theme.colors.surface, paddingBottom: insets.bottom + 20, borderTopLeftRadius: theme.radius.summary, borderTopRightRadius: theme.radius.summary, borderTopColor: theme.colors.border }]}>
        <View style={[styles.promoBanner, { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.secondary, borderRadius: theme.radius.promo }]}>
          <Text style={{ fontSize: 22 }}>🏷️</Text>
          <Text style={[theme.typography.bodySecondary, { flex: 1, marginHorizontal: 10, fontWeight: '600', color: theme.colors.primary }]}>{t('cart.promo_code')}</Text>
          <MaterialCommunityIcons name="chevron-left" size={16} color={theme.colors.primary} />
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>{t('cart.subtotal')}</Text>
          <Text style={[theme.typography.meta, { color: theme.colors.onSurface }]}>{total.toFixed(2)} {t('common.currency')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>{t('cart.delivery_fee')}</Text>
          <Text style={[theme.typography.meta, { color: theme.colors.secondary }]}>{deliveryFee.toFixed(2)} {t('common.currency')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.totalRow}>
          <Text style={[theme.typography.price, { color: theme.colors.onSurface }]}>{t('cart.total')}</Text>
          <Text style={[theme.typography.priceLarge, { color: theme.colors.primary }]}>{grandTotal.toFixed(2)} {t('common.currency')}</Text>
        </View>
        <AppButton 
          title={t('common.checkout') + " →"} 
          onPress={() => navigation.navigate('Checkout', { screen: 'Delivery' })} 
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  list: { padding: 20 },
  itemCard: {
    marginBottom: 14,
    borderWidth: 1,
    padding: 16,
    borderRadius: 20,
  },
  itemContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  imageContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiFallback: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepperButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginStart: 4,
  },
  addMoreCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  addMoreIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 14,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  divider: { height: 1, marginVertical: 14 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkoutButton: {
    width: '100%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
});
