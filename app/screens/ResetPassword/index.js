import {
  Button,
  Header,
  Icon,
  SafeAreaView,
  TextInput,
  Text,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { API_URL_LOKAL } from '@env';
import getUser from '../../selectors/UserSelectors';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';

const successInit = {
  email: true,
};
const ResetPassword = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);
  const [requiredEmail, setRequiredEmail] = useState(true);
  const [Alert_Visibility, setAlertVisibility] = useState(false);
  const [pesan, setPesan] = useState('');
  const [error, setError] = useState();
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const user = useSelector((state) => getUser(state));
  console.log('user', user);

  const onReset = () => {
    if (email == '') {
      setSuccess({
        ...success,
        email: false,
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('SignIn');
      }, 500);
    }
  };

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null ? user.email : '');
  }, [email]);
  // --- useeffect untuk update email/name
  const btnSend = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // const isValid = setRequiredEmail(true);
    // const isValid = validating({
    //   email: {require: true},
    // });
    // console.log('isvalid?', isValid);
    if (email != '') {
      if (reg.test(email) === true) {
        const emails = email;

        const data = {
          email: email,
          newpass: password,
        };
        console.log('email', emails);
        fetch(API_URL_LOKAL + '/auth/reset-pass', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.Token}`,
          },
          body: data,
        })
          .then((res) => {
            // const resp = JSON.parse(res.Data);
            console.log('res forgot pass', res);
            setError(res.success);
            if (res.success) {
              setLoading(true);
              const pesan = res.message;
              alertFillBlank(true, pesan);
            } else if (res.success) {
              setLoading(true);
              const pesan = res.message;
              alertFillBlank(true, pesan);
              console.log('res pesan', res.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setLoading(true);
        // alert('Email not valid');
        const pesan = 'Email not valid';
        alertFillBlank(true, pesan);
      }
    } else {
      setLoading(true);
      // alert('Input email');
      const pesan = 'Input email please';
      alertFillBlank(true, pesan);
    }
  };

  // const btnSend = () => {
  //   const data = {
  //     email: email,
  //     newpass: password,
  //   };
  //   const config = {
  //     method: 'POST',
  //     url: API_URL_LOKAL + '/auth/reset-pass',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${user.Token}`,
  //     },
  //     params: data,
  //   };

  // fetch(API_URL_LOKAL + '/auth/reset-pass', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${user.Token}`,
  //   },
  //   body: data,
  // })
  //   axios(config)
  //     .then((res) => {
  //       // const resp = JSON.parse(res.Data);
  //       console.log('res forgot pass', res);
  //       setError(res.success);
  //       if (res.success == true) {
  //         setLoading(true);
  //         setPesan(res.message);
  //         const pesan = res.message;

  //         alertFillBlank(true, pesan);
  //       } else {
  //         setLoading(true);
  //         setPesan(res.message);
  //         const pesan = res.message;
  //         alertFillBlank(true, pesan);
  //         console.log('res pesan', res.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //     });
  // };

  const alertFillBlank = (visible, pesan) => {
    setAlertVisibility(visible);

    setLoading(false);
  };

  const onCloseModal = () => {
    if (error == false) {
      setAlertVisibility(false);
      navigation.navigate('SignIn');
    } else {
      setAlertVisibility(false);
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('reset_password')}
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
          props.navigation.navigate('SignIn');
        }}
      />
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            padding: 20,
            width: '100%',
          }}
        >
          <TextInput
            style={[
              BaseStyle.textInput,
              { marginTop: 10, backgroundColor: colors.border },
            ]}
            onChangeText={(text) => setPassword(text)}
            autoCorrect={false}
            placeholder={t('input_your_password')}
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

          {/* <TextInput
            style={[BaseStyle.textInput, { marginTop: 65 }]}
            onChangeText={(text) => setEmail(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                email: true,
              });
            }}
            autoCorrect={false}
            placeholder={t('email_address')}
            placeholderTextColor={
              success.email ? BaseColor.grayColor : colors.primary
            }
            value={email}
            selectionColor={colors.primary}
          /> */}
          <View style={{ width: '100%' }}>
            <Button
              full
              style={{ marginTop: 20 }}
              onPress={() => {
                // onReset();
                btnSend();
              }}
              loading={loading}
            >
              {t('reset_password')}
            </Button>
          </View>
        </View>
      </ScrollView>
      <View>
        <Modal
          isVisible={Alert_Visibility}
          style={{ height: '100%' }}
          onBackdropPress={() => setAlertVisibility(false)}
        >
          <View
            style={{
              // flex: 1,

              // alignContent: 'center',
              padding: 10,
              backgroundColor: '#fff',
              // height: ,
              borderRadius: 8,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 10,
                }}
              >
                {'Alert'}
              </Text>
              <Text style={{ fontSize: 13, color: colors.text }}>{pesan}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                style={{
                  marginTop: 10,
                  // marginBottom: 10,

                  width: 70,
                  height: 40,
                }}
                onPress={() => onCloseModal()}
              >
                <Text style={{ fontSize: 13, color: BaseColor.whiteColor }}>
                  {t('OK')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
