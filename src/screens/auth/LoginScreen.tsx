import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useRTL } from '../../hooks/useRTL';

type LoginMethod = 'phone' | 'email';

export function LoginScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const { isRTL, flexRow, textAlign } = useRTL();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [method, step]);

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePhoneLogin = () => {
    if (phone.length === 9) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
      }, 1000);
    } else {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'الرجاء إدخال رقم هاتف صحيح (9 أرقام)' : 'Please enter a valid 9-digit phone number');
    }
  };

  const handleEmailLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(login({ id: '1', name: 'User', email }));
      navigation.replace('Main');
    }, 1000);
  };

  const handleGuest = () => {
    navigation.replace('Main');
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        dispatch(login({ id: '1', name: 'User', email: `${phone}@tazeeq.app` }));
        navigation.replace('Main');
      }, 1000);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    if (text && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const renderMethodSwitcher = () => (
    <View style={[styles.switcher, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
      <TouchableOpacity 
        style={[styles.switchTab, method === 'phone' && { backgroundColor: theme.colors.primary }]} 
        onPress={() => { setMethod('phone'); setStep('phone'); }}
      >
        <Text style={[styles.switchText, { color: method === 'phone' ? theme.colors.onPrimary : theme.colors.outline }]}>
          {isRTL ? 'رقم الهاتف' : 'Phone'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.switchTab, method === 'email' && { backgroundColor: theme.colors.primary }]} 
        onPress={() => setMethod('email')}
      >
        <Text style={[styles.switchText, { color: method === 'email' ? theme.colors.onPrimary : theme.colors.outline }]}>
          {isRTL ? 'البريد الإلكتروني' : 'Email'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
          <Text style={[theme.typography.h1, { color: theme.colors.primary, fontSize: 48 }]}>{appName}</Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 12 }]}>أفضل المنتجات الطازجة</Text>
        </Animated.View>

        <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim }]}>
          <GlassCard style={styles.card}>
            {renderMethodSwitcher()}

            {method === 'phone' ? (
              step === 'phone' ? (
                <>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign, marginTop: 24 }]}>
                    رقم الهاتف
                  </Text>
                  <View style={[styles.inputContainer, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, fontWeight: '700' }]}>+966</Text>
                    <TextInput
                      style={[styles.input, { color: theme.colors.onSurface, textAlign: 'left', marginHorizontal: 12 }]}
                      placeholder="5xxxxxxxx"
                      placeholderTextColor={theme.colors.outline}
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      maxLength={9}
                    />
                  </View>
                  <AppButton title="إرسال رمز التحقق" onPress={handlePhoneLogin} loading={loading} style={styles.button} />
                </>
              ) : (
                <>
                  <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 12, textAlign: 'center', marginTop: 24 }]}>
                    أدخل الرمز
                  </Text>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 24, textAlign: 'center' }]}>
                    تم إرسال رمز التحقق إلى {phone}
                  </Text>
                  <View style={[styles.otpContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        style={[styles.otpInput, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', color: theme.colors.onSurface }]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onKeyPress={(e) => handleOTPKeyPress(e, index)}
                        onChangeText={(text) => handleOTPChange(text, index)}
                      />
                    ))}
                  </View>
                  <AppButton title="تحقق" onPress={handleVerify} loading={loading} style={styles.button} />
                  <TouchableOpacity onPress={() => setStep('phone')} style={{ marginTop: 20 }}>
                    <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, textAlign: 'center' }]}>تغيير رقم الهاتف</Text>
                  </TouchableOpacity>
                </>
              )
            ) : (
              <>
                <View style={{ marginTop: 24 }}>
                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>
                    البريد الإلكتروني
                  </Text>
                  <View style={[styles.inputContainer, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    <TextInput
                      style={[styles.input, { color: theme.colors.onSurface, textAlign: 'left' }]}
                      placeholder="example@email.com"
                      placeholderTextColor={theme.colors.outline}
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                    />
                  </View>

                  <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign, marginTop: 16 }]}>
                    كلمة المرور
                  </Text>
                  <View style={[styles.inputContainer, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    <TextInput
                      style={[styles.input, { color: theme.colors.onSurface, textAlign: 'left' }]}
                      placeholder="********"
                      placeholderTextColor={theme.colors.outline}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <MaterialCommunityIcons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={20} 
                        color={theme.colors.outline} 
                      />
                    </TouchableOpacity>
                  </View>
                  <AppButton title="تسجيل الدخول" onPress={handleEmailLogin} loading={loading} style={styles.button} />
                </View>
              </>
            )}
          </GlassCard>
        </Animated.View>

        <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.primary, fontWeight: '600' }]}>متابعة كزائر</Text>
        </TouchableOpacity>

        <View style={[styles.registerLink, { flexDirection: 'row' }]}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline }]}>حساب جديد؟ </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700' }]}>سجل الآن</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 56 },
  cardWrapper: { width: '100%', maxWidth: 450 },
  card: { padding: 28, borderRadius: 24 },
  switcher: { height: 54, borderRadius: 27, padding: 4, marginBottom: 12 },
  switchTab: { flex: 1, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  switchText: { fontWeight: '700', fontSize: 15 },
  inputContainer: { alignItems: 'center', paddingHorizontal: 16, height: 60, borderRadius: 16, marginBottom: 16 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  button: { width: '100%', marginTop: 12, height: 56 },
  otpContainer: { justifyContent: 'center', gap: 12, marginBottom: 32 },
  otpInput: { width: 64, height: 68, borderRadius: 16, fontSize: 32, textAlign: 'center', fontWeight: '800' },
  guestButton: { marginTop: 32, alignItems: 'center' },
  registerLink: { justifyContent: 'center', marginTop: 24, gap: 4 },
});