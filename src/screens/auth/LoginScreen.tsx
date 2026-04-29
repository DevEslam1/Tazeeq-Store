import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function LoginScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const handleSendOTP = () => {
    if (phone.length >= 9) {
      setStep('otp');
    }
  };

  const handleVerify = () => {
    Alert.alert('Success', 'Logged in successfully!');
  };

  const handleGuest = () => {
    navigation.replace('Main');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.logoSection}>
        <Text style={[theme.typography.h1, { color: theme.colors.primary }]}>{appName}</Text>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.outline }]}>أفضل المنتجات الطازجة</Text>
      </View>

      <GlassCard style={styles.card}>
        {step === 'phone' ? (
          <>
            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 20, textAlign: 'center' }]}>
              تسجيل الدخول
            </Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 16 }]}>رقم الهاتف</Text>
            <View style={[styles.phoneInput, { backgroundColor: theme.colors.surfaceContainerLow }]}>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline }]}>+966</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, textAlign: 'left' }]}
                placeholder="5xxxxxxxx"
                placeholderTextColor={theme.colors.outline}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={9}
              />
            </View>
            <AppButton title="تسجيل الدخول" onPress={handleSendOTP} style={styles.button} />
          </>
        ) : (
          <>
            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 20, textAlign: 'center' }]}>
              أدخل الرمز
            </Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 16, textAlign: 'center' }]}>
              تم إرسال رمز التحقق إلى رقمك
            </Text>
            <View style={styles.otpContainer}>
              {otp.map((_, index) => (
                <TextInput
                  key={index}
                  style={[styles.otpInput, { backgroundColor: theme.colors.surfaceContainerLow, color: theme.colors.onSurface }]}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => {
                    const newOtp = [...otp];
                    newOtp[index] = text;
                    setOtp(newOtp);
                    if (text && index < 3) {
                      // Focus next input
                    }
                  }}
                />
              ))}
            </View>
            <AppButton title="تحقق" onPress={handleVerify} style={styles.button} />
            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, textAlign: 'center', marginTop: 12 }]}>إعادة إرسال</Text>
            </TouchableOpacity>
          </>
        )}
      </GlassCard>

      <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
        <Text style={[theme.typography.bodyMain, { color: theme.colors.primary }]}>متابعة كزائر</Text>
      </TouchableOpacity>

      <View style={styles.registerLink}>
        <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline }]}>حساب جديد؟ </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700' }]}>سجل الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  card: { padding: 24 },
  phoneInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, borderRadius: 28, marginBottom: 20 },
  input: { flex: 1, fontSize: 18, marginRight: 12 },
  button: { marginTop: 8 },
  otpContainer: { justifyContent: 'center', gap: 12, marginBottom: 20 },
  otpInput: { width: 60, height: 56, borderRadius: 12, fontSize: 24, textAlign: 'center' },
  guestButton: { marginTop: 24, alignItems: 'center' },
  registerLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
});