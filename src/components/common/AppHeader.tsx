import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDeviceType } from '../../hooks/useDeviceType';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export function AppHeader() {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="menu" size={26} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <Text style={[styles.logo, theme.typography.h1, { color: theme.colors.primary }]}>
            طازج
          </Text>
          
          <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="bell-outline" size={26} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Cart')}>
              <MaterialCommunityIcons name="cart-outline" size={26} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.outline} />
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginHorizontal: 12 }]}>
              بحث عن خضروات، بقالة...
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    marginHorizontal: 20,
    marginTop: 40,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  container: {
    height: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  logo: {
    fontWeight: '800',
    fontSize: 28,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    backgroundColor: 'white',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
