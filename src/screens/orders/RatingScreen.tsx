import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useAppTheme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { GlassCard } from '../../components/common/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function RatingScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[theme.typography.h1, { textAlign: 'center', color: theme.colors.onSurface }]}>كيف كانت تجربتك؟</Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
            رأيك يهمنا لتحسين خدماتنا
          </Text>
        </View>

        <GlassCard style={styles.ratingCard}>
          <Text style={[theme.typography.h2, { textAlign: 'center', marginBottom: 20 }]}>تقييم التوصيل</Text>
          <View style={[styles.stars, { flexDirection: 'row' }]}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <MaterialCommunityIcons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={48} 
                  color={star <= rating ? theme.colors.secondaryContainer : theme.colors.outlineVariant} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <View style={styles.commentSection}>
          <Text style={[theme.typography.h2, { marginBottom: 12, color: theme.colors.onSurface }]}>أضف تعليقك</Text>
          <TextInput 
            placeholder="اكتب هنا..."
            style={[styles.input, { textAlign: 'left', borderRadius: theme.radius.md, borderColor: theme.colors.outlineVariant }]}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.bonusCard}>
          <GlassCard style={{ backgroundColor: theme.colors.primaryContainer }}>
            <View style={[styles.bonusContent, { flexDirection: 'row' }]}>
              <MaterialCommunityIcons name="gift-outline" size={32} color={theme.colors.onPrimaryContainer} />
              <View style={[styles.bonusText, { alignItems: 'flex-start' }]}>
                <Text style={[theme.typography.bodyMain, { color: theme.colors.onPrimaryContainer, fontWeight: '700' }]}>حصلت على ٥٠ نقطة!</Text>
                <Text style={[theme.typography.bodySecondary, { color: theme.colors.onPrimaryContainer }]}>شكراً لتقييمك، تمت إضافة النقاط لحسابك</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          title="إرسال التقييم" 
          onPress={() => navigation.navigate('Home')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 40,
  },
  ratingCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  stars: {
    gap: 8,
  },
  commentSection: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    height: 120,
    backgroundColor: theme.colors.surfaceContainerLow,
    color: theme.colors.onSurface,
  },
  bonusCard: {
    marginBottom: 100,
  },
  bonusContent: {
    alignItems: 'center',
  },
  bonusText: {
    flex: 1,
    marginHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

