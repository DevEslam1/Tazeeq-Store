import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, withSequence, cancelAnimation } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

interface HeaderProgressBarProps {
  loading?: boolean;
  color?: string;
}

export function HeaderProgressBar({ loading, color }: HeaderProgressBarProps) {
  const { theme } = useAppTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (loading) {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(progress);
      progress.value = withTiming(0);
    }
  }, [loading]);

  const animatedBarStyles = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    opacity: loading ? 1 : 0,
  }));

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.progressBar, 
          animatedBarStyles, 
          { backgroundColor: color || theme.colors.primary }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  progressBar: {
    height: '100%',
  },
});
