import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { AccountScreen } from '../screens/profile/AccountScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { AddressListScreen } from '../screens/profile/AddressListScreen';
import { AddAddressScreen } from '../screens/profile/AddAddressScreen';
import { WishlistScreen } from '../screens/wishlist/WishlistScreen';
import { NotificationsScreen } from '../screens/system/NotificationsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { OrderHistoryScreen } from '../screens/profile/OrderHistoryScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={AccountScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}