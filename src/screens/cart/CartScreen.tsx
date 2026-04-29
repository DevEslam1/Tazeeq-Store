import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PriceTag } from '../../components/common/PriceTag';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';

export function CartScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  // Mock cart items
  const cartItems = [
    { productId: '1', quantity: 2 },
    { productId: '3', quantity: 1 },
  ];

  const cartProducts = cartItems.map(item => ({
    ...products.find(p => p.id === item.productId)!,
    quantity: item.quantity,
  }));

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('cart.title')}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={cartProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GlassCard style={styles.itemCard}>
            <View style={[styles.itemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={[styles.itemInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[theme.typography.bodyMain, { fontWeight: '700' }]}>{item.name}</Text>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>{item.weight}</Text>
                <View style={[styles.itemFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <PriceTag price={item.price} size="md" />
                  <View style={[styles.stepper, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity style={styles.stepperButton}>
                      <MaterialCommunityIcons name="minus" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Text style={[theme.typography.bodyMain, { marginHorizontal: 12 }]}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.stepperButton}>
                      <MaterialCommunityIcons name="plus" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteButton}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}
      />

      <View style={styles.summary}>
        <Text style={[theme.typography.h2, { marginBottom: 16 }]}>{t('cart.summary')}</Text>
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[theme.typography.bodyMain]}>{t('cart.subtotal')}</Text>
          <PriceTag price={subtotal} size="md" />
        </View>
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[theme.typography.bodyMain]}>{t('cart.delivery_fee')}</Text>
          <PriceTag price={deliveryFee} size="md" />
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[theme.typography.h2]}>{t('cart.total')}</Text>
          <PriceTag price={total} size="lg" />
        </View>
        <AppButton 
          title={t('common.checkout')} 
          onPress={() => {}} 
          style={{ marginTop: 24 }}
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
    height: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
  },
  itemCard: {
    marginBottom: 16,
    padding: 12,
  },
  itemContent: {
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  itemFooter: {
    marginTop: 8,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  stepperButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
  },
  summary: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  summaryRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
});
