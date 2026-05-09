import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useCart } from '../../hooks/useCart';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedAddress } from '../../store/slices/addressSlice';
import { createNewOrder, selectOrderLoading } from '../../store/slices/orderSlice';
import { selectUser } from '../../store/slices/authSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';

export function PaymentScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const { items, total } = useCart();
  const address = useSelector(selectSelectedAddress);
  const user = useSelector(selectUser);
  const isOrdering = useSelector(selectOrderLoading);

  const paymentMethods = [
    { id: 'card', title: t('payment.credit_card'), icon: 'credit-card-outline' },
    { id: 'apple', title: t('payment.apple_pay'), icon: 'apple' },
    { id: 'wallet', title: t('payment.tazeeq_wallet'), icon: 'wallet-outline' },
  ];

  const handleConfirm = async () => {
    if (!user?.id) return;

    const orderData: any = {
      status: 'Placed' as const,
      total: total,
      date: new Date().toISOString(),
      items: items.reduce((sum, item) => sum + item.quantity, 0),
      cartItems: items,
      paymentMethod: selectedMethod,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    if (address) {
      orderData.address = address;
    }

    try {
      await dispatch(createNewOrder({ userId: user.id, order: orderData })).unwrap();
      dispatch(clearCart());
      navigation.replace('Confirmation');
    } catch (error) {
      console.error("Order placement failed:", error);
      Alert.alert(t('common.error'), t('common.error_msg'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('payment.title')}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[theme.typography.h2, { marginBottom: 16, textAlign: 'left' }]}>{t('payment.select_method')}</Text>
        
        <View style={styles.methodsGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              onPress={() => setSelectedMethod(method.id)}
              style={styles.methodWrapper}
            >
              <GlassCard 
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                ]}
                intensity={selectedMethod === method.id ? 30 : 15}
              >
                <MaterialCommunityIcons 
                  name={method.icon as any} 
                  size={32} 
                  color={selectedMethod === method.id ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
                <Text style={[theme.typography.bodySecondary, { fontWeight: '700', marginTop: 8, color: theme.colors.onSurface, textAlign: 'center' }]}>
                  {method.title}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMethod === 'card' && (
          <View style={styles.cardForm}>
            <GlassCard style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>
                  {t('payment.card_holder_name')}
                </Text>
                <TextInput 
                  placeholder={t('payment.card_holder_placeholder')}
                  style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant, fontSize: 15, fontFamily: 'Cairo_400Regular' }]}
                  placeholderTextColor={theme.colors.outline}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>
                  {t('payment.card_number')}
                </Text>
                <View style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, flexDirection: 'row', alignItems: 'center', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}>
                  <TextInput 
                    placeholder="**** **** **** 1234"
                    style={{ flex: 1, textAlign: 'left', color: theme.colors.onSurface, fontSize: 15, fontFamily: 'Cairo_400Regular', letterSpacing: 2 }}
                    placeholderTextColor={theme.colors.outline}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  <MaterialCommunityIcons name="credit-card" size={24} color={theme.colors.primary} />
                </View>
              </View>
              <View style={[styles.row, { flexDirection: 'row' }]}>
                <View style={[styles.inputGroup, { flex: 1, marginEnd: 8 }]}>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>
                    {t('payment.expiry_date')}
                  </Text>
                  <TextInput 
                    placeholder="MM/YY"
                    style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: 'center', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant, fontSize: 15, fontFamily: 'Cairo_400Regular', letterSpacing: 1 }]}
                    placeholderTextColor={theme.colors.outline}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginStart: 8 }]}>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>
                    {t('payment.cvv')}
                  </Text>
                  <TextInput 
                    placeholder="***"
                    style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface, textAlign: 'center', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant, fontSize: 15, fontFamily: 'Cairo_400Regular', letterSpacing: 4 }]}
                    placeholderTextColor={theme.colors.outline}
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        <View style={styles.summary}>
          <GlassCard style={styles.summaryCard}>
            <View style={[styles.summaryRow, { flexDirection: flexRow }]}>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface }]}>{t('payment.order_total')}</Text>
              <Text style={[theme.typography.h2, { color: theme.colors.primary }]}>
                {total.toFixed(2)} {t('common.sar')}
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={[styles.security, { flexDirection: flexRow }]}>
          <MaterialCommunityIcons name="shield-check" size={24} color={theme.colors.primary} />
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginHorizontal: 8 }]}>
            {t('payment.secure_payment')}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surfaceContainerLowest, borderTopColor: theme.colors.outlineVariant, paddingBottom: insets.bottom + 20 }]}>
        <AppButton 
          title={t('payment.confirm')} 
          onPress={handleConfirm} 
          disabled={isOrdering}
          loading={isOrdering}
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
  methodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  methodWrapper: {
    flex: 1,
  },
  methodCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    height: 110,
  },
  cardForm: {
    marginBottom: 32,
  },
  formCard: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    height: 50,
  },
  row: {
    justifyContent: 'space-between',
  },
  summary: {
    marginBottom: 24,
  },
  summaryCard: {
    padding: 16,
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  security: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
});
