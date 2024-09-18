import { AuthActions } from '@actions';
import {
  Button,
  Icon,
  ProfileDetail,
  ProfilePerformance,
  SafeAreaView,
  Tag,
  Text,
  Header,
} from '@components';
import { BaseStyle, useTheme } from '@config';
// Load sample data
import { UserData } from '@data';
import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { actionTypes, login, logout } from '../../actions/UserActions';
import getUser from '../../selectors/UserSelectors';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL_LOKAL } from '@env';
import VersionInfo from 'react-native-version-info';

const { authentication } = AuthActions;

const Profile = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigation } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(UserData[0]);
  const user = useSelector((state) => getUser(state));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [version, setVersion] = useState('');
  // const [fotoprofil, setFotoProfil] = useState(
  //   user.pict != null ? user.pict.replace('https', 'http') : null,
  // );
  const [fotoprofil, setFotoProfil] = useState(null);
  console.log('profiles', user.pict);

  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);

  // ------ coba dari youtube

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  // const onLogOut = () => {
  //   dispatch([actionTypes.LOGOUT]);
  // };
  useEffect(() => {
    if (user == null) {
      props.navigation.navigate('SignIn');
    }
  });

  useEffect(() => {
    if (user != null && user.userData != null && user.userData.pict != null) {
      setFotoProfil(user.userData.pict);
    } else {
      setFotoProfil(API_URL_LOKAL + '/public/storage/photo_resident/user.png');
    }
    console.log('User state updated: profil useffect', user);
  }, [user]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setName(user != null && user.userData != null ? user.userData.name : '');
  }, [name]);
  // --- useeffect untuk update email/name

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : '');
  }, [email]);
  // --- useeffect untuk update email/name

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen is focused');
      console.log('User state updated: usefocuse profil', user);
      if (user != null && user.userData != null && user.userData.pict != null) {
        setFotoProfil(user.userData.pict);
      } else {
        setFotoProfil(
          API_URL_LOKAL + '/public/storage/photo_resident/user.png',
        );
      }
    }, [user]), // Removed fotoprofil from the dependency array
  );

  useEffect(() => {
    const init = async () => {
      // const {version} = Constants.manifest;
      // const version = require('../../package.json');
      // console.log('ceeek', version);
      console.log(VersionInfo.appVersion);
      console.log(VersionInfo.buildVersion);
      console.log(VersionInfo.bundleIdentifier);
      const version = VersionInfo.appVersion;
      setVersion(version);
    };

    init();
  }, []);

  const onLogOut = useCallback(() => {
    Alert.alert(
      'Are you sure ?',
      'Press Ok if you want to log out!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => logoutUser() },
      ],
      { cancelable: false },
    );
  }, [dispatch]);

  // const

  const onLogIn = () => {
    navigation.navigate('SignIn');
  };

  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('setting')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.contain}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {user && (
            <ProfileDetail
              // image={user.pict}
              image={fotoprofil}
              // image={{uri: `${user.pict}`}}
              textFirst={name}
              textSecond={email}
              // onPress={() => {
              //   navigation.navigate('ImageDetail', fotoprofil);
              // }}
            />
          )}

          <View style={{ width: '100%' }}>
            <TouchableOpacity
              style={styleItem}
              onPress={() => {
                navigation.navigate('Setting');
              }}
            >
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            {login && (
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('ProfileEdit');
                }}
              >
                <Text body1>{t('edit_profile')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )}
            {login && (
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('ChangePassword');
                }}
              >
                <Text body1>{t('change_password')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )}

            {/* {login && (
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('EBank');
                }}>
                <Text body1>{t('payments')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )} */}

            {/* {login && (
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('EAddress');
                }}>
                <Text body1>{t('billing_address')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )} */}

            {/* {login && (
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('EWishlist');
                }}>
                <Text body1>{t('product_wishlist')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )} */}

            {/* <TouchableOpacity
              style={styleItem}
              onPress={() => {
                navigation.navigate('PreviewComponent');
              }}>
              <Text body1>{t('preview_component')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={styleItem}
              onPress={() => {
                navigation.navigate('ContactUs');
              }}>
              <Text body1>{t('contact_us')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styleItem}
              onPress={() => {
                navigation.navigate('AboutUs');
              }}
            >
              <Text body1>{t('about_us')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styleItem}
              onPress={() => {
                navigation.navigate('Privacy');
              }}
            >
              <Text body1>{t('Privacy Policy')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              flex: 1,

              alignItems: 'center',
              paddingTop: 30,
              // position: 'absolute',
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
              Version {version}
              {/* {Platform.OS == 'android' ? 'Version 5.2.0.3' : 'Version 5.3'} */}
            </Text>
          </View>
        </ScrollView>
      </View>
      <View style={{ padding: 10 }}>
        <Button full loading={loading} onPress={() => onLogOut()}>
          {t('sign_out')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
