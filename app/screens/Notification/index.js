import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
  Button,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
// Load sample data
import { NotificationData } from '@data';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import getProject from '../../selectors/ProjectSelector';
import axios from 'axios';
import { API_URL } from '@env';
import styles from './styles';
import NotifService from '../../NotifService';
import getNotifRed from '../../selectors/NotifSelectors';
import { notifikasi_nbadge_decrease } from '../../actions/NotifActions';
import apiCall from '../../config/ApiActionCreator';

import { decrement } from '../../actions/actionsTotal';
import Modal from 'react-native-modal';
import moment from 'moment';
import { API_URL_LOKAL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

const Notification = (props) => {
  const { navigation, route, notification } = props;
  // console.log('route props', route);
  // console.log('route notification', notification);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  // const [notification, setNotification] = useState(NotificationData);
  const users = useSelector((state) => getUser(state));
  const project = useSelector((state) => getProject(state));

  const [email, setEmail] = useState('');
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  console.log('users di notif', users.user);
  const [loading, setLoading] = useState(true);
  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [urlApi, seturlApi] = useState(API_URL);
  const [dataNotif, setDataNotif] = useState([]);
  const dataNotifBadge = useSelector((state) => getNotifRed(state));
  console.log('data notif badge di notif', dataNotifBadge.data);
  const dispatch = useDispatch();
  const [minusKlikNotif, setMinusKlikNotif] = useState(0);
  const [read, setRead] = useState(false);
  const [color, setColor] = useState('blue');
  const [indexList, setIndexList] = useState();

  const data = useSelector((state) => state.apiReducer.data);
  // console.log('data notif length', data);
  // const [isRead, setisRead] = useState(data.IsRead);

  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState();

  const loadings = useSelector((state) => state.apiReducer.loading);
  const counter = useSelector((state) => state.counter);

  useFocusEffect(
    React.useCallback(() => {
      // Optionally perform any action needed when the screen is focused
      dispatch(
        apiCall(API_URL_LOKAL + `/setting/notification`, {
          email: email,
          entity_cd: entity_cd,
          project_no: project_no,
          token: users.Token,
        }),
      );
    }, []),
  );

  // useEffect(() => {
  //   // console.log('data di notif', data);
  // }, [data]);

  const refreshDataNotif = () => {
    dispatch(
      apiCall(API_URL_LOKAL + `/setting/notification`, {
        email: email,
        entity_cd: entity_cd,
        project_no: project_no,
        token: users.Token,
      }),
    );
  };

  const goNotif = decrement;
  console.log('minus', goNotif);
  // const cobanotif = useSelector(state => getNotifRed(state));

  // http://apps.pakubuwono-residence.com/apiwebpbi/api/notification

  // POST
  // body : email, entity_cd, project_no, device (hardcode aja valuenya Mobile)
  //-----FOR GET ENTITY & PROJJECT
  const notif = new NotifService(onNotif);

  const onNotif = (notif) => {
    console.log('notif di screen notification', notif);
    // navigation.navigate('Notification', notif);
    console.log('notif data screen notification', notif.data.title);
    console.log('notif data screen notification', notif.data.body);
    // Alert.alert('di index.app on notif');
  };

  // --- useeffect untuk project
  useEffect(() => {
    if (project && project.data && project.data.length > 0) {
      // console.log('entity useeffect di home', project.data[0].entity_cd);
      setEntity(project.data[0].entity_cd);
      setProjectNo(project.data[0].project_no);
    }
  }, [project]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(
      users != null && users.userData != null ? users.userData.email : '',
    );
  }, [email]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (entity_cd && project_no) {
      getNotification();
      // dispatch(
      //   apiCall(API_URL_LOKAL + `/setting/notification`, {
      //     email: email,
      //     entity_cd: entity_cd,
      //     project_no: project_no,
      //     token: users.Token,
      //   }),
      // );
    }
  }, [entity_cd, project_no]);
  // --- useeffect untuk project

  const getNotification = async (data) => {
    console.log('get notif fokus');
    const formData = {
      email: email,
      entity_cd: entity_cd,
      project_no: project_no,
    };
    // setEntity(data.entity_cd);
    // setProject(data.project_no);

    console.log('form data notif', formData);

    const config = {
      url: API_URL_LOKAL + `/setting/notification`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    };

    await axios(config)
      .then((res) => {
        // console.log('res tiket multi', res.data);
        const resNotif = res.data.notifications;
        console.log('res notif', resNotif);
        // console.log('resNotif', res);
        setDataNotif(resNotif);
        setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('err data notif', error);
        // alert('error nih');
      });
  };

  const goNotifDetail = (item, index) => () => {
    console.log('index klik', item);
    dispatch({ type: 'DECREMENT' });
    // setMessageSuccess({item});
    // showModalSuccess(true);
    changesRead(item.rowID);
    // setIndexList(index);
    // setisRead(1);
    navigation.navigate('NotificationDetail', { item: item });
    // navigation.navigate('')

    // if (index === true) {
    //   // setRead(!read);
    //   setColor('red');
    // }
  };

  const changesRead = async (rowID) => {
    const params = {
      notif_id: rowID,
      entity_cd: entity_cd,
      project_no: project_no,
    };
    console.log('params', params);

    const config = {
      url: API_URL_LOKAL + `/setting/notification-read`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${users.Token}`,
      },
      params: params,
    };
    await axios(config)
      .then((res) => {
        console.log('res change read', res.data);
        //  const resNotif = res.data;
        // getNotification(email, entity_cd, project_no);
        refreshDataNotif();
        // console.log('resNotif', res);
        //  setDataNotif(resNotif);
        //  setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('err data notif', error);
        // alert('error nih');
      });
  };

  const onCloseModal = () => {
    showModalSuccess(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('ini refresh on di home', users.userData);
    // if (user && user.userData) {
    //     console.log('user di home refresh', user),
    //     console.log('userData di home refresh', user.userData),

    //    .then(() => setRefreshing(false));  // Ensure refreshing ends after data is fetched
    // }
    dispatch(
      apiCall(API_URL_LOKAL + `/setting/notification`, {
        email: email,
        entity_cd: entity_cd,
        project_no: project_no,
        token: users.Token,
      }),
    );
    wait(5000).then(() => {
      setRefreshing(false);
    });
  }, [users, dispatch]);

  //untuk refresh screen, load data notif dan badge notif
  // const refreshPull = () => {
  //   // alert('refresh  pull');
  //   refreshDataNotif(); //badge notif
  //   // getNotification(data); //data notif
  // };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('notification')}
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
          // navigation.navigate('MainStack');
        }}
      />
      {loadings ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          // contentContainerStyle={{paddingHorizontal: 20}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              // onRefresh={() => onRefresh()}
              onRefresh={onRefresh}
            />
          }
          // data={dataNotif}
          data={data}
          // data={dataNotif}
          keyExtractor={(item, index) => item.rowID}
          renderItem={({ item, index }) => (
            // console.log('index notif', index),
            <ListThumbCircleNotif
              key={index}
              disabled={item.isRead == 1 ? true : false}
              style={{
                paddingHorizontal: 20,
                backgroundColor:
                  colors.background == 'white'
                    ? item.isRead == 0
                      ? 'white'
                      : 'lightgrey'
                    : item.isRead == 0
                    ? '#191919'
                    : '#010101',
              }}
              // image={item.image}
              txtLeftTitle1={item.report_no}
              txtLeftTitle2={
                item.notification_cd == 'NEW'
                  ? 'Customer Service'
                  : item.notification_cd
              }
              txtContent={item.remarks}
              txtRight={item.notification_date}
              onPress={goNotifDetail(item, index)}
              // onPress={() => clickNotif()}
            />
          )}
        />
      )}
      {/* {modalSuccessVisible == true ? (
        <Text>{messageSuccess.item.Device}</Text>
      ) : (
        <Text>visible false</Text>
      )} */}
    </SafeAreaView>
  );
};

export default Notification;
