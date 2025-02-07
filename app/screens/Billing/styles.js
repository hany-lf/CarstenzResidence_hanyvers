import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  contentHeader: { paddingLeft: 8, flex: 1 },
  notyHeader: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 5,
    right: 0,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  titleList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerCard: {
    borderRadius: 10,
    height: 108,
    width: '100%',
    marginVertical: 15,
    backgroundColor: BaseColor.fieldColor,
    justifyContent: 'center',
    padding: 15,
  },
  headerCardPrimary: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCardCenter: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    height: 'auto',
    marginVertical: 0,
  },
  paddingContent: {
    paddingHorizontal: 20,
  },
  boxPaymentChannel: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    backgroundColor: BaseColor.goldColor,
    borderColor: BaseColor.whiteColor,
    borderWidth: 1,
    borderStyle: 'solid',
    width: 380,
    height: 45,
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  contentCard: {
    padding: 20,
    width: '100%',
    borderRadius: 8,
    marginBottom: 0,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: 'rgba(255,255,255, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 3,
        shadowRadius: 3,
      },
    }),
  },
});
