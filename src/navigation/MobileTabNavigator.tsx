import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { ShopStack } from './ShopStack';
import { OrderStack } from './OrderStack';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { OrganicScreen } from '../screens/catalog/OrganicScreen';
import { AiAssistantScreen } from '../screens/ai/AiAssistantScreen';
import { ProfileStack } from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MobileTabNavigator() {
  return (
    <Tab.Navigator 
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Shop" component={ShopStack} />
      <Tab.Screen name="Organic" component={OrganicScreen} />
      <Tab.Screen name="Assistant" component={AiAssistantScreen} />
      <Tab.Screen name="Orders" component={OrderStack} />
      <Tab.Screen name="Account" component={ProfileStack} />
    </Tab.Navigator>
  );
}
