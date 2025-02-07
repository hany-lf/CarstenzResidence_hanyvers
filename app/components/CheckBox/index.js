import Icon from '@components/Icon';
import Text from '@components/Text';
import { useTheme } from '@config';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const CheckBox = ({
  onPress = () => {},
  title = '',
  checkedIcon = '',
  uncheckedIcon = '',
  checked = true,
  style = {}, // Tambahkan props style
  colorCheck = '',
  styleText = {},
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
      onPress={onPress}
    >
      <Text body1 style={[{ paddingHorizontal: 8 }, styleText]}>
        {title}
      </Text>
      <Icon
        solid={checked}
        name={checked ? checkedIcon : uncheckedIcon}
        color={colorCheck == '' ? colors.text : colorCheck}
        size={24}
      />
    </TouchableOpacity>
  );
};

export default CheckBox;
