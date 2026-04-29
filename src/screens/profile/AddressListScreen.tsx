import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAddresses, selectAddress } from '../../store/slices/addressSlice';
import { AppDispatch } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AddressListScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector(selectAllAddresses);

  const getIcon = (title: string) => {
    return title === 'المنزل' ? 'home' : title === 'العمل' ? 'office-building' : 'map-marker';
  };

  const handleSelect = (id: string) => {
    dispatch(selectAddress(id));
  };

  const renderItem = ({ item }: { item: typeof addresses[0] }) => (
    <GlassCard style={[styles.addressCard, item.selected && { borderWidth: 2, borderColor: theme.colors.secondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondaryContainer + '30' }]}>
        <MaterialCommunityIcons name={getIcon(item.title) as any} size={24} color={theme.colors.secondary} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurface, fontWeight: '700' }]}>{item.title}</Text>
          {item.selected && (
            <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} style={styles.checkIcon} />
          )}
        </View>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginTop: 4 }]}>{item.details}</Text>
        <Text style={[theme.typography.label, { color: theme.colors.outline, marginTop: 4 }]}>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => handleSelect(item.id)}>
        <MaterialCommunityIcons name={item.selected ? 'radiobox-marked' : 'radiobox-blank'} size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: 'white' }]}>عناويني</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <AppButton
          title="إضافة عنوان جديد"
          onPress={() => navigation.navigate('AddAddress')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 16 },
  backButton: { padding: 8 },
  list: { padding: 16, paddingBottom: 100 },
  addressCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  content: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { marginStart: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
});