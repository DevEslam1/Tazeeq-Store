import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

interface PriceTagProps {
  price: number;
  oldPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export function PriceTag({ price, oldPrice, currency, size = 'md', style }: PriceTagProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  
  const curr = currency || t('common.sar');

  const getTextStyle = () => {
    switch (size) {
      case 'sm': return theme.typography.bodySecondary;
      case 'md': return theme.typography.bodyMain;
      case 'lg': return theme.typography.priceLg;
      default: return theme.typography.bodyMain;
    }
  };

  const mainTextStyle = getTextStyle();

  return (
    <View style={[styles.container, { flexDirection: 'row' }, style]}>
      <Text style={[mainTextStyle, { color: theme.colors.primaryContainer, fontWeight: '800' }]}>
        {`${price.toFixed(2)} ${curr}`}
      </Text>
      {oldPrice && (
        <Text style={[styles.oldPrice, theme.typography.bodySecondary, { color: theme.colors.outline }]}>
          {`${oldPrice.toFixed(2)} ${curr}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginStart: 4,
  },
});
