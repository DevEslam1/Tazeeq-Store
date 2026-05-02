import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { useFonts, BeVietnamPro_400Regular, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import * as SplashScreen from 'expo-splash-screen';

import { store } from './src/store';
import { AppThemeProvider, useAppTheme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GlobalBanner } from './src/components/common/GlobalBanner';
import { useAuthBootstrap } from './src/hooks/useAuthBootstrap';
import { ProductRepository } from './src/services/productService';
import { CategoryRepository } from './src/services/categoryService';
import './src/i18n';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  useAuthBootstrap();
  const { locale } = useAppTheme();
  
  return (
    <View key={locale} style={{ flex: 1 }}>
      <AppNavigator />
      <GlobalBanner />
      <StatusBar />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
    Cairo_400Regular,
    Cairo_700Bold,
  });
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      
      // One-time migration to add English fields to Firestore
      const runMigration = async () => {
        try {
          await Promise.all([
            ProductRepository.migrateToI18n(),
            CategoryRepository.migrateToI18n()
          ]);
        } catch (e) {
          console.error("Migration failed:", e);
        }
      };
      runMigration();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Cairo_700Bold', fontSize: 36, color: 'white' }}>طازج</Text>
        <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Tazeeq</Text>
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <AppThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </AppThemeProvider>
    </ReduxProvider>
  );
}
