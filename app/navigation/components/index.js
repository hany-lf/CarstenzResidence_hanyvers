/** @format */

import React from "react";
import { Icon, Text } from "@components";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { BaseColor, BaseStyle, useTheme } from "@config";
import getNotifRed from "../../selectors/NotifSelectors";
import { useSelector } from "react-redux";

export const tabBarIcon = ({ color, name }) => (
  <Icon name={name} size={20} solid color={color} />
);

export const tabBarIconHaveNoty = ({ color, name }) => {
  // const notifData_FromRed = useSelector(state => getNotifRed(state));
  // console.log('buat badge notifg', notifData_FromRed);

  const data = useSelector((state) => state.apiReducer.data);
  console.log('data di tabbar', data);
  let sum = 0;
  // data != null || data != undefined || data.length > 0 ? data.map((item, index) => {
  //   sum += parseInt(item.IsRead);
  // }) : sum = 0;

  const counter = useSelector((state) => state.counter);
  console.log("counter badge di tabbar", counter);
  const total = data.length;
  const finalCount = total - sum;

  return (
    <View>
      {tabBarIcon({ color, name })}
      <View
        style={{
          borderWidth: 1,
          borderColor: BaseColor.whiteColor,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: "red",
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
        activeTintColor: colors.primary != "#FDC60A" ? "yellow" : "white",
        inactiveTintColor: colors.primary != "#FDC60A" ? "white" : "gray", //BaseColor.grayColor,
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
