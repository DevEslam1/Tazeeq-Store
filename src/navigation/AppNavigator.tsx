import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAppTheme } from '../theme/ThemeProvider';
import { MobileTabNavigator } from './MobileTabNavigator';
import { CheckoutStack } from './CheckoutStack';
import { OrderStack } from './OrderStack';
import { useDeviceType } from '../hooks/useDeviceType';
import { SidebarNav } from '../components/common/SidebarNav';
import { ShopStack } from './ShopStack';
import { AuthStack } from './AuthStack';
import { ProfileStack } from './ProfileStack';
import { WishlistScreen } from '../screens/wishlist/WishlistScreen';
import { NotificationsScreen } from '../screens/system/NotificationsScreen';
import { SearchScreen } from '../screens/search/SearchScreen';

function TabletNavigator() {
  const { isRTL } = useAppTheme();
  
  return (
    <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <SidebarNav />
      <View style={{ flex: 1 }}>
        <ShopStack />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isTablet } = useDeviceType();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen 
          name="Main" 
          component={isTablet ? TabletNavigator : MobileTabNavigator} 
        />
        <Stack.Screen name="Checkout" component={CheckoutStack} />
        <Stack.Screen name="Order" component={OrderStack} />
        <Stack.Screen name="Profile" component={ProfileStack} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
