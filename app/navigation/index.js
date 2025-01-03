/** @format */

import { ApplicationActions } from '@actions';
import { AssistiveTouch } from '@components';
import { BaseSetting, useTheme } from '@config';
// import { NavigationContainer } from '@react-navigation/native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { languageSelect } from '@selectors';
import * as Utils from '@utils';
import i18n from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { Platform, StatusBar, View } from 'react-native';
//import { DarkModeProvider, useDarkMode } from "react-native-dark-mode";
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { AllScreens, ModalScreens } from './config';
import Profile from '@screens/Profile';
import SignIn from '../screens/SignIn';
import Loading from '../screens/Loading';

//for access token interval

import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Jika Anda menggunakan AsyncStorage
import UserController from '../controllers/UserController';
import { refreshTokenAccess, logout } from '../actions/UserActions';

const RootStack = createStackNavigator();
import { StackActions } from '@react-navigation/native';
import MainStack from './MainStack';
import Notification from '../screens/Notification';
import getUser from '../selectors/UserSelectors';
import Skip from '../screens/Skip';
import EProductDetail from '../screens/EProductDetail';
import messaging from '@react-native-firebase/messaging';
import Home from '../screens/Home';
import ResetPassword from '../screens/ResetPassword';
import ChangePasswordFirst from '../screens/ChangePasswordFirst';
import { Modal } from 'react-native-paper';

const Navigator = (props) => {
  const { theme, colors } = useTheme();
  const isDarkMode = false; //useDarkMode();
  const language = useSelector(languageSelect);
  const { navigation, route } = props;
  // const {route} = props;
  console.log('navigation from app for notif', props);
  // const navigation = useNavigation();
  console.log('route from app for notif', route);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);
  const user = useSelector((state) => getUser(state));
  const [initialRoute, setInitialRoute] = useState('MainStack');
  const [dataNotif, setDataNotif] = useState(false);
  const [isidataNotif, setisidataNotif] = useState([]);
  const [noti, setNoti] = useState(false);

  console.log('user null ?? ', user);

  useEffect(() => {
    // Hide screen loading
    SplashScreen.hide();

    // Config status bar
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    const onProcess = async () => {
      // Get current language of device
      const languageCode = language ?? BaseSetting.defaultLanguage;
      dispatch(ApplicationActions.onChangeLanguage(languageCode));
      // Config language for app
      await i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3', // <--- add this line for error pluralresolver
        resources: BaseSetting.resourcesLanguage,
        lng: languageCode,
        fallbackLng: languageCode,
      });
      setTimeout(() => {
        Utils.enableExperimental();
        setLoading(false);
        //    navigationRef?.current?.dispatch(StackActions.replace('OnBoard'));
      }, 300);
    };
    onProcess();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      // console.log('ini useeffect dimainstack - refresh otomatis');
      // checkAksesToken();
      const refreshTokenisTrue = await checkRefreshToken();

      if (refreshTokenisTrue == true) {
        checkTokenAkses();
      } else {
        dispatch(logout());
        navigation.navigate('SignIn', {
          message: 'Session ended, please relogin',
        });
        // console.log('refreshTokenisValid', refreshTokenisValid);
      }
    }, 60000); // Set interval untuk setiap 2 detik

    // Cleanup function untuk menghapus interval jika komponen di-unmount
    return () => clearInterval(interval);
  }, [user]);

  // const tes = () => {
  //   console.log('ini ke hit');
  // };

  const checkTokenAkses = async () => {
    // console.log('usercheckrefreshtoken', user != null);
    if (user != null || user != '' || user != 0) {
      // console.log('ada user nya', user);
      // Pastikan token tidak kosong
      if (!user.Token) {
        throw new Error('Token tidak ada');
      }

      const token = user.Token; //akses token
      // console.log('token check', token);

      if (token) {
        try {
          // Dekode token
          const decoded = jwtDecode(token);
          // console.log('Decoded token:', decoded);
          const currentTime = Math.floor(Date.now() / 1000);
          // console.log('Checking token validity...');
          const isTokenExpired = decoded.exp > currentTime;
          // const isTokenValid = true;
          // console.log('Is access token valid:', isTokenValid);
          if (isTokenExpired) {
            // console.log('istokenvalid', isTokenExpired); //besok lagi, ini dihapus, lalu istokenvalid true dijadiin balikin lagi
            return;
          } else {
            console.log('Access token has been refreshed');
            const userRefreshToken = user.refreshToken;
            dispatch(refreshTokenAccess(userRefreshToken));
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          // Jika token tidak valid, lakukan logout
          // console.log('harus kah logout?');
          // logout();
        }
      } else {
        console.log('Token tidak ditemukan');
        // Arahkan pengguna ke halaman login
        // navigation.navigate('Login');
      }
    } else {
      console.log('user koosng???');
      // props.navigation.navigate('SignIn');
    }
    // return null;
  };

  const checkRefreshToken = async () => {
    // console.log('usercheckrefreshtoken', user != null);
    if (user != null || user != '' || user != 0) {
      // console.log('ada user nya', user);
      // Pastikan token tidak kosong
      if (!user.refreshToken) {
        throw new Error('refreshToken tidak ada');
      }

      const refreshToken = user.refreshToken; //akses refresh token
      // console.log('refresh token check', refreshToken);

      if (refreshToken) {
        try {
          // Dekode token
          const decoded = jwtDecode(refreshToken);
          // console.log('Decoded token:', decoded);
          const currentTime = Math.floor(Date.now() / 1000);
          // console.log('Checking token validity...');
          const isTokenExpired = decoded.exp > currentTime;
          // const isTokenValid = true;
          // console.log('Is access token valid:', isTokenValid);
          if (isTokenExpired) {
            // console.log('isrefreshtokenexpired', isTokenExpired); //besok lagi, ini dihapus, lalu istokenvalid true dijadiin balikin lagi
            return true;
          } else {
            console.log('Access refreshToken token is valid');
            return false;
            //  const userRefreshToken = user.refreshToken;
            //  dispatch(refreshTokenAccess(userRefreshToken));
          }
        } catch (error) {
          console.error('Error decoding refreshtoken:', error);
          // Jika token tidak valid, lakukan logout
          // console.log('harus kah logout?');
          // logout();
        }
      } else {
        console.log('refresh Token tidak ditemukan');
        // Arahkan pengguna ke halaman login
        // navigation.navigate('Login');
      }
    } else {
      console.log('refresh token user null');
      // props.navigation.navigate('SignIn');
    }
    // return null;
  };

  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //     console.log('remoteMessage.data.type', remoteMessage.data.type);
  //     // navigation.navigate('Notification');
  //     // navigation.navigate('Notification', remoteMessage.notification);
  //     navigation.navigate('Notification');
  //     setDataNotif(true);
  //     setisidataNotif(remoteMessage.notification);
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //         console.log('remoteMessage get initial notification', remoteMessage);
  //         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"/
  //         // setInitialRoute('Notification', {params: remoteMessage.notification});
  //         // navigation.navigate('Notification', remoteMessage.notification);
  //         setDataNotif(true);
  //         setisidataNotif(remoteMessage.notification);
  //         // navigation.navigate('Notification');
  //       }
  //       setLoading(false);
  //     });

  //   messaging().setBackgroundMessageHandler(function (payload) {
  //     console.log('Message received: ', payload);
  //     console.log('PAYLOAD DATA->>>', payload.data);
  //     // const parsedJSON = JSON.parse(payload.data['json-data']);
  //     // console.log('Actions:', parsedJSON);
  //   });
  // }, []);

  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //   });

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //     navigation.navigate('Notification');
  //     setNoti(true);
  //     setInitialRoute('Notification');
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //         setNoti(true);
  //         setInitialRoute('Notification'); // e.g. "Settings"
  //       }
  //       setLoading(false);
  //     });
  // }, []);

  const goToNotification = () => {
    // navigation.navigate('Notification');
  };

  if (loading) {
    return null;
  }

  // const goToApp = name => {
  //   navigationRef?.current?.navigate(name);
  // };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* <DarkModeProvider> */}
      <NavigationContainer theme={theme} ref={navigationRef}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={initialRoute}
        >
          {loading ? (
            <RootStack.Screen name="Loading" component={Loading} />
          ) : user == null || user == '' || user == 0 ? (
            <RootStack.Screen name="SignIn" component={SignIn} />
          ) : user.isResetPass == 1 ? (
            <RootStack.Screen
              name="ChangePasswordFirst"
              component={ChangePasswordFirst}
            />
          ) : (
            <RootStack.Screen name="MainStack" component={MainStack} />
          )}

          {/* <RootStack.Screen name="MainStack" component={MainStack} /> */}
          <RootStack.Screen name="Notification" component={Notification} />
          {/* <RootStack.Screen name="Home" component={Home} /> */}
          <RootStack.Screen name="Skip" component={Skip} />
          <RootStack.Screen name="ResetPassword" component={ResetPassword} />
          <RootStack.Screen name="EProductDetail" component={EProductDetail} />
        </RootStack.Navigator>
      </NavigationContainer>
      {/* </DarkModeProvider> */}
      {/* {!loading && <AssistiveTouch goToApp={goToApp} />} */}
    </View>
  );
};

export default Navigator;
