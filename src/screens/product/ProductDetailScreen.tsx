import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { products } from '../../data/products';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from '../../components/common/Badge';
import { PriceTag } from '../../components/common/PriceTag';
import { AppButton } from '../../components/common/AppButton';

export function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { theme, isRTL } = useAppTheme();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === productId);

  if (!product) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <MaterialCommunityIcons name={isRTL ? 'arrow-right' : 'arrow-left'} size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.h1, { color: theme.colors.onSurface }]}>
                {product.name}
              </Text>
              <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant }]}>
                {product.weight}
              </Text>
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons name="heart-outline" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <MaterialCommunityIcons name="star" size={20} color={theme.colors.secondaryContainer} />
            <Text style={[theme.typography.bodyMain, { fontWeight: '700', marginHorizontal: 4 }]}>
              {product.rating}
            </Text>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
              ({product.reviewCount} {t('common.reviews')})
            </Text>
          </View>

          <View style={styles.badges}>
            {product.badges?.map((badge, index) => (
              <Badge key={index} type={badge} />
            ))}
          </View>

          <Text style={[theme.typography.h2, { marginTop: 24, marginBottom: 8 }]}>
            {t('product.description')}
          </Text>
          <Text style={[theme.typography.bodyMain, { color: theme.colors.onSurfaceVariant, lineHeight: 24 }]}>
            {product.description}
          </Text>

          <View style={[styles.quantityRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[theme.typography.h2]}>{t('common.quantity')}</Text>
            <View style={[styles.stepper, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.stepperButton}>
                <MaterialCommunityIcons name="minus" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={[theme.typography.h2, { marginHorizontal: 16 }]}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.stepperButton}>
                <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodySecondary, { color: theme.colors.onSurfaceVariant }]}>
            {t('common.total_price')}
          </Text>
          <PriceTag price={product.price * quantity} size="lg" />
        </View>
        <AppButton 
          title={t('common.add_to_cart')} 
          onPress={() => {}} 
          style={{ flex: 1, marginLeft: isRTL ? 0 : 16, marginRight: isRTL ? 16 : 0 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#f4fbf4',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  quantityRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 4,
  },
  stepperButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
