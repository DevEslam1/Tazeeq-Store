import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from './types';

import { HomeScreen } from '../screens/home/HomeScreen';
import { CategoriesScreen } from '../screens/catalog/CategoriesScreen';
import { ProductListScreen } from '../screens/catalog/ProductListScreen';

// Placeholder screens - will be implemented in Phase 6
import { ProductDetailScreen } from '../screens/product/ProductDetailScreen';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
