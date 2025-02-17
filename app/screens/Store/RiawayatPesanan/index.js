import {
  Header,
  Icon,
  ListTextButton,
  SafeAreaView,
  TabSlider,
  Tag,
  PlaceholderLine,
  Placeholder,
} from '@components';
import { BaseStyle, useTheme, BaseColor } from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import * as Utils from '@utils';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { haveChildren } from '@utils';
import {
  FlatList,
  ScrollView,
  View,
  ActivityIndicator,
  Animated,
  ImageBackground,
  Text,
  TextInput,
  RefreshControl,
} from 'react-native';
import { FFriends } from '@data';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';
import LottieView from 'lottie-react-native';

import getProject from '../../../selectors/ProjectSelector';
import { useSelector, useDispatch } from 'react-redux';
import getUser from '../../../selectors/UserSelectors';
import { useNavigation } from '@react-navigation/native';

import { SceneMap } from 'react-native-tab-view';
import numFormat from '../../../components/numFormat';
import { Button, Divider } from 'react-native-paper';
import { API_URL_LOKAL } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import { Linking } from 'react-native';

const History = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState(FFriends);
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const project = useSelector((state) => getProject(state));
  const user = useSelector((state) => getUser(state));
  const [entityCd, setEntity] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [email, setEmail] = useState('');

  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [dataHistoryFilter, setDataHistoryFilter] = useState([]);
  const [dataFetchedHistory, setDataFetchedHistory] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [dataDetail, setDataDetail] = useState(null);

  // --- useeffect untuk project
  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // getTower();
    if (project && project.data && project.data.length > 0) {
      // console.log('entity useeffect di home', project.data[0].entity_cd);
      setEntity(project.data[0].entity_cd);
      setProjectNo(project.data[0].project_no);
      const projects = project.data.map((item, id) => ({
        label: item.descs,
        value: item.project_no,
      }));
      // console.log('data di project', project);

      setProjectData(project.data);
      setValueProject(projects);

      setSpinner(false);
      setShow(true);
      // console.log('spinner after', spinner);
    }
    // }, 3000);
  }, [project]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : '');
  }, [user]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (entityCd !== '' && projectNo !== '' && email !== '') {
      getDataHistory();
    }
  }, [entityCd, projectNo, email]);

  const handleClickProject = (item, index) => {
    // console.log('index', index);
    setValueProjectSelected(item.value);

    setIsFocus(!isFocus);
    setShowChooseProject(!showChooseProject);

    if (item.value != null) {
      // console.log('value project selected', item.value);
      projectData.map((items, index) => {
        // console.log('items project data', items);
        if (items.project_no === item.value) {
          // console.log('items choose project handle', items);
          // console.log('index', index);
          // setProjectData(items);
          setCheckedEntity(true);
          // setShow(true);
          getTicketStatus(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  const clickAttachment = (bill, attach) => {
    const repl = attach.replace('https', 'http');
    const params = {
      // entity_cd: entity_cd,
      // project_no: project_no,
      // debtor_acct: debtor_acct,
      url: repl,
      bill_no: bill,
    };
    // console.log('params for click attach], params');
    navigation.navigate('PDFAttachStore', params);
    // if (data.debtor_acct == '') {
    //   // alert('Please Choose Debtor First');
    //   setMessage('Please choose debtor first');
    //   showModalSuccess(true);
    // } else {

    // }
  };
  const searchFilterFunction = (text) => {
    // console.log('text', text);
    // console.log('arrayholder', arrayholder);
    // const newData = dataHistory.filter(item => {
    //   const itemData =
    //     `${item.bill_no.toUpperCase()}` || `${item.bill_name.toUpperCase()}`;

    //   console.log('itemdata', itemData);
    //   const textData = text;
    //   //   return itemData.indexOf(textData) > -1;
    //   return itemData?.includes(textData);
    // });

    const newData = dataHistory.filter(
      (item) =>
        haveChildren(item.bill_no, text) || haveChildren(item.bill_name, text),
    );
    setDataHistoryFilter(newData);
  };

  const getDataHistory = () => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-email` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&email=${email}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;

          const filterDataStatus = data.filter(function (e) {
            // return ['D', 'N'].includes(e.bill_status);
            return ['C', 'X'].includes(e.bill_status);
          });

          // console.log('filterDataStatusND2', filterDataStatus);

          const arr1 = filterDataStatus.map((obj) => {
            return { ...obj, date_testing: obj.doc_date };
          });

          const sortedDesc = arr1.sort(
            (objA, objB) =>
              Number(objB.date_testing) - Number(objA.date_testing),
          );

          // console.log('tesd filter', filterDataStatus);

          setDataHistoryFilter(sortedDesc);
          setDataHistory(sortedDesc);

          setDataFetchedHistory(true); // Tandai bahwa data sudah diambil
        } else {
          setDataFetchedHistory(true); // Tetap tandai bahwa data sudah diambil meskipun tidak ada data
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error('Error fetching payment history header data:', error);
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetchedHistory(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  const handleClickDetail = (item) => {
    getDetailProduct(item.bill_no);
    setDataModal(item);
    setModalVisible(!modalVisible);
  };

  const getDetailProduct = (billNo) => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-bill-no` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&bill_no=${billNo}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;
          // console.log('data detail product', data);
          setDataDetail(data);
          setDataFetchedHistory(true);
        } else {
          setDataFetchedHistory(true);
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error(
          'Error fetching history detail data:',
          error.response ? error.response : error,
        );
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetchedHistory(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  // console.log('dataHistoryFilter', dataHistoryFilter);
  const renderItemContent = ({ item, index }) => {
    return (
      <View
        key={index}
        style={
          {
            //   borderWidth: 1,
            //   borderColor: 'black',
            //   borderStyle: 'solid',
          }
        }
      >
        <TouchableOpacity
          onPress={() => {
            // console.log('item', item);
            handleClickDetail(item);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: colors.text }}>Bill No : </Text>
              <Text
                style={{
                  fontSize: 14,
                  // color: BaseColor.grayColor
                  color: colors.primary,
                }}
              >
                {item.bill_no}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.text }}>
                {moment(item.doc_date).format('MMM DD YYYY, hh:mm:ss')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: colors.text }}
            >
              {item.bill_name} - {item.lot_no}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                // color: BaseColor.grayColor
                color: colors.primary,
              }}
            >
              Status : {item.status_payment}
              {/* //  == 'N'
              //   ? 'Item is being process'
              //   : 'Item is being delivered'} */}
            </Text>
            <Text style={{ color: colors.text }}>
              {numFormat(item.total_amt)}
            </Text>
          </View>

          <Divider style={{ marginVertical: 15 }} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      {showChooseProject ? (
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && { borderColor: BaseColor.corn30 },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles.itemTextStyle}
          containerStyle={{ borderRadius: 15, marginVertical: 5 }}
          data={valueProject}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Choose Project' : 'Choose Project'}
          searchPlaceholder="Search..."
          value={valueProjectSelected}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item, index) => {
            handleClickProject(item, index);
          }}
        />
      ) : null}
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
        }}
      >
        <View style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Search Name or Bill No"
            placeholderTextColor={colors.text}
            style={{
              flex: 1,
              height: '100%',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            onChangeText={(text) => searchFilterFunction(text.toUpperCase())}
            autoCorrect={false}
          />
        </View>
      </View>
      {spinner ? (
        <ActivityIndicator />
      ) : dataFetchedHistory ? ( // Periksa apakah data sudah diambil
        dataHistoryFilter.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 0,
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={dataHistoryFilter}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemContent}
          />
        ) : (
          <Text style={{ color: colors.text }}>Data not available</Text>
        )
      ) : (
        <View>
          <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
            <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
          </Placeholder>
        </View>
      )}
      {/* Jangan tampilkan apa pun jika spinner masih aktif */}

      <Modal
        isVisible={modalVisible}
        animationType={'slide'}
        swipeDirection={['down']}
        style={styles.bottomModal}
        onSwipeComplete={() => setModalVisible(!modalVisible)}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card, height: '80%' },
          ]}
        >
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {dataModal && ( // Pastikan dataModal tidak null
            <>
              <View style={{ flex: 1, marginTop: 30 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.text }}>Bill No : </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        // color: BaseColor.grayColor
                        color: colors.primary,
                      }}
                    >
                      {dataModal.bill_no}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: colors.text }}>
                      {moment(dataModal.doc_date).format(
                        'MMM DD YYYY, hh:mm:ss',
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: colors.text,
                    }}
                  >
                    {dataModal.bill_name} - {dataModal.lot_no}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      // color: BaseColor.grayColor
                      color: colors.primary,
                    }}
                  >
                    Status:{' '}
                    <Text style={{ color: BaseColor.orangeColor }}>
                      {dataModal.status_payment}
                    </Text>
                  </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: colors.text }}>Detail Product :</Text>
                  <ScrollView>
                    {dataDetail &&
                      dataDetail.map((item, index) => (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text style={{ color: colors.text }}>
                                {item.TRX_DESCS} x {item.TRX_QTY}
                              </Text>
                              <Text
                                style={{
                                  color: BaseColor.grayColor,
                                  fontSize: 13,
                                }}
                              >
                                @{numFormat(item.UNIT_PRICE)}
                              </Text>
                            </View>

                            <Text style={{ color: colors.text }}>
                              {numFormat(item.btrx_amt)}
                            </Text>
                          </View>
                          <Divider style={{ marginVertical: 15 }} />
                          {/* <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text style={{ color: colors.text }}>
                              Tax {parseInt(item.currency_rate)}%
                            </Text>
                            <Text style={{ color: colors.text }}>
                              {numFormat(item.bgovt_tax)}
                            </Text>
                          </View> */}
                        </View>
                      ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    Grand Total (include tax)
                  </Text>
                  <Text style={{ color: colors.text }}>
                    {numFormat(dataModal.total_amt)}
                  </Text>
                </View>
              </View>
            </>
          )}

          <Button
            full
            style={{ marginTop: 10, marginBottom: 20 }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            {t('close')}
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const Payment = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState(FFriends);
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const project = useSelector((state) => getProject(state));
  const user = useSelector((state) => getUser(state));

  const [dataPayment, setDataPayment] = useState([]);
  const [dataPaymentFilter, setDataPaymentFilter] = useState([]);
  const [entityCd, setEntity] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [email, setEmail] = useState('');
  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Tambahkan state untuk menandai apakah data sudah diambil

  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [dataDetail, setDataDetail] = useState(null);

  // --- useeffect untuk project
  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // getTower();
    if (project && project.data && project.data.length > 0) {
      // console.log('entity useeffect di home', project.data[0].entity_cd);
      setEntity(project.data[0].entity_cd);
      setProjectNo(project.data[0].project_no);
      const projects = project.data.map((item, id) => ({
        label: item.descs,
        value: item.project_no,
      }));
      // console.log('data di project', project);

      setProjectData(project.data);
      setValueProject(projects);

      setSpinner(false);
      setShow(true);
      // console.log('spinner after', spinner);
    }
    // }, 3000);
  }, [project]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : '');
  }, [user]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (entityCd !== '' && projectNo !== '' && email !== '') {
      getDataPayment();
    }
  }, [entityCd, projectNo, email]);

  const searchFilterFunction = (text) => {
    // console.log('text', text);
    // console.log('arrayholder', arrayholder);
    // const newData = dataPayment.filter(item => {
    //   const itemData = `${item.bill_name.toUpperCase()}` || `${item.bill_no}`;
    //   console.log('itemdata', itemData);
    //   const textData = text;
    //   return itemData.indexOf(textData) > -1;
    // });
    const newData = dataPayment.filter(
      (item) =>
        haveChildren(item.bill_no, text) || haveChildren(item.bill_name, text),
    );
    // console.log('new data', newData);
    setDataPaymentFilter(newData);
  };

  const getDataPayment = () => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-email` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&email=${email}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;

          const filterDataStatus = data.filter(function (e) {
            return ['E'].includes(e.bill_status);
          });

          // console.log('filterDataStatusNDP2', filterDataStatus);

          const arr1 = filterDataStatus.map((obj) => {
            return { ...obj, date_testing: obj.doc_date };
          });
          // console.log('arr1 PAYMENT', arr1);

          const sortedDesc = arr1.sort(
            (objA, objB) =>
              Number(objB.date_testing) - Number(objA.date_testing),
          );

          // console.log('tesd filter PAYMENT', sortedDesc);

          setDataPaymentFilter(sortedDesc);
          setDataPayment(sortedDesc);
          setDataFetched(true);
        } else {
          setDataFetched(true);
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error('Error fetching payment header data:', error.response);
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetched(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  const handleClickDetail = (item) => {
    getDetailProduct(item.bill_no);
    setDataModal(item);
    setModalVisible(!modalVisible);
  };

  const getDetailProduct = (billNo) => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-bill-no` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&bill_no=${billNo}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;
          // console.log('data detail product', data);
          setDataDetail(data);
          setDataFetched(true);
        } else {
          setDataFetched(true);
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error('Error fetching payment detail data:', error.response);
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetched(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  const renderItemContent = ({ item, index }) => {
    return (
      <View
        key={index}
        style={
          {
            //   borderWidth: 1,
            //   borderColor: 'black',
            //   borderStyle: 'solid',
          }
        }
      >
        <TouchableOpacity
          onPress={() => {
            // console.log('item', item);
            handleClickDetail(item);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: colors.text }}>Bill No : </Text>
              <Text
                style={{
                  fontSize: 14,
                  // color: BaseColor.grayColor
                  color: colors.primary,
                }}
              >
                {item.bill_no}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.text }}>
                {moment(item.doc_date).format('MMM DD YYYY, hh:mm:ss')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: colors.text }}
            >
              {item.bill_name} - {item.lot_no}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                // color: BaseColor.grayColor
                color: colors.primary,
              }}
            >
              Status : {item.status_payment}
              {/* //  == 'N'
              //   ? 'Item is being process'
              //   : 'Item is being delivered'} */}
            </Text>
            <Text style={{ color: colors.text }}>
              {numFormat(item.total_amt)}
            </Text>
          </View>

          <Divider style={{ marginVertical: 15 }} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
        }}
      >
        <View style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Search Name or Bill No"
            placeholderTextColor="#494a4a"
            style={{
              flex: 1,
              height: '100%',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            onChangeText={(text) => searchFilterFunction(text.toUpperCase())}
            autoCorrect={false}
          />
        </View>
      </View>
      {spinner ? (
        <ActivityIndicator />
      ) : dataFetched ? ( // Periksa apakah data sudah diambil
        dataPaymentFilter.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={dataPaymentFilter}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemContent}
          />
        ) : (
          <Text style={{ color: colors.text }}>Data not available</Text>
        )
      ) : (
        <View>
          <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
            <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
          </Placeholder>
        </View>
      )}
      {/* Jangan tampilkan apa pun jika spinner masih aktif */}

      <Modal
        isVisible={modalVisible}
        animationType={'slide'}
        swipeDirection={['down']}
        style={styles.bottomModal}
        onSwipeComplete={() => setModalVisible(!modalVisible)}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card, height: 400 },
          ]}
        >
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {dataModal && ( // Pastikan dataModal tidak null
            <>
              <View style={{ flex: 1, marginTop: 30 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.text }}>Bill No : </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        // color: BaseColor.grayColor
                        color: colors.primary,
                      }}
                    >
                      {dataModal.bill_no}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: colors.text }}>
                      {moment(dataModal.doc_date).format(
                        'MMM DD YYYY, hh:mm:ss',
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: colors.text,
                    }}
                  >
                    {dataModal.bill_name} - {dataModal.lot_no}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      // color: BaseColor.grayColor
                      color: colors.primary,
                    }}
                  >
                    Status:{' '}
                    <Text style={{ color: BaseColor.redColor }}>
                      {dataModal.status_payment}
                    </Text>
                  </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: colors.text }}>Detail Product :</Text>
                  <ScrollView>
                    {dataDetail &&
                      dataDetail.map((item, index) => (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text style={{ color: colors.text }}>
                                {item.TRX_DESCS} x {item.TRX_QTY}
                              </Text>
                              <Text
                                style={{
                                  color: BaseColor.grayColor,
                                  fontSize: 13,
                                }}
                              >
                                @{numFormat(item.UNIT_PRICE)}
                              </Text>
                            </View>

                            <Text style={{ color: colors.text }}>
                              {numFormat(item.btrx_amt)}
                            </Text>
                          </View>
                          <Divider style={{ marginVertical: 15 }} />
                          {/* <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text style={{ color: colors.text }}>
                              Tax {parseInt(item.currency_rate)}%
                            </Text>
                            <Text style={{ color: colors.text }}>
                              {numFormat(item.bgovt_tax)}
                            </Text>
                          </View> */}
                        </View>
                      ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    Grand Total (include tax)
                  </Text>
                  <Text style={{ color: colors.text }}>
                    {numFormat(dataModal.total_amt)}
                  </Text>
                </View>

                <Button
                  full
                  style={{
                    marginTop: 40,
                    marginBottom: 20,
                    backgroundColor: colors.primary,
                  }}
                  onPress={() => {
                    Linking.openURL(dataModal.redirect_url);
                  }}
                >
                  <Text style={{ color: BaseColor.whiteColor }}>
                    Link Payment
                  </Text>
                </Button>
              </View>
            </>
          )}

          <Button
            full
            style={{ marginTop: 10, marginBottom: 20 }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            {t('close')}
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const Completed = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState(FFriends);
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const project = useSelector((state) => getProject(state));
  const user = useSelector((state) => getUser(state));

  const [dataCompleted, setDataCompleted] = useState([]);
  const [dataCompletedFilter, setDataCompletedFilter] = useState([]);
  const [entityCd, setEntity] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [email, setEmail] = useState('');
  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Tambahkan state untuk menandai apakah data sudah diambil

  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [dataDetail, setDataDetail] = useState([]);

  // --- useeffect untuk project
  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // getTower();
    if (project && project.data && project.data.length > 0) {
      // console.log('entity useeffect di home', project.data[0].entity_cd);
      setEntity(project.data[0].entity_cd);
      setProjectNo(project.data[0].project_no);
      const projects = project.data.map((item, id) => ({
        label: item.descs,
        value: item.project_no,
      }));
      // console.log('data di project', project);

      setProjectData(project.data);
      setValueProject(projects);

      setSpinner(false);
      setShow(true);
      // console.log('spinner after', spinner);
    }
    // }, 3000);
  }, [project]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : '');
  }, [user]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (entityCd !== '' && projectNo !== '' && email !== '') {
      getDataCompleted();
    }
  }, [entityCd, projectNo, email]);

  const searchFilterFunction = (text) => {
    // console.log('text', text);
    // console.log('arrayholder', arrayholder);
    // const newData = dataPayment.filter(item => {
    //   const itemData = `${item.bill_name.toUpperCase()}` || `${item.bill_no}`;
    //   console.log('itemdata', itemData);
    //   const textData = text;
    //   return itemData.indexOf(textData) > -1;
    // });
    const newData = dataCompleted.filter(
      (item) =>
        haveChildren(item.bill_no, text) || haveChildren(item.bill_name, text),
    );
    // console.log('new data', newData);
    setDataCompletedFilter(newData);
  };

  const handleClickProject = (item, index) => {
    console.log('index', index);
    setValueProjectSelected(item.value);

    setIsFocus(!isFocus);
    setShowChooseProject(!showChooseProject);

    if (item.value != null) {
      console.log('value project selected', item.value);
      projectData.map((items, index) => {
        console.log('items project data', items);
        if (items.project_no === item.value) {
          console.log('items choose project handle', items);
          console.log('index', index);
          // setProjectData(items);
          setCheckedEntity(true);
          // setShow(true);
          getTicketStatus(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  const getDataCompleted = () => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-email` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&email=${email}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;

          const filterDataStatus = data.filter(function (e) {
            return ['N'].includes(e.bill_status);
          });

          // console.log('filterDataStatusNDP2', filterDataStatus);

          const arr1 = filterDataStatus.map((obj) => {
            return { ...obj, date_testing: obj.doc_date };
          });
          // console.log('arr1 PAYMENT', arr1);

          const sortedDesc = arr1.sort(
            (objA, objB) =>
              Number(objB.date_testing) - Number(objA.date_testing),
          );

          // console.log('tesd filter PAYMENT', sortedDesc);

          setDataCompletedFilter(sortedDesc);
          setDataCompleted(sortedDesc);
          setDataFetched(true);
        } else {
          setDataFetched(true);
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error('Error fetching completed data:', error.response);
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetched(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  const handleClickDetail = (item) => {
    getDetailProduct(item.bill_no);
    setDataModal(item);
    setModalVisible(!modalVisible);
  };

  const getDetailProduct = (billNo) => {
    const config = {
      url:
        API_URL_LOKAL +
        `/modules/store/transaction-by-bill-no` +
        `?entity_cd=${entityCd}&project_no=${projectNo}&bill_no=${billNo}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          // const arrLocation = datas.data;
          // console.log('data detail product', data);
          setDataDetail(data);
          setDataFetched(true);
        } else {
          setDataFetched(true);
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error('Error fetching completed detail data:', error.response);
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
        setDataFetched(true); // Tandai bahwa data sudah diambil meskipun ada error
      });
  };

  const renderItemContent = ({ item, index }) => {
    return (
      <View
        key={index}
        style={
          {
            //   borderWidth: 1,
            //   borderColor: 'black',
            //   borderStyle: 'solid',
          }
        }
      >
        <TouchableOpacity
          onPress={() => {
            // console.log('item', item);
            handleClickDetail(item);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: colors.text }}>Bill No : </Text>
              <Text
                style={{
                  fontSize: 14,
                  // color: BaseColor.grayColor
                  color: colors.primary,
                }}
              >
                {item.bill_no}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.text }}>
                {moment(item.doc_date).format('MMM DD YYYY, hh:mm:ss')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: colors.text }}
            >
              {item.bill_name} - {item.lot_no}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                // color: BaseColor.grayColor
                color: colors.primary,
              }}
            >
              Status : {item.status_payment}
              {/* //  == 'N'
              //   ? 'Item is being process'
              //   : 'Item is being delivered'} */}
            </Text>
            <Text style={{ color: colors.text }}>
              {numFormat(item.total_amt)}
            </Text>
          </View>

          <Divider style={{ marginVertical: 15 }} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
        }}
      >
        <View style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Search Name or Bill No"
            placeholderTextColor="#494a4a"
            style={{
              flex: 1,
              height: '100%',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            onChangeText={(text) => searchFilterFunction(text.toUpperCase())}
            autoCorrect={false}
          />
        </View>
      </View>
      {spinner ? (
        <ActivityIndicator />
      ) : dataFetched ? ( // Periksa apakah data sudah diambil
        dataCompletedFilter.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={dataCompletedFilter}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemContent}
          />
        ) : (
          <Text style={{ color: colors.text }}>Data not available</Text>
        )
      ) : (
        <View>
          <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
            <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
          </Placeholder>
        </View>
      )}
      {/* Jangan tampilkan apa pun jika spinner masih aktif */}

      <Modal
        isVisible={modalVisible}
        animationType={'slide'}
        swipeDirection={['down']}
        style={styles.bottomModal}
        onSwipeComplete={() => setModalVisible(!modalVisible)}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card, height: '80%' },
          ]}
        >
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {dataModal && ( // Pastikan dataModal tidak null
            <>
              <View style={{ flex: 1, marginTop: 30 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.text }}>Bill No : </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        // color: BaseColor.grayColor
                        color: colors.primary,
                      }}
                    >
                      {dataModal.bill_no}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: colors.text }}>
                      {moment(dataModal.doc_date).format(
                        'MMM DD YYYY, hh:mm:ss',
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: colors.text,
                    }}
                  >
                    {dataModal.bill_name} - {dataModal.lot_no}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      // color: BaseColor.grayColor
                      color: colors.primary,
                    }}
                  >
                    Status:{' '}
                    <Text style={{ color: BaseColor.greenColor }}>
                      {dataModal.status_payment}
                    </Text>
                  </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: colors.text }}>Detail Product :</Text>
                  <ScrollView>
                    {dataDetail &&
                      dataDetail.map((item, index) => (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text style={{ color: colors.text }}>
                                {item.TRX_DESCS} x {item.TRX_QTY}
                              </Text>
                              <Text
                                style={{
                                  color: BaseColor.grayColor,
                                  fontSize: 13,
                                }}
                              >
                                @{numFormat(item.UNIT_PRICE)}
                              </Text>
                            </View>

                            <Text style={{ color: colors.text }}>
                              {numFormat(item.btrx_amt)}
                            </Text>
                          </View>
                          <Divider style={{ marginVertical: 15 }} />
                          {/* <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text style={{ color: colors.text }}>
                              Tax {parseInt(item.currency_rate)}%
                            </Text>
                            <Text style={{ color: colors.text }}>
                              {numFormat(item.bgovt_tax)}
                            </Text>
                          </View> */}
                        </View>
                      ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    Grand Total (include tax)
                  </Text>
                  <Text style={{ color: colors.text }}>
                    {numFormat(dataModal.total_amt)}
                  </Text>
                </View>
              </View>
            </>
          )}

          <Button
            full
            style={{ marginTop: 10, marginBottom: 20 }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            {t('close')}
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default function RiwayatPesanan() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState('');
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'payment', title: 'Pending' },
    { key: 'completed', title: 'Completed' },
    { key: 'history', title: 'History' },
  ]);
  const renderScene = SceneMap({
    history: History,
    payment: Payment,
    completed: Completed,
  });

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('Order History')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.text}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <TabSlider
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </SafeAreaView>
  );
}
