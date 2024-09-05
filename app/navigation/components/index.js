/** @format */

import React, { act, useEffect } from 'react';
import { Icon, Text } from '@components';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@config';
import getNotifRed from '../../selectors/NotifSelectors';
import { useSelector } from 'react-redux';
import {
  NavHome,
  NavEmergency,
  NavAnnouncement,
  NavAccount,
} from '../../components/Svg';

// export const tabBarIcon = ({ color, NameSvg }) => (
//   <NameSvg width={20} height={20} fill={color} />
// );

// Define the tabBarIcon function
export const tabBarIcon = ({ color, iconName, isFocused }) => {
  // console.log('iconName tab bar icon', iconName);
  // console.log('isFocused tab bar icon', isFocused);
  const icons = {
    home: NavHome,
    phone: NavEmergency,
    bell: NavAnnouncement,
    account: NavAccount,
    // Tambahkan ikon lainnya jika diperlukan
  };

  const IconComponent = icons[iconName];

  return IconComponent ? (
    <IconComponent
      width={25}
      height={25}
      stroke={color}
      fill={isFocused ? BaseColor.goldColor : BaseColor.grayColor} //kalo mau di fill svg nya pake ini, kalo ngga pake stroke aja
    />
  ) : null;
};

export const tabBarIconHaveNoty = ({ color, iconName, isFocused }) => {
  // const notifData_FromRed = useSelector(state => getNotifRed(state));
  // console.log('icon name di icon haveduty', iconName);

  const data = useSelector((state) => state.apiReducer.data);

  useEffect(() => {
    // console.log('data di tabbar', data);
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
      {tabBarIcon({ color, iconName, isFocused })}
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
          top: -7,
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
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.primary,
          paddingTop: 2,
          paddingBottom: 8,
          height: 60,
        },
        //   tabBarBackground: "red",
        headerShown: false,
        showIcon: true,
        showLabel: true, //untuk menghide title pada navigasi bottom bar
        // activeTintColor: BaseColor.whiteColor,
        // activeTintColor: colors.primary != '#FDC60A' ? 'yellow' : 'white',
        activeTintColor: BaseColor.goldColor,
        inactiveTintColor: BaseColor.grayColor,
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: BaseColor.goldColor,
        // inactiveTintColor: '#969696',
        // style: BaseStyle.tabBar,
        style: {
          //backgroundColor: "red", //colors.primary,
          // paddingTop: 3,
        },
        labelStyle: {
          fontSize: 10,
          paddingBottom: 8,
        },
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
