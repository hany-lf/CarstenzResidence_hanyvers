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
  // console.log('user billing', user);
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

  const [debtor, setDebtor] = useState('');
  const [textDebtor, settextDebtor] = useState('');
  const [textNameDebtor, settextNameDebtor] = useState('');
  const [dataLotno, setDataLotno] = useState([]);
  const [textLot, setLotno] = useState('');
  const [dataDebtor, setDataDebtor] = useState([]);
  const [defaultDebtor, setDefaultDebtor] = useState(false);
  const [defaultLotNo, setDefaultLotNo] = useState(false);

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
    if (entity_cd && project_no && email) {
      const dataparams = {
        entity_cd: entity_cd,
        project_no: project_no,
        email: email,
      };
      getDebtor(dataparams);
    }
  }, [entity_cd, project_no, email]);

  //-----FOR GET DEBTOR
  const getDebtor = async (data) => {
    // console.log(object)
    // console.log('data for debtor', data);

    const formData = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      email: data.email,
    };

    // console.log('data for', formData);

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/debtor',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
      params: formData,
    };
    await axios(config)
      .then((res) => {
        const datas = res.data;
        const dataDebtors = datas.data;
        // console.log('res debtor', dataDebtors);
        // console.log('ada berapa length debtor', dataDebtors.length);

        setDefaultDebtor(true);
        setDebtor(dataDebtors[0].debtor_acct);
        // setTenantNo(dataDebtors[0].tenant_no);

        // setDebtor(dataDebtors[0].debtor_acct);
        // setTenantNo(dataDebtors[0].tenant_no);
        // settextDebtor(dataDebtors[0].debtor_acct + ' - ' + dataDebtors[0].name);
        // settextNameDebtor(dataDebtors[0].name);

        const params = {
          entity_cd: data.entity_cd,
          project_no: data.project_no,
          tenant_no: dataDebtors[0].tenant_no,
        };

        // if (dataDebtors.length > 1) {
        //   setDefaultDebtor(false);
        // } else {
        //   setDefaultDebtor(true);
        //   setDebtor(dataDebtors[0].debtor_acct);
        //   setTenantNo(dataDebtors[0].tenant_no);
        //   settextDebtor(
        //     dataDebtors[0].debtor_acct + ' - ' + dataDebtors[0].name,
        //   );
        //   settextNameDebtor(dataDebtors[0].name);
        //   const params = {
        //     entity_cd: data.entity_cd,
        //     project_no: data.project_no,
        //     tenant_no: dataDebtors[0].tenant_no,
        //     email: data.email,
        //   };
        //   console.log('params for lotno default', params);

        //   // setCheckedEntity(true);

        getLot(params, '');
        //   setSpinner(false);
        //   // console.log('params for debtor tower default', params);
        //   // getDebtor(params);
        // }

        setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch((error) => {
        console.log('error get tower api', error.response);
        // alert('error get');
      });
  };

  const handleChangeModal = ({ data, index }) => {
    // console.log('index,', index);
    // console.log('data chjange', data);
    // data.data.map(dat => {
    //   console.log('data for text debtor', dat);
    //   if (dat) {

    setDebtor(index.debtor_acct);
    setTenantNo(index.tenant_no);
    settextDebtor(index.debtor_acct + ' - ' + index.name);
    settextNameDebtor(index.name);
    getLot('', index.tenant_no);
    //   }
    // });
    setSpinner(false);
  };

  const getLot = async (data, tenantno) => {
    // console.log('tenant_no lot', data);
    const params = {
      entity_cd: entity_cd || data.entity_cd,
      project_no: project_no || data.project_no,
      email: email,
      tenant_no: tenantno || data.tenant_no,
    };

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/lot-no',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
      params: params,
    };

    // console.log('url getlotno', API_URL_LOKAL + '/modules/cs/lot-no', params);

    await axios(config)
      .then((res) => {
        // console.log('datalotno', res);
        const datas = res.data;
        const dataLotno = datas.data;
        // console.log('datalotno', dataLotno);
        setLotno(dataLotno[0].lot_no);
        // console.log('ada berapa length debtor', dataLotno.length);
        // console.log(object)

        // if (dataLotno.length > 1) {
        //   setDefaultLotNo(false);
        // } else {
        //   setDefaultLotNo(true);
        //   setLotno(dataLotno[0].lot_no);
        //   // this.setState({textLot: lot});
        //   getFloor(dataLotno[0].lot_no);
        //   setSpinner(false);
        //   // console.log('params for debtor tower default', params);
        //   // getDebtor(params);
        // }

        setDataLotno(dataLotno);

        // return res.data;
      })
      .catch((error) => {
        console.log('error get lotno api', error.response);
        // alert('error get');
      });
  };

  const handleLotChange = (lot) => {
    // console.log('lot', lot);
    setLotno(lot);
  };

  useEffect(() => {
    // console.log('apakah ini terload', email);
    setLoading(true);
    if (email && debtor && textLot) {
      fetchData();
      fetchDataCurrent();
      setRefreshing(false);
    }
  }, [email, debtor, textLot]);

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
    const config = {
      method: 'get',
      url:
        API_URL_LOKAL +
        `/modules/billing/current-summary/${entity_cd}/${project_no}/${debtor}/${textLot}/${email}`,
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
