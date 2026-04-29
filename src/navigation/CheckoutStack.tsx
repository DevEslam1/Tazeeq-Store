import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckoutStackParamList } from './types';
import { CartScreen } from '../screens/cart/CartScreen';
import { DeliveryScreen } from '../screens/checkout/DeliveryScreen';
import { PaymentScreen } from '../screens/checkout/PaymentScreen';
import { ConfirmationScreen } from '../screens/checkout/ConfirmationScreen';
import { ProductDetailScreen } from '../screens/product/ProductDetailScreen';

const Stack = createNativeStackNavigator<CheckoutStackParamList>();

export function CheckoutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Delivery" component={DeliveryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
