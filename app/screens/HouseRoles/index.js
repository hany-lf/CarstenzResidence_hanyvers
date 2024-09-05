import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
} from '@components';

import { BaseColor, BaseStyle, useTheme } from '@config';

// Load sample data

// import {NotificationData} from '@data';

import React, { useState, useEffect } from 'react';

import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';

// import getUser from '../../selectors/UserSelectors';

import Pdf from 'react-native-pdf';

import ReactNativeBlobUtil from 'react-native-blob-util';

// import RNFetchBlob from 'rn-fetch-blob';

const HouseRoles = (props) => {
  const { navigation, route } = props;

  //   console.log('route params', route);

  //   const paramsItem = route.params;

  const { t } = useTranslation();

  const { colors } = useTheme();

  // const repl = paramsItem.link_url;
  //   const repl = {
  //     link_url: 'https://ifca.carstensz.co.id/house-rule.pdf',
  //   };
  const repl = 'https://ifca.carstensz.co.id/house-rule.pdf';

  console.log('repl', repl);

  //   const url_hard = '';

  const source = {
    uri: repl,
    // uri: 'https://ifca.carstensz.co.id/house-rule.pdf',

    cache: true,
  };

  const downloadForIOS = async (items) => {
    // const item = items;

    const url = items.link_url;

    // Extract the filename from the URL

    const filenameWithExtension = url.split('/').pop();

    console.log('filenamewith', filenameWithExtension);

    // Remove the .pdf extension (case insensitive)

    const filename = filenameWithExtension.replace(/\.pdf$/i, '');

    const path =
      ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + filename + '.pdf';

    const response = await ReactNativeBlobUtil.config({
      fileCache: true,

      appendExt: 'pdf',

      path,
    })

      .fetch('GET', url, {
        Accept: 'application/pdf',

        'Content-Type': 'application/pdf',
      })

      .progress((received, total) => {
        console.log('progress', received / total);
      })

      .then(async (res) => {
        console.log('The file saved to ', res.path());
      });

    ReactNativeBlobUtil.ios.previewDocument(path); //ini untuk memunculkan menu preview document di ios

    return response;
  };

  const downloadFile = () => {
    // const item = paramsItem;
    const item = { link_url: repl };
    console.log('item params download file', item);

    // console.log('item params download file', item);

    if (Platform.OS === 'ios') {
      downloadForIOS(item);
    } else {
      // let destPathIos =

      //   ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + item.doc_no + '.pdf';

      const {
        // dirs: {DownloadDir, DocumentDir},

        dirs: { PictureDir, DocumentDir },
      } = ReactNativeBlobUtil.fs;

      const fileDirPathAndroid = '/storage/emulated/0/Download';

      const aPath = Platform.select({
        ios: DocumentDir,

        android: fileDirPathAndroid,
      });

      // console.log('apath', aPath);

      const url = item.link_url;

      // Extract the filename from the URL

      const filenameWithExtension = url.split('/').pop();

      console.log('filenamewith', filenameWithExtension);

      // Remove the .pdf extension (case insensitive)

      const filename = filenameWithExtension.replace(/\.pdf$/i, '');

      console.log('filename', filename);

      const fPath = `${aPath}/` + filename + `.pdf`;

      console.log('fpath', fPath);

      const configOptions = Platform.select({
        ios: {
          fileCache: true,

          // path: fPath,

          notification: true,

          appendExt: 'pdf',

          path: fPath,
        },

        android: {
          fileCache: true,

          addAndroidDownloads: {
            useDownloadManager: true,

            notification: true,

            path: fPath,

            mime: 'application/pdf',

            mediaScannable: true,

            description: 'Downloading...',

            title: 'Download pdf',
          },

          // appendExt: 'png',

          indicator: true,

          IOSBackgroundTask: true,

          path: fPath,

          // ReactNativeBlobUtil.fs.dirs.DCIMDir +

          // '/image_' +

          // imageReplace,
        },
      });

      ReactNativeBlobUtil.config(
        configOptions,

        //     {

        //     fileCache : true,

        //     addAndroidDownloads: {

        //         path: RNFetchBlob.fs.dirs.DownloadDir +'/downloads/'+item.descs+'.pdf',

        //         useDownloadManager: true,

        //         notification: true,

        //         overwrite: true,

        //         description: 'downloading content...',

        //         mime: 'application/pdf',

        //         mediaScannable: true

        //     }

        // }
      )

        .fetch('GET', item.link_url, {
          Accept: 'application/pdf',

          'Content-Type': 'application/pdf',
        })

        .progress((received, total) => {
          console.log('progress', received / total);

          // setToastVisible(true);
        })

        .then(async (res) => {
          console.log('The file saved to ', res.path());

          alert('Saved at : ' + res.path());

          // android.actionViewIntent(res.path(), 'application/pdf')

          // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
        });
    }
  };

  // const downloadFile = () => {

  //   const url = repl;

  //   console.log('url', url);

  //   //  const android = RNFetchBlob.android;

  //   let dirs = ReactNativeBlobUtil.fs.dirs;

  //   //  console.log('dirs', dirs);

  //   const title = paramsItem.doc_no + '_' + paramsItem.remark + '.pdf';

  //   // send http request in a new thread (using native code)

  //   ReactNativeBlobUtil.config({

  //     // add this option that makes response data to be stored as a file,

  //     // this is much more performant.

  //     fileCache: true,

  //     // android only options, these options be a no-op on IOS

  //     addAndroidDownloads: {

  //       path:

  //         dirs.DownloadDir +

  //         '/downloads/' +

  //         paramsItem.doc_no +

  //         '_' +

  //         paramsItem.remark +

  //         '.pdf',

  //       useDownloadManager: true,

  //       // Show notification when response data transmitted

  //       notification: true,

  //       // Title of download notification

  //       title: title,

  //       // File description (not notification description)

  //       description: 'downloading content...',

  //       mime: 'application/pdf',

  //       // Make the file scannable  by media scanner

  //       mediaScannable: true,

  //     },

  //   })

  //     .fetch('GET', url, {

  //       //some headers ..

  //     })

  //     .then(res => {

  //       // the temp file path

  //       console.log('The file saved to ', res.path());

  //     });

  // };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('House Roles')}
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
        renderRight={() => {
          return (
            <Icon
              name="download"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressRight={() => {
          downloadFile();
        }}
      />

      <View style={stylesCurrent.container}>
        {/* <Pdf

          source={{

            uri: paramsItem.link_url,

            cache: true,

          }}

          // source={require('@assets/termsconditions/Facility_Booking_System_Regulation.pdf')}

          onLoadComplete={(numberOfPages, filePath) => {

            console.log(`Number of pages: ${numberOfPages}`);

          }}

          onPageChanged={(page, numberOfPages) => {

            console.log(`Current page: ${page}`);

          }}

          onError={error => {

            console.log(error);

          }}

          onPressLink={uri => {

            console.log(`Link pressed: ${uri}`);

          }}

          password={'220359'}

          style={stylesCurrent.pdf}

          fitWidth={true}

        /> */}

        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          // password={'220359'}

          style={stylesCurrent.pdf}
        />

        {/* <Text>{paramsItem.link_url}</Text> */}
      </View>
    </SafeAreaView>
  );
};

export default HouseRoles;

const stylesCurrent = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'flex-start',

    alignItems: 'center',

    marginTop: 25,
  },

  pdf: {
    flex: 1,

    width: Dimensions.get('window').width,

    height: Dimensions.get('window').height,
  },
});
