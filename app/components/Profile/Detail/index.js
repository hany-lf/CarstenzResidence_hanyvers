import Icon from '@components/Icon';
import Image from '@components/Image';
import Text from '@components/Text';
import { BaseColor, useTheme } from '@config';
import PropTypes from 'prop-types';

import { TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';

export default function ProfileDetail(props) {
  const { colors } = useTheme();
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    textFirst,
    point,
    textSecond,
    textThird,
    icon,
  } = props;
  console.log('image di profil detil', image);
  const [uniqueImageurl, setUniqueImageurl] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      // Optionally perform any action needed when the screen is focused
      console.log('Profile screen is focused di detail');
      console.log('User state updated: detail -> profil', image);
      const uniqueImageurl = `${image}?${Date.now()}`;
      setUniqueImageurl(uniqueImageurl);
    }, [image]),
  );
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.contentLeft, styleLeft]}>
        <View>
          <Image
            key={uniqueImageurl}
            source={
              image != null
                ? { uri: uniqueImageurl }
                : // ../ ../../assets/images/image-home/Main_Image.png
                  require('../../../assets/images/image-home/Main_Image.png')
            }
            style={[styles.thumb, styleThumb]}
          />
          {/* <Image
            source={
              image != null
                ? { uri: image }
                : // ../ ../../assets/images/image-home/Main_Image.png
                  require("../../../assets/images/image-home/Main_Image.png")
            }
            style={[styles.thumb, styleThumb]}
          /> */}
          <View
            style={[styles.point, { backgroundColor: colors.primaryLight }]}
          >
            <Text overline whiteColor semibold>
              {point}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <Text headline semibold numberOfLines={1}>
            {textFirst}
          </Text>
          <Text
            body2
            style={{
              marginTop: 3,
              paddingRight: 10,
            }}
            numberOfLines={1}
          >
            {textSecond}
          </Text>
          <Text footnote grayColor numberOfLines={1}>
            {textThird}
          </Text>
        </View>
      </View>
      {/* {icon && (
        <View style={[styles.contentRight, styleRight]}>
          <Icon
            name="angle-right"
            size={18}
            color={BaseColor.grayColor}
            enableRTL={true}
          />
        </View>
      )} */}
    </TouchableOpacity>
  );
}

ProfileDetail.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  textFirst: PropTypes.string,
  point: PropTypes.string,
  textSecond: PropTypes.string,
  textThird: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.bool,
  onPress: PropTypes.func,
};

ProfileDetail.defaultProps = {
  image: '',
  textFirst: '',
  textSecond: '',
  icon: true,
  point: '',
  style: {},
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  onPress: () => {},
};
