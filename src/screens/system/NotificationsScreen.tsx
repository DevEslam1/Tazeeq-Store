import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRTL } from '../../hooks/useRTL';

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'delivery';
}

// Moved mock data inside component to support i18n

export function NotificationsScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const mockNotifications: Notification[] = [
    { id: '1', icon: 'truck-delivery', title: t('notifications.types.delivery_title'), message: t('notifications.types.delivery_message', { id: '1234' }), time: t('notifications.time.hour_ago'), read: false, type: 'delivery' },
    { id: '2', icon: 'shopping', title: t('notifications.types.order_prep_title'), message: t('notifications.types.order_prep_message', { id: '1235' }), time: t('notifications.time.three_hours_ago'), read: false, type: 'order' },
    { id: '3', icon: 'tag', title: t('notifications.types.promo_title'), message: t('notifications.types.promo_message'), time: t('notifications.time.yesterday'), read: true, type: 'promo' },
    { id: '4', icon: 'truck-delivery', title: t('notifications.types.order_on_way_title'), message: t('notifications.types.order_on_way_message', { id: '1236' }), time: t('notifications.time.yesterday'), read: true, type: 'delivery' },
    { id: '5', icon: 'star', title: t('notifications.types.rating_title'), message: t('notifications.types.rating_message'), time: t('notifications.time.two_days_ago'), read: true, type: 'order' },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order': return theme.colors.primary;
      case 'promo': return theme.colors.secondary;
      case 'delivery': return theme.colors.primary;
      default: return theme.colors.primary;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[
      styles.notificationCard,
      {
        backgroundColor: item.read ? theme.colors.surfaceContainerLowest : theme.colors.primaryContainer,
        borderColor: item.read ? theme.colors.border : theme.colors.primary,
        borderRadius: theme.radius.card,
        flexDirection: flexRow,
      },
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '20', borderRadius: theme.radius.full }]}>
        <MaterialCommunityIcons name={item.icon as any} size={24} color={getIconColor(item.type)} />
      </View>
      <View style={styles.content}>
        <Text style={[theme.typography.itemName, { color: theme.colors.onSurface, textAlign: isRTL ? 'right' : 'left' }]}>
          {item.title}
        </Text>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }]}>
          {item.message}
        </Text>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant, marginTop: 8, fontSize: 11, textAlign: isRTL ? 'right' : 'left' }]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={[theme.typography.sectionTitle, { color: theme.colors.onPrimary }]}>{t('notifications.title')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={mockNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { padding: 8 },
  list: { padding: 16, paddingBottom: 100 },
  notificationCard: { 
    marginBottom: 12, 
    padding: 16, 
    borderWidth: 1, 
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
});
