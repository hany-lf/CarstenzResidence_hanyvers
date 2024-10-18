import {
  Button,
  Header,
  Icon,
  Image,
  SafeAreaView,
  Text,
  TextInput,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
// Load sample data
import { UserData } from '@data';
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import {
  saveProfile,
  actionTypes,
  saveFotoProfil,
} from '../../actions/UserActions';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL_LOKAL } from '@env';

const ProfileEdit = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [images, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => getUser(state));
  console.log('user di profil', user);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [datas, setData] = useState();
  const saveProfilerResult = useCallback(
    () => dispatch(saveProfile()),
    [dispatch],
  );
  const [imagesCek, setImagesCek] = useState('');

  useEffect(() => {
    if (user != null && user.userData != null && user.userData.pict != null) {
      console.log('useeffect user.userData.pict', user.userData.pict);
      setImagesCek(user.userData.pict);
    } else {
      setImagesCek(API_URL_LOKAL + '/public/storage/photo_resident/user.png');
    }
    console.log('User state updated: profil edit', user);
  }, [user]);

  // --- useEffect untuk update email/name
  useEffect(() => {
    if (user != null && user.userData != null) {
      setName(user.userData.name); // Update name hanya ketika user data berubah
      setPhone(user.userData.Handphone);
      setEmail(user.userData.email);
    }
  }, [user]); // Dependensi hanya pada user
  // --- useeffect untuk update email/name
  // useEffect(() => {
  //   setPhone(
  //     user != null && user.userData != null && user.userData.Handphone != null
  //       ? user.userData.Handphone
  //       : phone,
  //   );
  // }, [phone]);
  // // --- useeffect untuk update email/name

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen is focused');
      if (user != null && user.userData != null && user.userData.pict != null) {
        console.log('usefocus user.userData.pict', user.userData.pict);
        setImagesCek(user.userData.pict);
      } else {
        setImagesCek(API_URL_LOKAL + '/public/storage/photo_resident/user.png');
      }
    }, [user]), // Removed fotoprofil from the dependency array
  );

  // --- useeffect untuk update email/name
  // useEffect(() => {
  //   setEmail(user != null && user.userData != null ? user.userData.email : '');
  // }, [email]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (user === null) {
      props.navigation.navigate('Auth');
    }
  });

  const saveProfiles = useCallback(
    () =>
      dispatch(
        saveProfile({
          emails: email,
          name,
          phone,
          genders: 'Male',
        }),
      ),
    // console.log('You clicked ', event);
    [{ emails: email, name, phone, genders: 'Male' }, dispatch],
  );

  const handphonechanged = useCallback((value) => setPhone(value), []);
  const namechanged = useCallback((value) => setName(value), []);

  const savePhoto = useCallback(() => {
    dispatch(
      saveFotoProfil({
        image: imagesCek,
        email: email,
        token_firebase: user.Token,
      }),
    );
    // dispatch(saveFotoProfil(images));

    // dispatch(saveFotoProfilCek({image: images, email: user.user}));
    console.log('images', imagesCek);
    setTimeout(() => {
      // navigation.push('Profile');
      navigation.navigate('Home');
    }, 3000);
  }, [
    { image: imagesCek, email: email, token_firebase: user.Token },
    user,
    imagesCek,
    dispatch,
  ]);
  // }, [dispatch, images, navigation, user]);

  const handlePhotoPick = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('datImage', images);
        Alert.alert(
          'Select a Photo',
          'Choose the place where you want to get a photo',
          [
            { text: 'Gallery', onPress: () => fromGallery() },
            { text: 'Camera', onPress: () => fromCamera() },
            {
              text: 'Cancel',
              onPress: () => console.log('User Cancel'),
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      })
      .catch((e) => {
        console.log('error cache clean fotoprofil', e);
        // alert(e);
      });
  };

  const fromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: false,
    })
      .then((image) => {
        console.log('received image', images);

        const newImage = [
          {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
        ];
        setImage(newImage);
        setImagesCek(image.path); // Update imagesCek with the new image path
        // savePhoto();
        // uploadPhoto();
        // setImage(prevState => ({
        //   image: [
        //     ...prevState.image,
        //     {
        //       uri: image.path,
        //       width: image.width,
        //       height: image.height,
        //       mime: image.mime,
        //     },
        //   ],
        // }));
      })
      .catch((e) => console.log('tag', e));
  };

  const fromGallery = (cropping, mediaType = 'photo') => {
    // let imageList = [];

    ImagePicker.openPicker({
      width: 500,
      height: 500,

      multiple: false,
    })
      .then((image) => {
        console.log('received images', images);
        const newImage = [
          {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
        ];
        setImage(newImage);
        setImagesCek(image.path); // Update imagesCek with the new image path
        // savePhoto();
        // uploadPhoto();
        // image.map(image => {
        //   imageList.push({
        //     uri: image.path,
        //     width: image.width,
        //     height: image.height,
        //     mime: image.mime,
        //   });
        // });
        // console.log('received images', image);
        // console.log('received images >', imageList);
        // setImage(imageList);
        // for (var i = 0; i < image.length; i++) {
        //   setImage({
        //     images: [
        //       {
        //         uri: image[i].path,
        //         width: image[i].width,
        //         height: image[i].height,
        //         mime: image[i].mime,
        //       },
        //     ],
        //   });
        // }
      })
      .catch((e) => console.log('tag', e));
  };

  useEffect(() => {
    if (images.length !== 0) {
      console.log('jalanin savephoto');
      savePhoto();
      // setImagesCek(user.pict);
      // setImagesCek(images.path); // Update imagesCek with the new image path
    }
  }, [imagesCek, user]);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <ScrollView>
        <View style={styles.contain}>
          <TouchableOpacity onPress={() => handlePhotoPick()}>
            <View>
              <Icon
                name="camera"
                size={22}
                color={colors.primary}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Image
              key={imagesCek}
              source={{ uri: imagesCek }}
              style={styles.thumb}
            />
          </View>

          {/* <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('account')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={text => setName(text)}
            autoCorrect={false}
            placeholder={t('input_id')}
            // placeholder={user.name}
            placeholderTextColor={BaseColor.grayColor}
            value={name}
            selectionColor={colors.primary}
          /> */}
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('name')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            // onChangeText={text => setName(text)}
            onChangeText={namechanged}
            autoCorrect={false}
            placeholder={t('input_name')}
            placeholderTextColor={BaseColor.grayColor}
            value={name}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            // onChangeText={text => setEmail(text)}
            autoCorrect={false}
            editable={false}
            selectTextOnFocus={false}
            placeholder={t('input_email')}
            placeholderTextColor={BaseColor.grayColor}
            value={email}
            // value={emailuser}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('Handphone')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            // onChangeText={text => setPhone(text)}
            onChangeText={handphonechanged}
            // autoCorrect={false}
            keyboardType="numeric"
            placeholder={t('input_phone')}
            placeholderTextColor={BaseColor.grayColor}
            value={phone}
            selectionColor={colors.primary}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          loading={loading}
          full
          // onPress={() => {
          //   setLoading(true);
          //   setTimeout(() => {
          //     // navigation.goBack();
          //     saveProfiles();
          //   }, 500);
          // }}
          onPress={() => saveProfiles()}
        >
          {t('confirm')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ProfileEdit;
