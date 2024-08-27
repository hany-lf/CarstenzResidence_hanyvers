import Icon from '@components/Icon';
import Text from '@components/Text';
import { BaseColor, useTheme } from '@config';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import styles from './styles';
import { parseHexTransparency } from '@utils';
import Loading from './Loading';
import { Image } from 'react-native-elements';
import {
  Home,
  BellHome,
  PhoneHome,
  UserHome,
  Handshake,
  Megaphone,
  Barbel,
  Repair,
  Billing,
  Announcement,
  RentOrSale,
  TROffice,
  Facilities,
  Others,
  Package,
  News,
  Event,
} from '../../../components/Svg';

export default function CategoryIconSoft({
  style = '',
  icon = '',
  icon_url = '',
  title = '',
  onPress = () => {},
  loading = false,
  isNormal = true,
  isWhite = false,
  isRound = false,
  isBlack = false,
  maxWidth = 150,
}) {
  const { colors } = useTheme();
  if (loading) {
    return <Loading style={style} />;
  }

  const getIconColor = () => {
    if (isWhite) {
      return BaseColor.goldColor;
    }
    if (isBlack) {
      return colors.text;
    }
    return BaseColor.goldColor;
  };

  //cara penggunaannya = nama IconClass di database: nama file svg
  const iconMapper = {
    billing: Billing,
    announcement: Announcement,
    rent_or_sale: RentOrSale,
    tr_office: TROffice,
    // package: Package,
    repair: Repair,
    facilities: Facilities,
    meter: Others,
    event: Event,
    // package: Package,
    news: News,
    // Tambahkan pemetaan ikon lainnya sesuai kebutuhan
  };
  console.log('iconMapper[icon]', iconMapper);
  console.log('icon', icon);

  const IconComponent = ({ iconClass, size, color }) => {
    const SvgIcon = iconMapper[iconClass]; // Ambil komponen SVG berdasarkan IconClass
    console.log('SvgIcon', SvgIcon);
    return SvgIcon ? (
      <SvgIcon width={size} height={size} stroke={color} />
    ) : null;
  };

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        styles.contain,
        isNormal && { backgroundColor: colors.backgroundColor },
        isWhite && { backgroundColor: BaseColor.grayColor },
        style,
      ])}
      onPress={onPress}
    >
      <View
        style={StyleSheet.flatten([
          styles.iconContent,
          isNormal && {
            backgroundColor: parseHexTransparency(colors.primary, 100),
          },
          isWhite && {
            backgroundColor: parseHexTransparency(colors.whiteColor, 30),
          },
          isBlack && {
            backgroundColor: parseHexTransparency(BaseColor.grayColor, 30),
          },
          isRound && styles.isRound,
        ])}
      >
        {/* <Image
          source={icon_url}
          style={{borderRadius: 12, width: 75, height: 75}}></Image> */}
        {/* <Icon
          name={icon}
          size={isRound ? 29 : 32}
          color={getIconColor()}
          solid
        /> */}

        <IconComponent
          width={50}
          height={50}
          iconClass={icon}
          // size={isRound ? 29 : 32}
          size={isRound ? 40 : 32}
          color={getIconColor()}
        />
      </View>
      <View style={{ marginTop: 15, maxWidth: maxWidth }}>
        <Text footnote numberOfLines={1} style={{ textAlign: 'center' }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

CategoryIconSoft.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node.isRequired,
  icon_url: PropTypes.node.isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

CategoryIconSoft.defaultProps = {
  style: {},
  icon: '',
  icon_url: '',
  title: '',
  onPress: () => {},
};
