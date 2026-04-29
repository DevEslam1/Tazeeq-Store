import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, useWindowDimensions, ViewToken } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Slide {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

export function OnboardingScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const slides: Slide[] = useMemo(() => [
    { icon: 'leaf', title: `أهلاً بك في ${appName}`, subtitle: 'أفضل المنتجات الطازجة بين يديك', color: theme.colors.primary },
    { icon: 'truck-fast', title: 'توصيل سريع', subtitle: 'وصل إلى باب منزلك في دقائق', color: theme.colors.secondaryContainer },
    { icon: 'sprout', title: 'عضوي 100%', subtitle: 'منتجات طبيعية وصحية للجميع', color: theme.colors.primary },
  ], [appName, theme.colors]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon as any} size={80} color={item.color} />
      </View>
      <Text style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 32, textAlign: 'center' }]}>
        {item.title}
      </Text>
      <Text style={[theme.typography.bodyMain, { color: theme.colors.outline, marginTop: 12, textAlign: 'center' }]}>
        {item.subtitle}
      </Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.outline },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
        }}
        removeClippedSubviews={false}
      />
      
      <View style={styles.footer}>
        {renderDots()}
        
        <AppButton
          title={currentIndex === slides.length - 1 ? 'ابدأ التسوق' : 'التالي'}
          onPress={handleNext}
          style={styles.button}
        />
        
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipButton}>
            <Text style={[theme.typography.bodySecondary, { color: theme.colors.outline }]}>تخطي</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: 80 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  dotsContainer: { flexDirection: 'row', marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  button: { width: '100%', marginBottom: 16 },
  skipButton: { padding: 8 },
});