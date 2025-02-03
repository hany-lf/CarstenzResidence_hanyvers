import {
  CardReport03,
  CardReport08,
  CardReport07,
  ProfileGridSmall,
  SafeAreaView,
  Text,
  Header,
  Transaction2Col,
  Icon,
  Tag,
  Price3Col,
  ListTransactionExpand,
  Button,
} from '@components';
import { BaseStyle, useTheme } from '@config';
import { FRecentTransactions, FHotNews } from '@data';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { enableExperimental } from '@utils';

import moment from 'moment';
import Modal from 'react-native-modal';
import { API_URL_LOKAL } from '@env';

import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import HeaderHome from './HeaderHome';
import styles from './styles';
import HeaderCard from './HeaderCard';
import getUser from '../../selectors/UserSelectors';
import getProject from '../../selectors/ProjectSelector';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import numFormat from '../../components/numFormat';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import ModalDropdown_debtor from '@components/ModalDropdown_debtor';
import { ActivityIndicator } from 'react-native-paper';

const Billing = ({
  isCenter = false,
  isPrimary = false,
  style = {},
  onPress = () => {},
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => getUser(state));
  const project = useSelector((state) => getProject(state));
  const [hasError, setErrors] = useState(false);
  const [bill, setBill] = useState([]);
  const [data, setData] = useState([]);
  const [dataCurrent, setDataCurrent] = useState([]);
  // console.log("user,", user);
  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);

  const [email, setEmail] = useState('');
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [db_profile, setDb_Profile] = useState('');
  const [spinner, setSpinner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const TABS = [
    {
      id: 1,
      title: t('Due Date'),
    },
    {
      id: 2,
      title: t('Not Due'),
    },
  ];
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    const id = route?.params?.id;
    if (id) {
      TABS.forEach((tab) => {
        tab.id == id && setTab(tab);
      });
    }
  }, [route?.params?.id]);

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
    if (user && user.userData) {
      // console.log('entity useeffect di home', user);
      setEmail(user.userData.email);
    }
  }, [user]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    // console.log('apakah ini terload', email);
    setLoading(true);
    if (email) {
      fetchData();
      fetchDataCurrent();
      setRefreshing(false);
    }
  }, [email]);

  // Make function to call the api
  async function fetchData() {
    // console.log(
    //   'api due sumary',
    //   API_URL_LOKAL + `/modules/billing/due-summary/${email}`,
    // );
    const config = {
      method: 'get',
      url: API_URL_LOKAL + `/modules/billing/due-summary/${email}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    try {
      const res = await axios(config);
      setDataCurrent(res.data.data);
      // console.log('DATA DUE DATE -->', res.data.data);
      setLoading(false);
    } catch (error) {
      console.log('error due summary', error.response);
      setErrors(error.response.data);
      // alert(hasError.toString());
    }
  }

  async function fetchDataCurrent() {
    // console.log(
    //   'api current sumary',
    //   API_URL_LOKAL + `/modules/billing/current-summary/${email}`,
    // );
    const config = {
      method: 'get',
      url: API_URL_LOKAL + `/modules/billing/current-summary/${email}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    try {
      const res = await axios(config);
      // console.log('res current summary', res.data.data);
      setData(res.data.data);
      // console.log('data current', res.data.data);
      setLoading(false);
    } catch (error) {
      console.log('error fetch data current', error.response);
      // setErrors(error.response.data);
      // alert(hasError.toString());
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchDataCurrent();
      fetchData();
      setRefreshing(false);
    }, 5000);
  };

  // ----- ini gak kepake kan? ga ada yang panggil const sum
  const sum =
    dataCurrent != 0
      ? dataCurrent.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0)
      : null;
  // console.log('sum', sum);

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, { flex: 1 }]}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('Invoice')}
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
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {TABS.map((item, index) => (
            <View key={index} style={{ flex: 1, paddingHorizontal: 20 }}>
              <Tag
                primary
                style={{
                  backgroundColor:
                    tab.id == item.id ? colors.primary : colors.background,
                }}
                onPress={() => {
                  enableExperimental();
                  setTab(item);
                }}
              >
                <Text
                  body1={tab.id != item.id}
                  light={tab.id != item.id}
                  whiteColor={tab.id == item.id}
                >
                  {item.title}
                </Text>
              </Tag>
            </View>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {tab.id == 1 && dataCurrent != 0 && dataCurrent.length > 0
              ? dataCurrent.map((item, key) => (
                  <>
                    <ListTransactionExpand
                      onPress={() => navigation.navigate('FHistoryDetail')}
                      // key={item.id}
                      key={key}
                      tower={item.tower}
                      name={item.name}
                      trx_type={item.trx_type}
                      doc_no={item.doc_no}
                      doc_date={moment(item.doc_date).format('DD MMMM YYYY')}
                      descs={item.descs}
                      due_date={moment(item.due_date).format('DD MMMM YYYY')}
                      // mbal_amt={`${numFormat(`${item.trx_amt}`)}`}
                      trx_amt={`${numFormat(`${item.trx_amt}`)}`}
                      lot_no={item.lot_no}
                      debtor_acct={item.debtor_acct}
                      entity_cd={entity_cd}
                      project_no={project_no}
                      email={email}
                      fin_month={item.fin_month}
                      fin_year={item.fin_year}
                      tab_id={1}
                    />
                  </>
                ))
              : tab.id == 1 &&
                dataCurrent == 0 && (
                  <View
                    style={{
                      flex: 1,
                      // height: '100%',
                      marginTop: '70%',
                      // justifyContent: 'center',
                      // alignContent: 'center',
                      // alignItems: 'center',
                      // alignSelf: 'center',
                    }}
                  >
                    {/* <IconFontisto
                    name="holiday-village"
                    size={40}
                    color={colors.primary}
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}></IconFontisto> */}
                    <Text
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        fontSize: 16,
                        marginTop: 10,
                      }}
                    >
                      Sorry! Data not available.
                    </Text>
                  </View>
                )}
          </View>
        )}

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {tab.id == 2 && data != null && data.length > 0
            ? data.map((item, key) => (
                <ListTransactionExpand
                  onPress={() => navigation.navigate('FHistoryDetail')}
                  // key={item.id}
                  key={key}
                  tower={item.tower}
                  name={item.name}
                  trx_type={item.trx_type}
                  doc_no={item.doc_no}
                  doc_date={moment(item.doc_date).format('DD MMMM YYYY')}
                  descs={item.descs}
                  due_date={moment(item.due_date).format('DD MMMM YYYY')}
                  trx_amt={`${numFormat(`${item.trx_amt}`)}`}
                  // mbal_amt={`${numFormat(`${item.mbal_amt}`)}`}
                  lot_no={item.lot_no}
                  debtor_acct={item.debtor_acct}
                  entity_cd={entity_cd}
                  project_no={project_no}
                  email={email}
                  fin_month={item.fin_month}
                  fin_year={item.fin_year}
                  tab_id={2}
                />
              ))
            : tab.id == 2 && (
                <View
                  style={{
                    flex: 1,
                    // height: '100%',
                    marginTop: '70%',
                    // justifyContent: 'center',
                    // alignContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'center',
                  }}
                >
                  {/* <IconFontisto
                    name="holiday-village"
                    size={40}
                    color={colors.primary}
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}></IconFontisto> */}
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      fontSize: 16,
                      marginTop: 10,
                    }}
                  >
                    Sorry! Data not available.
                  </Text>
                </View>
              )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Billing;
