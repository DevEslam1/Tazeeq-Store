import { Platform } from 'react-native';

export const elevation = {
  card: Platform.select({
    ios: {
      shadowColor: '#0F6E56',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 2 },
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  panel: Platform.select({
    ios: {
      shadowColor: '#0F6E56',
      shadowOpacity: 0.1,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: -8 },
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#0F6E56',
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
  glassmorphic: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
};
