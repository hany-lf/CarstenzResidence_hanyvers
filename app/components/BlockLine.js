import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

const BlockLine = () => {
  const { colors } = useTheme();
  return (
    <>
      <View style={styles.blockLine}>
        <View style={[styles.circle, styles.circleLeft]}></View>
        <View style={styles.line}></View>
        <View style={[styles.circle, styles.circleRight]}></View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    padding: 10,
  },
  wrapper: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.2,
  },
  block: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'column',
  },
  title: {
    width: 250,
    paddingTop: 10,
  },
  subTitle: {
    color: '#8d9192',
  },
  logo: {},
  img: {
    width: 60,
    height: 60,
  },
  blockLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: -10,
    marginRight: -10,
    zIndex: 100,
  },
  circle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: '#ececec',
    borderRightWidth: 10,
    borderRightColor: '#ececec',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#b6b6b6',
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // shadowOpacity: 0.2,
    zIndex: 999,
  },
  circleLeft: {
    transform: [{ rotate: '45deg' }],
  },
  circleRight: {
    transform: [{ rotate: '-135deg' }],
  },
  blockTime: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    borderWidth: 1,
    borderStyle: 'dashed',
    flex: 1,
    borderColor: '#dbdbdb',
  },
  time: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  lineHori: {
    // flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotBorder: {
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  dotBack: {
    backgroundColor: 'red',
  },
  lineDash: {
    borderWidth: 1,
    borderStyle: 'dashed',
    flex: 1,
    borderColor: '#dbdbdb',
  },
  blockFrom: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  blockCode: {
    flexDirection: 'column',
    padding: 10,
  },
  titleCode: {
    fontSize: 16,
  },
  code: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: '#f14d68',
    fontSize: 16,
  },
});

export default BlockLine;
