import * as Utils from '@utils';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBackgroundCard1: {
    width: Utils.scaleWithPixel(100),
    height: Utils.scaleWithPixel(100),
  },
  containLoading: {
    flexDirection: 'row',
  },
});
