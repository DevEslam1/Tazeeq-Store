import { Platform } from 'react-native';

export const elevation = {
  card: Platform.select({
    ios: {
      shadowColor: '#10B981',
      shadowOpacity: 0.15,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: 10,
    },
    default: {},
  }),
  glassmorphic: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
};
