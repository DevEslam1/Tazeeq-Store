import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAppTheme } from '../theme';
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
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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

import { StatusBar } from 'expo-status-bar';

export function AppNavigator() {
  const { isTablet } = useDeviceType();
  const { theme, mode } = useAppTheme();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 400,
          gestureEnabled: true,
          contentStyle: { backgroundColor: theme.colors.background }
        }}
        initialRouteName={isLoggedIn ? 'Main' : 'Auth'}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen 
          name="Main" 
          component={isTablet ? TabletNavigator : MobileTabNavigator} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutStack} 
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="Order" component={OrderStack} />
        <Stack.Screen name="Profile" component={ProfileStack} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen} 
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
