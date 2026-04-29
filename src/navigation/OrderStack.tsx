import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderStackParamList } from './types';
import { TrackingScreen } from '../screens/orders/TrackingScreen';
import { RatingScreen } from '../screens/orders/RatingScreen';
import { OrderHistoryScreen } from '../screens/orders/OrderHistoryScreen';

const Stack = createNativeStackNavigator<OrderStackParamList>();

export function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
    </Stack.Navigator>
  );
}
