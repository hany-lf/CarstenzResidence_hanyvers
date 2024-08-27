import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    textAlign: 'center',
    alignItems: 'center',
    // minWidth: 100,
  },
  iconContent: {
    width: 80,
    height: 80,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    width: 60,
  },
  isRound: {
    borderRadius: 10,
    width: 80,
    height: 80,
  },
});
