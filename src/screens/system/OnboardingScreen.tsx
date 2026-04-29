import React, { useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';

const { width } = Dimensions.get('window');

interface Slide {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

const slides: Slide[] = [
  { icon: 'leaf', title: 'أهلاً بك في تساج', subtitle: 'أفضل المنتجات الطازجة بين يديك', color: '#10b981' },
  { icon: 'truck-fast', title: 'توصيل سريع', subtitle: 'وصل إلى باب منزلك في دقائق', color: '#f59e0b' },
  { icon: 'sprout', title: 'عضوي 100%', subtitle: 'منتجات طبيعية وصحية للجميع', color: '#10b981' },
];

export function OnboardingScreen({ navigation }: any) {
  const { theme, locale } = useAppTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const appName = locale === 'ar' ? 'طازج' : 'Tazeeq';

  const slides: Slide[] = [
    { icon: 'leaf', title: `أهلاً بك في ${appName}`, subtitle: 'أفضل المنتجات الطازجة بين يديك', color: '#10b981' },
    { icon: 'truck-fast', title: 'توصيل سريع', subtitle: 'وصل إلى باب منزلك في دقائق', color: '#f59e0b' },
    { icon: 'sprout', title: 'عضوي 100%', subtitle: 'منتجات طبيعية وصحية للجميع', color: '#10b981' },
  ];

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
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
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
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
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  dotsContainer: { flexDirection: 'row', marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  button: { width: '100%', marginBottom: 16 },
  skipButton: { padding: 8 },
});