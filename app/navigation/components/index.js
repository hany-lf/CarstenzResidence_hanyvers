/** @format */

import React, { act, useEffect } from 'react';
import { Icon, Text } from '@components';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@config';
import getNotifRed from '../../selectors/NotifSelectors';
import { useSelector } from 'react-redux';
import { Home, BellHome, PhoneHome, UserHome } from '../../components/Svg';

// export const tabBarIcon = ({ color, NameSvg }) => (
//   <NameSvg width={20} height={20} fill={color} />
// );

// Define the tabBarIcon function
export const tabBarIcon = ({ color, iconName }) => {
  console.log('iconName tab bar icon', iconName);
  const icons = {
    home: Home,
    phone: PhoneHome,
    bell: BellHome,
    account: UserHome,
    // Tambahkan ikon lainnya jika diperlukan
  };

  const IconComponent = icons[iconName];

  return IconComponent ? (
    <IconComponent
      width={20}
      height={20}
      stroke={color}
      //fill={color} //kalo mau di fill svg nya pake ini, kalo ngga pake stroke aja
    />
  ) : null;
};

export const tabBarIconHaveNoty = ({ color, iconName }) => {
  // const notifData_FromRed = useSelector(state => getNotifRed(state));
  console.log('icon name di icon haveduty', iconName);

  const data = useSelector((state) => state.apiReducer.data);

  useEffect(() => {
    console.log('data di tabbar', data);
  }, [data]);

  // const finalCount =
  //   data && data.length > 0
  //     ? data.reduce((sum, item) => sum + parseInt(item.isRead), 0)
  //     : 0;
  // console.log('data di tabbar', data);
  let sum = 0;
  data != null || data != undefined || data.length > 0
    ? data.map((item, index) => {
        sum += parseInt(item.isRead);
      })
    : (sum = 0);

  // const counter = useSelector((state) => state.counter);
  // console.log('counter badge di tabbar', finalCount);
  const total = data.length;
  const finalCount = total - sum;

  return (
    <View>
      {tabBarIcon({ color, iconName })}
      <View
        style={{
          borderWidth: 1,
          borderColor: BaseColor.whiteColor,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: 20,
          height: 20,
          backgroundColor: 'red',
          top: -5,
          right: -12,
          borderRadius: 10,
        }}
      >
        <Text whiteColor caption2>
          {/* {notifData_FromRed} */}
          {finalCount < 0 ? 0 : finalCount}
        </Text>
      </View>
    </View>
  );
};

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigatorMazi = ({ tabScreens = {} }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showIcon: true,
        showLabel: true, //untuk menghide title pada navigasi bottom bar
        // activeTintColor: BaseColor.whiteColor,
        // activeTintColor: colors.primary != '#FDC60A' ? 'yellow' : 'white',
        activeTintColor: BaseColor.goldColor,
        inactiveTintColor: BaseColor.grayColor,
        // inactiveTintColor: '#969696',
        // style: BaseStyle.tabBar,
        style: {
          //backgroundColor: "red", //colors.primary,
          paddingTop: 8,
        },
        labelStyle: {
          fontSize: 12,
          paddingBottom: 3,
        },
      }}
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.primary },
        //   tabBarBackground: "red",
        headerShown: false,
      }}
    >
      {Object.keys(tabScreens).map((name, index) => {
        const { options, component } = tabScreens[name];
        return (
          <BottomTab.Screen
            key={index}
            name={name}
            component={component}
            options={{
              ...options,
              title: t(options.title),
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
};
