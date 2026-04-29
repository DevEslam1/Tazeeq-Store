import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../hooks/useRTL';

export function EditProfileScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { isRTL, flexRow } = useRTL();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);
  
  const [name, setName] = useState(user?.name || 'Eslam Ahmed');
  const [email, setEmail] = useState(user?.email || 'eslam@example.com');
  const [phone, setPhone] = useState('+966501234567');

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { flexDirection: flexRow, backgroundColor: theme.colors.primary, paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
        </TouchableOpacity>
        <Text style={[theme.typography.sectionTitle, { color: 'white' }]}>تعديل الملف الشخصي</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="account" size={48} color={theme.colors.onPrimary} />
          </View>
          <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.secondary }]}>
            <MaterialCommunityIcons name="camera" size={20} color={theme.colors.onSecondary} />
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>الاسم</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>البريد الإلكتروني</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>رقم الهاتف</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <AppButton title="حفظ التعديلات" onPress={handleSave} style={styles.saveButton} />
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 48 },
  backButton: { padding: 8 },
  content: { padding: 20, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  cameraButton: { position: 'absolute', bottom: 0, right: '50%', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  input: { height: 56, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  saveButton: { marginTop: 16 },
});
