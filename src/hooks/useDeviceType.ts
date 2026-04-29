import { useWindowDimensions } from 'react-native';

export function useDeviceType() {
  const { width, height } = useWindowDimensions();
  
  const isTablet = width >= 768;
  const isMobile = !isTablet;

  return {
    isTablet,
    isMobile,
    width,
    height,
  };
}
