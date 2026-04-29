import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useCart } from '../../hooks/useCart';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedAddress } from '../../store/slices/addressSlice';
import { placeOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';
import { products } from '../../data/products';

export function PaymentScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const { items, total } = useCart();
  const address = useSelector(selectSelectedAddress);

  const paymentMethods = [
    { id: 'card', title: 'بطاقة ائتمان', icon: 'credit-card-outline' },
    { id: 'apple', title: 'Apple Pay', icon: 'apple' },
    { id: 'wallet', title: 'محفظة تساج', icon: 'wallet-outline' },
  ];

  const handleConfirm = () => {
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        name: product?.name || '',
        price: product?.price || 0,
        image: product?.image || '',
      };
    });

    const newOrder = {
      id: `ORD-${Date.now()}`,
      status: 'Placed' as const,
      total: total,
      date: new Date().toISOString(),
      items: items.reduce((sum, item) => sum + item.quantity, 0),
      cartItems: items,
      address: address,
      paymentMethod: selectedMethod,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    dispatch(placeOrder(newOrder));
    dispatch(clearCart());
    navigation.replace('Confirmation');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[theme.typography.h1, { color: theme.colors.primary, flex: 1, textAlign: 'center' }]}>
          {t('payment.title') || 'طريقة الدفع'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[theme.typography.h2, { marginBottom: 16 }]}>{t('payment.select_method') || 'اختر وسيلة الدفع'}</Text>
        
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
                  selectedMethod === method.id && { borderColor: theme.colors.secondaryContainer, borderWidth: 2 }
                ]}
                intensity={selectedMethod === method.id ? 30 : 15}
              >
                <MaterialCommunityIcons 
                  name={method.icon as any} 
                  size={32} 
                  color={selectedMethod === method.id ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
                <Text style={[theme.typography.bodySecondary, { fontWeight: '700', marginTop: 8, color: theme.colors.onSurface }]}>
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
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>اسم صاحب البطاقة</Text>
                <TextInput 
                  placeholder="أحمد محمد"
                  style={[styles.input, { textAlign: isRTL ? 'right' : 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>رقم البطاقة</Text>
                <View style={[styles.input, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}>
                  <TextInput 
                    placeholder="**** **** **** 1234"
                    style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}
                  />
                  <MaterialCommunityIcons name="credit-card" size={32} color="#1A1F71" />
                </View>
              </View>
              <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>تاريخ الانتهاء</Text>
                  <TextInput 
                    placeholder="MM/YY"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>CVV</Text>
                  <TextInput 
                    placeholder="***"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}
                    secureTextEntry
                  />
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        <View style={styles.summary}>
          <GlassCard style={styles.summaryCard}>
            <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={theme.typography.bodyMain}>إجمالي الطلب</Text>
              <Text style={[theme.typography.h2, { color: theme.colors.primary }]}>{total.toFixed(2)} ر.س</Text>
            </View>
          </GlassCard>
        </View>

        <View style={[styles.security, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <MaterialCommunityIcons name="shield-check" size={24} color={theme.colors.primary} />
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginHorizontal: 8 }]}>
            دفع آمن ومشفر ١٠٠٪
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          title={t('payment.confirm') || 'تأكيد الطلب والدفع'} 
          onPress={handleConfirm} 
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
  scrollContent: {
    padding: 20,
  },
  methodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  methodWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  methodCard: {
    alignItems: 'center',
    padding: 16,
    height: 100,
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
    backgroundColor: 'white',
  },
  row: {
    justifyContent: 'space-between',
  },
  summary: {
    marginBottom: 24,
  },
  summaryCard: {
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  security: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
