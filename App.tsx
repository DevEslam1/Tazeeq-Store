import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { useFonts, BeVietnamPro_400Regular, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import * as SplashScreen from 'expo-splash-screen';

import { store } from './src/store';
import { AppThemeProvider } from './src/theme/ThemeProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import './src/i18n';

SplashScreen.preventAutoHideAsync();

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
          <AppNavigator />
          <StatusBar />
        </SafeAreaProvider>
      </AppThemeProvider>
    </ReduxProvider>
  );
}
