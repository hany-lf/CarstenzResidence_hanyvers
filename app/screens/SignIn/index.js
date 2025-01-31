import { AuthActions } from '@actions';
import {
  Button,
  Header,
  Icon,
  SafeAreaView,
  Text,
  TextInput,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { Images } from '@config';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import getUser from '../../selectors/UserSelectors';
import getProject from '../../selectors/ProjectSelector';
import errorsSelector from '../../selectors/ErrorSelectors';
import { isLoadingSelector } from '../../selectors/StatusSelectors';
import { login, actionTypes } from '../../actions/UserActions';
import { data_project } from '../../actions/ProjectActions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { API_URL_LOKAL } from '@env';
import { FontFamily } from '../../config';
import Fonts from '../../config/Fonts';
import DeviceInfo from 'react-native-device-info';
import VersionInfo from 'react-native-version-info';

const SignIn = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);

  const [token_firebase, setTokenFirebase] = useState('');
  const [token, setTokenBasic] = useState('');

  const user = useSelector((state) => getUser(state));
  const userError = useSelector((state) => getUser(state));
  console.log('usererror?', userError);
  const project = useSelector((state) => getProject(state));
  const [macAddress, setMacAddress] = useState('');
  const [version, setVersion] = useState('');
  const [buildVersion, setBuildVersion] = useState('');

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const signInButtonRef = useRef(null); // Referensi ini bisa digunakan jika Anda memiliki custom button

  useEffect(() => {
    const init = async () => {
      // const {version} = Constants.manifest;
      // const version = require('../../package.json');
      // console.log('ceeek', version);
      console.log(VersionInfo.appVersion);
      console.log(VersionInfo.buildNumber);
      console.log(VersionInfo.buildVersion);
      console.log(VersionInfo.bundleIdentifier);
      const version = VersionInfo.appVersion;
      setVersion(version);
      setBuildVersion(VersionInfo.buildVersion);
    };

    init();
  }, []);

  useEffect(() => {
    // Ambil parameter dari route

    const { message: paramMessage } = route.params || {};
    console.log('props for message', route);
    console.log('ini alert message', paramMessage);
    if (paramMessage) {
      // Anda bisa menampilkan pesan ini di UI jika diinginkan
      console.log('message session alert', paramMessage); // Atau gunakan state untuk menampilkannya di UI
      Alert.alert('ini alert message', paramMessage);
    }
  }, [route.params]);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('enabled fcm', enabled);

    if (enabled) {
      getFcmToken();
      console.log('Authorization status:', authStatus);
    }
  };

  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
        setTokenFirebase(fcmToken);
      } else {
        console.log('Failed', 'No token received');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const loginklik = async () => {
    // requestUserPermission();
    // console.log('54 run loginKlik');
    try {
      const mac = await DeviceInfo.getMacAddress();
      // console.log('mac address', mac);
      // setMacAddress(mac);

      setLoading(true);

      console.log('token_firebase signin', token_firebase);
      const loginResponse = await loginUser(); // Tunggu respons login
      // // console.log('login response awiat', loginResponse);

      if (loginResponse.success === true) {
        console.log('login sukses');
        // Jika login berhasil, panggil loadProject
        // loadProject();
      } else {
        console.log('Login failed:', loginResponse.message);
      }
    } catch (error) {
      console.log('Error during login:', error);
    } finally {
      setLoading(false); // Pastikan loading di-set ke false di akhir
    }
  };

  const loginUser = useCallback(() => {
    return dispatch(login(email, password, token_firebase, macAddress)); // Pastikan ini mengembalikan promise
  }, [email, password, token_firebase, macAddress, dispatch]);

  // const loginUser = useCallback(
  //   () => dispatch(login(email, password, token_firebase, macAddress)),
  //   [email, password, token_firebase, macAddress, dispatch],
  // );

  const loadProject = useCallback(() => {
    if (user && user.Token) {
      dispatch(
        data_project({
          emails: email,
          token_firebases: user.Token,
        }),
      );
    }
  }, [email, user, dispatch]);

  useEffect(() => {
    if (user && user.Token) {
      loadProject(); // Panggil loadProject ketika user.Token tersedia
    }
  }, [user, loadProject]);

  const passwordChanged = useCallback((value) => setPassword(value), []);
  const emailChanged = useCallback((value) => setEmail(value), []);

  // useEffect(() => {
  //   // console.log('user for reset? ', user);
  //   // console.log('project di useeffect signin -->', project);
  //   if (user !== null && project !== null && user.length < 0) {
  //     props.navigation.navigate('MainStack');

  //     // navigation.navigate('MainStack');
  //   }
  // });
  useEffect(() => {
    // Pastikan user dan project tidak null
    if (user !== null && project !== null && user.length < 0) {
      // Panggil data_project dengan email dan token
      dispatch(
        data_project({
          emails: user.email, // Pastikan menggunakan 'email' bukan 'emails'
          token_firebases: user.Token, // Pastikan menggunakan 'token_firebase' bukan 'token_firebases'
        }),
      );

      // Navigasi ke MainStack setelah memanggil data_project
      props.navigation.navigate('MainStack');
    }
  }, [user, project, dispatch]); // Tambahkan dependency array

  // Menggunakan useEffect untuk memfokuskan TextInput saat screen terbuka
  useEffect(() => {
    emailInputRef.current?.focus(); // Memanggil focus pada TextInput
  }, []);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    // <KeyboardAvoidingView
    //   keyboardVerticalOffset="100"
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{
    //     flex: 1,
    //   }}
    // >
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <View style={{ marginVertical: 50 }} />
      <View>
        <Image
          // source={require('../../assets/images/pakubuwono.png')}
          //source={require("../../assets/images/Default-Black.webp")}
          // source={require("../../assets/images/Logo-Carstensz.png")}
          source={require('../../assets/images/image-home/vector-logo-carstensz-navy.png')}
          style={{
            height: 70,
            width: '100%',
            alignSelf: 'center',
            // marginHorizontal: 100,
            // marginBottom: 40,
            //marginTop: 10,
            flexDirection: 'row',
            resizeMode: 'contain',
          }}
        />
      </View>

      <View style={styles.contain}>
        <TextInput
          ref={emailInputRef}
          style={[
            BaseStyle.textInput,
            { backgroundColor: colors.border, fontSize: 10 },
          ]}
          // placeholderTextColor={colors.text}
          onChangeText={emailChanged}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={t('input_id')}
          value={email}
          selectionColor={colors.primary}
          // onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <TextInput
          ref={passwordInputRef}
          style={[
            BaseStyle.textInput,
            { marginTop: 10, backgroundColor: colors.border },
          ]}
          // onSubmitEditing={() => signInButtonRef.current?.focus()}
          onChangeText={passwordChanged}
          autoCorrect={false}
          placeholder={t('input_password')}
          secureTextEntry={hidePass}
          value={password}
          selectionColor={colors.primary}
          icon={
            <Icon
              onPress={() => setHidePass(!hidePass)}
              active
              name={hidePass ? 'eye-slash' : 'eye'}
              size={20}
              color={colors.text}
            />
          }
        />
        <View
          style={{ width: '100%', marginVertical: 16 }}
          ref={signInButtonRef}
        >
          <Button
            full
            loading={loading}
            style={{ marginTop: 20 }}
            // onPress={loginUser}
            onPress={loginklik}
            disable={loading ? true : false}
          >
            <Text
              style={{
                color: BaseColor.whiteColor,
                fontSize: 14,
                fontFamily: Fonts.type.LatoBold,
              }}
            >
              {t('sign_in')}
            </Text>
            {/* {t('sign_in')} */}
          </Button>
        </View>
        <View style={styles.contentActionBottom}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text body2 grayColor>
              {t('forgot_your_password')}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => navigation.navigate('Skip')}>
            <Text body2 primaryColor>
              {t('Skip Login')}
            </Text>
          </TouchableOpacity> */}
        </View>

        <View
          style={{
            justifyContent: 'center',
            // flex: 1,
            alignItems: 'center',
            top: 100,
            // position: 'relative',
            // bottom: 50,
            // left: 0,
            // right: 0,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: colors.primary,
            }}
          >
            Version {version} {`(` + buildVersion + `)`}
            {/* {Platform.OS == 'android' ? 'Version 5.2.0.3' : 'Version 5.3'} */}
          </Text>
        </View>
      </View>

      {/* <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}></KeyboardAvoidingView> */}
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

export default SignIn;
