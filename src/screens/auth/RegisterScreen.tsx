import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Switch, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/common/GlassCard';
import { AppButton } from '../../components/common/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import { useRTL } from '../../hooks/useRTL';

import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function RegisterScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const { flexRow, textAlign, isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'الرجاء إدخال الاسم' : 'Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
      return;
    }
    if (phone.length !== 9) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'رقم الهاتف يجب أن يكون 9 أرقام' : 'Phone number must be 9 digits');
      return;
    }
    if (password.length < 6) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'كلمة المرور قصيرة جداً' : 'Password is too short');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert(isRTL ? 'تنبيه' : 'Notice', isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the terms');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Save extra info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone: `+966${phone}`,
        createdAt: new Date().toISOString()
      });

      dispatch(login({ id: user.uid, name, email }));
      navigation.replace('Main');
    } catch (error: any) {
      let message = isRTL ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred during registration';
      if (error.code === 'auth/email-already-in-use') {
        message = isRTL ? 'هذا البريد الإلكتروني مستخدم بالفعل' : 'This email is already in use';
      } else if (error.code === 'auth/weak-password') {
        message = isRTL ? 'كلمة المرور ضعيفة جداً' : 'Password is too weak';
      }
      Alert.alert(isRTL ? 'فشل التسجيل' : 'Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.logoSection, { paddingVertical: 10 }]}>
          <Text style={[theme.typography.h1, { color: theme.colors.primary, fontSize: 48, fontWeight: '700', lineHeight: 60 }]}>{appName}</Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 12 }]}>أنشئ حسابك الآن</Text>
        </View>

        <View style={styles.cardWrapper}>
          <GlassCard style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>الاسم</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', color: theme.colors.onSurface, textAlign }]}
              placeholder="الاسم الكامل"
              placeholderTextColor={theme.colors.outline}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>البريد الإلكتروني</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', color: theme.colors.onSurface, textAlign: 'left' }]}
              placeholder="example@email.com"
              placeholderTextColor={theme.colors.outline}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>رقم الهاتف</Text>
            <View style={[styles.phoneInput, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, fontWeight: '700' }]}>+966</Text>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.colors.onSurface, textAlign: 'left', marginHorizontal: 12 }]}
                placeholder="5xxxxxxxx"
                placeholderTextColor={theme.colors.outline}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={9}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>كلمة المرور</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.colors.onSurface, textAlign: 'left' }]}
                placeholder="********"
                placeholderTextColor={theme.colors.outline}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginBottom: 8, textAlign }]}>تأكيد كلمة المرور</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: theme.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.colors.onSurface, textAlign: 'left' }]}
                placeholder="********"
                placeholderTextColor={theme.colors.outline}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.termsRow, { flexDirection: 'row' }]}>
            <Switch 
              value={agreedToTerms} 
              onValueChange={setAgreedToTerms} 
              trackColor={{ true: theme.colors.primary }} 
            />
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline, marginHorizontal: 12, flex: 1, textAlign }]}>
              أوافق على <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>الشروط والأحكام</Text>
            </Text>
          </View>

          <AppButton title="إنشاء حساب" onPress={handleRegister} loading={loading} style={styles.button} />
        </GlassCard>
      </View>

        <View style={[styles.loginLink, { flexDirection: 'row' }]}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline }]}>لديك حساب؟ </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.primary, fontWeight: '700' }]}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 48 },
  cardWrapper: { width: '100%', maxWidth: 500 },
  card: { padding: 28, borderRadius: 24 },
  inputGroup: { marginBottom: 20 },
  inputWrapper: { borderRadius: 16, height: 56, paddingHorizontal: 16, alignItems: 'center' },
  input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
  eyeIcon: { padding: 8 },
  phoneInput: { alignItems: 'center', paddingHorizontal: 16, borderRadius: 16, height: 56 },
  termsRow: { alignItems: 'center', marginVertical: 16 },
  button: { width: '100%' },
  loginLink: { justifyContent: 'center', marginTop: 32, gap: 4 },
});
