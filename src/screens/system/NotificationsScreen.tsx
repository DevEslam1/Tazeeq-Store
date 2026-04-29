import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'delivery';
}

const mockNotifications: Notification[] = [
  { id: '1', icon: 'truck-delivery', title: 'تم توصيل طلبك', message: 'تم توصيل طلبك #1234 بنجاح', time: 'منذ ساعة', read: false, type: 'delivery' },
  { id: '2', icon: 'shopping', title: 'قيد التجهيز', message: 'طلبك #1235 قيد التجهيز وسيتم الشحن قريباً', time: 'منذ 3 ساعات', read: false, type: 'order' },
  { id: '3', icon: 'tag', title: 'خصم 30%', message: 'خصم جديد على جميع الخضروات الطازجة', time: 'أمس', read: true, type: 'promo' },
  { id: '4', icon: 'truck-delivery', title: 'في الطريق', message: 'طلبك #1236 في الطريق إليك', time: 'أمس', read: true, type: 'delivery' },
  { id: '5', icon: 'star', title: 'تقييم جديد', message: 'شكراً لتقييمك! حصلت على 50 نقطة', time: 'منذ يومين', read: true, type: 'order' },
];

export function NotificationsScreen({ navigation }: any) {
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order': return theme.colors.primary;
      case 'promo': return theme.colors.secondary;
      case 'delivery': return theme.colors.primaryContainer;
      default: return theme.colors.primary;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <GlassCard style={[styles.notificationCard, !item.read && { borderWidth: 1, borderColor: theme.colors.primary }]}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '20' }]}>
        <MaterialCommunityIcons name={item.icon as any} size={24} color={getIconColor(item.type)} />
      </View>
      <View style={styles.content}>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface, fontWeight: item.read ? '400' : '700' }]}>
          {item.title}
        </Text>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 4 }]}>
          {item.message}
        </Text>
        <Text style={[theme.typography.label, { color: theme.colors.outline, marginTop: 8 }]}>
          {item.time}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white' }]}>التنبيهات</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 48 },
  backButton: { padding: 8 },
  list: { padding: 16, paddingBottom: 100 },
  notificationCard: { flexDirection: 'row', marginBottom: 12, padding: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  content: { flex: 1 },
});