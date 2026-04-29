import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function RegisterScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const handleRegister = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }
    navigation.replace('Main');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.logoSection}>
        <Text style={[theme.typography.h1, { color: theme.colors.primary }]}>{appName}</Text>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.outline }]}>أنشئ حسابك الآن</Text>
      </View>

      <GlassCard style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>الاسم</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
            placeholder="الاسم الكامل"
            placeholderTextColor={theme.colors.outline}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>البريد الإلكتروني</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
            placeholder="example@email.com"
            placeholderTextColor={theme.colors.outline}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>رقم الهاتف</Text>
          <View style={[styles.phoneInput, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <Text style={[theme.typography.bodyMain, { color: theme.colors.outline }]}>+966</Text>
            <TextInput
              style={[styles.input, { flex: 1, color: theme.colors.onSurface }]}
              placeholder="5xxxxxxxx"
              placeholderTextColor={theme.colors.outline}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>كلمة المرور</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
            placeholder="********"
            placeholderTextColor={theme.colors.outline}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8 }]}>تأكيد كلمة المرور</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
            placeholder="********"
            placeholderTextColor={theme.colors.outline}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.termsRow}>
          <Switch value={agreedToTerms} onValueChange={setAgreedToTerms} trackColor={{ true: theme.colors.primary }} />
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginRight: 12, flex: 1 }]}>
            أوافق على <Text style={{ color: theme.colors.primary }}>الشروط والأحكام</Text>
          </Text>
        </View>

        <AppButton title="إنشاء حساب" onPress={handleRegister} style={styles.button} />
      </GlassCard>

      <View style={styles.loginLink}>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline }]}>لديك حساب؟ </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700' }]}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 20 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  card: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  input: { height: 56, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  phoneInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 12 },
  termsRow: { alignItems: 'center', marginVertical: 16 },
  button: { marginTop: 8 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});