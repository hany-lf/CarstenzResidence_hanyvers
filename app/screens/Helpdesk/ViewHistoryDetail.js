import {
  Text,
  TextInput,
  // CheckBox,
  PlaceholderLine,
  Placeholder,
  Button,
  SafeAreaView,
  RefreshControl,
  Header,
  Icon,
  Image,
  Tag,
  CategoryIconSoft,
} from '@components';
import { BaseColor, BaseStyle, useTheme, Images } from '@config';
import { CheckBox, Badge } from 'react-native-elements';
// import {Image} from 'react-native';
import StarRating from 'react-native-star-rating';
import { useNavigation } from '@react-navigation/native';
import { enableExperimental } from '@utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  TouchableOpacity,
  View,
  Platform,
  TouchableHighlight,
  ScrollView,
  Dimensions,
} from 'react-native';

import { useSelector } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import axios from 'axios';
import client from '../../controllers/HttpClient';
import styles from './styles';

import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';

import Modal from 'react-native-modal';

import SegmentedControlTab from 'react-native-segmented-control-tab';

import { API_URL_LOKAL } from '@env';
import tiket_data_multi from './tiket_data_multi.json';

export default function ViewHistoryDetail({ route }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const users = useSelector((state) => getUser(state));
  const [email, setEmail] = useState('');
  const [name, setName] = useState(users.name);
  const [urlApi, seturlApi] = useState(client);

  const [spinner, setSpinner] = useState(true);

  const [dataTiketMulti, setDataTiketMulti] = useState([]);
  const [dataImageMulti, setDataImageMulti] = useState([]);
  const [dataAction, setDataAction] = useState([]);
  const [dataTiketPassProp, setDataTiketPassProp] = useState(route.params);
  const deviceWidth = Dimensions.get('window').width;
  const [isImageViewVisible, setImageViewVisible] = useState();
  const [url_image, setUrl_Image] = useState();
  const [image_solved, setImageSolved] = useState([]);
  //   const [images, setImage] = useState(url_image);
  const [images, setImage] = useState(imagesDummy); //sementara aja

  const [link_url, setLinkUrl] = useState('');
  const [name_approval, setNameApproval] = useState('');
  const [date_approval, setDateApproval] = useState('');
  const [modalImage, setModalImage] = useState(false);

  const [allDataforDetail, setAllDataforDetail] = useState([]);

  // const [dataHdr, setDataHdr] = useState([])
  // const [dataLabour, setDataLabour] = useState([])
  // const [dataMaterial, setDataMaterial] = useState([])
  // const [dataOther, setDataOther] =useState([])

  const selectedPayment = {
    type: 'C',
    descs: 'Cash',
  };
  const widthStyle = {
    width: (deviceWidth * 2) / 5,
    // width: deviceWidth / 2,
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  //   console.log('passprop kategori help', passProp);
  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };

  const imagesDummy = [
    {
      id: '1',
      image: require('@assets/images/icon-helpdesk/newtiket.png'),
      selected: true,
    },
    {
      id: '2',
      image: require('@assets/images/icon-helpdesk/history.png'),
      //   selected: true,
    },
    { id: '3', image: Images.location2 },
    { id: '4', image: Images.location3 },
    { id: '5', image: Images.location4 },
    { id: '6', image: Images.location5 },
    { id: '7', image: Images.location6 },
    { id: '8', image: Images.location7 },
  ];

  // ---- create tabs
  const TABS = [
    {
      id: 1,
      title: t('detail'),
    },
    {
      id: 2,
      title: t('feedback'),
    },
  ];
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    const id = route?.params?.id;
    TABS.forEach((tab) => {
      tab.id == id && setTab(tab);
    });
  }, [route?.params?.id]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(
      users != null && users.userData != null ? users.userData.email : '',
    );
    getTicketDetailMulti(route.params);
  }, [email]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (email != '') {
      getTicketDetailMulti(route.params);
      // getTicketDetailMulti()
    }
  }, [email]);

  useEffect(() => {
    console.log('user view history detail', users);
    setLoading(false);
    // getTower(users);
    setImageViewVisible(false); // getCategoryHelp;
    // setSpinner(false);
    //   console.log('routeparams', route.params);
    //   setDataHistoryStatus(route.params);
    // if (email != '') {
    //   getTicketDetailMulti(route.params);
    //   console.log('email', email);
    // }

    getSolvedPicture(route.params);
  }, []);

  const getTicketDetailMulti = async (data) => {
    const formData = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      report_no: data.report_no,
      email: email,
    };

    console.log('form data multi', formData);

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/ticket-all-by-report',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    };

    await axios(config)
      .then((res) => {
        // console.log('dummydatamulti', tiket_data_multi.data.data_entry[0]);
        console.log('res tiket multi', res.data);
        const resTiketMulti = res.data.data.data_entry[0];
        const resImageMulti = res.data.data.data_image; //
        const resDataAction = res.data.data.data_action; //diisi oleh engineer,
        // const resDataLabourdankawankawan = res.data.DataLabourdankawankawan
        const resHDR = res.data.data.data_hd[0];
        const resLabour = res.data.data.data_labour[0];
        const resMaterial = res.data.data.data_material[0];
        const resOther = res.data.data.data_other[0];
        const cekdata = res.data;

        // const resTiketMulti = tiket_data_multi.data.data_entry[0];
        // const resImageMulti = tiket_data_multi.data.data_image; //
        // const resDataAction = tiket_data_multi.data.data_action; //diisi oleh engineer,
        // // const resDataLabourdankawankawan = res.data.DataLabourdankawankawan
        // const resHDR = tiket_data_multi.data.data_hd[0];
        // const resLabour = tiket_data_multi.data.data_labour[0];
        // const resMaterial = tiket_data_multi.data.data_material[0];
        // const resOther = tiket_data_multi.data.data_other[0];
        //  const cekdata = res.data;
        console.log('cek data detail', resImageMulti);

        console.log('bingung ih res hdr apa', { ...resLabour });

        const alldata = {
          resTiketMulti,
          resHDR,
          resLabour,
          resMaterial,
          resOther,
        };
        setAllDataforDetail(alldata);
        // console.log('tes data nih', tesdata);
        // console.log('resImageMulti', resImageMulti);
        // console.log('res.data', res.data.Data[0]);

        setDataTiketMulti(resTiketMulti);
        setDataImageMulti(resImageMulti);
        setDataAction(resDataAction);
        // setDataHdr(resHDR);
        // setDataLabour(resLabour)
        // setDataMaterial(resMaterial)
        // setDataOther(resOther)

        setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('err data multi', error.response);
        // alert('error nih');
      });
  };

  const getSolvedPicture = async (data) => {
    const formData = {
      // report_no: 'EX21090021', //hardcode dulu
      report_no: data.report_no,
    };

    // console.log('form data multi', formData);

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/solved-picture',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    };

    await axios(config)
      .then((res) => {
        // console.log('res tiket multi', res.data);
        const resGalleryService = res.data;

        console.log('resGalleryService', resGalleryService);
        setImageSolved(resGalleryService);

        setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('err data multi', error.response);
        // alert('error nih');
      });
  };

  const handleIndexChange = (index) => {
    console.log('index langsung klik', index);

    // this.setState({
    //   selectedIndex: index,
    // });
    setSelectedIndex(index);

    console.log('Selected index', selectedIndex);
  };

  const buttonSignature = (datas, status_button) => {
    console.log('status button', status_button);
    console.log('datas for signature', datas);
    navigation.navigate('TableBeforeSignatureWO', { datas, status_button });
  };

  const buttonSignatureAfter = (datas, status_button) => {
    console.log('status button', status_button);
    console.log('datas for signature', datas);
    navigation.navigate('TableAfterSignatureWO', { datas, status_button });
  };

  //   const saveConfirm = () => {
  //     const data = dataTiketPassProp;
  //     const formData = {
  //       entity: data.entity_cd,
  //       project: data.project_no,
  //       reportno: data.report_no,
  //       name: name,
  //       email: email,
  //       assignto: data.assign_to,
  //       payment_method: selectedPayment.type,
  //     };
  //     console.log('dataTicket', formData);

  //     // fetch(urlApi + 'c_ticket_history/saveConfirm/IFCAPB/', {
  //     //   method: 'POST',
  //     //   body: JSON.stringify(formData),
  //     // })
  //     //   .then(response => response.json())
  //     //   .then(res => {
  //     //     console.log('saveConfirm', res);
  //     //     this.showAlert(res.Pesan);
  //     //   })
  //     //   .catch(error => {
  //     //     console.log(error);
  //     //   });
  //   };
  const showModalImage = ({
    link_url,
    name_approval,
    date_approval,
    // status_approval,
  }) => {
    // console.log('status approval', status_approval);
    console.log('link url image', link_url);
    setLinkUrl(link_url);
    setNameApproval(name_approval);
    setDateApproval(date_approval);
    setModalImage(true);
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('status')} //belum dibuat lang
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
      <View style={styles.wrap}>
        <Text title2>Ticket</Text>
        <Text headline style={{ fontWeight: 'normal' }}>
          View History Ticket Detail
        </Text>
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

        {spinner ? (
          <View>
            {/* <Spinner visible={this.state.spinner} /> */}
            <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
              <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
            </Placeholder>
          </View>
        ) : (
          <View>
            {tab.id == 1 && (
              <ScrollView>
                <View style={{ margin: 5, paddingRight: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Ticket No</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>
                        # {dataTiketMulti.report_no}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Date</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>
                        {moment(dataTiketMulti.reported_date).format(
                          'DD-MM-YYYY hh:mm',
                        )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Name</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{dataTiketMulti.name}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Unit</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{dataTiketMulti.lot_no}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Contact No</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{dataTiketMulti.contact_no}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Reported By</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{dataTiketPassProp.reported_by}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // width: '60%', //sementara, kalo udah ada isinya, ini di hide lagi
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Complain Type</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text style={{ flexWrap: 'wrap' }}>
                        Requested
                        {/* hardcode coy */}
                        {/* dari get data multi gak ada complain_type? */}
                        {/* {dataTiketMulti.status == 'C' ? 'Complain' : 'Request'} */}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Category</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{dataTiketMulti.category}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={widthStyle}>
                      <Text>Status</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>
                        {dataTiketMulti.status == 'R'
                          ? 'Open'
                          : dataTiketMulti.status == 'A'
                          ? 'Assign'
                          : dataTiketMulti.status == 'S'
                          ? 'Need Confirmation'
                          : dataTiketMulti.status == 'P'
                          ? 'Process'
                          : dataTiketMulti.status == 'F'
                          ? 'Confirm'
                          : dataTiketMulti.status == 'V'
                          ? 'Solve'
                          : dataTiketMulti.status == 'C'
                          ? 'Completed'
                          : dataTiketMulti.status == 'D'
                          ? 'Done'
                          : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View>
                      <Text>Work Requested</Text>
                    </View>
                    <View>
                      <View
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderColor: '#555',
                          borderRadius: 10,
                          borderWidth: 1,
                          padding: 5,
                        }}
                      >
                        <Text style={{ width: '100%' }}>
                          {dataTiketMulti.work_requested}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {
                    dataTiketMulti.status == 'R' ? null : (
                      // {/* jika status approval di sv_entry hd = N, maka muncul tombol need approve. kalo status approval = Y berarti sudah diapprove */}
                      <View style={{ marginTop: 10 }}>
                        {dataTiketMulti.status_approval != 'Y' &&
                        dataTiketMulti.status_approval != 'B' &&
                        dataTiketMulti.status_approval != 'A' ? (
                          <Button
                            style={{
                              height: 40,
                              width: 200,
                              alignSelf: 'center',
                            }}
                            onPress={() =>
                              navigation.navigate(
                                'ScreenSignature',
                                dataTiketMulti,
                              )
                            }
                          >
                            <Text
                              style={{
                                color: BaseColor.whiteColor,
                                fontSize: 14,
                              }}
                            >
                              Need Approve
                            </Text>
                          </Button>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Button
                              style={{
                                height: 40,
                                // width: 100,
                                backgroundColor: 'tomato',
                                alignSelf: 'center',
                              }}
                              onPress={() =>
                                showModalImage({
                                  link_url: dataTiketMulti.link_url,
                                  name_approval: dataTiketMulti.name_approval,
                                  date_approval: dataTiketMulti.date_approval,
                                  // status_approval:
                                  //   dataTiketMulti.status_approval,
                                })
                              }
                            >
                              <Text
                                style={{
                                  color: BaseColor.whiteColor,
                                  fontSize: 14,
                                }}
                              >
                                SRF Approved
                              </Text>
                            </Button>
                            {(dataTiketMulti.status_approval == 'B' &&
                              dataTiketMulti.before_chief != null) ||
                            dataTiketMulti.wolink_url != null ? (
                              <Button
                                style={{
                                  height: 40,
                                  // width: 200,
                                  backgroundColor: 'tomato',
                                  alignSelf: 'center',
                                }}
                                onPress={() =>
                                  showModalImage({
                                    link_url: dataTiketMulti.wolink_url,
                                    name_approval:
                                      dataTiketMulti.woname_approval,
                                    date_approval:
                                      dataTiketMulti.wodate_approval,
                                    // status_approval:
                                    //   dataTiketMulti.status_approval,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    color: BaseColor.whiteColor,
                                    fontSize: 14,
                                  }}
                                >
                                  Before WO
                                </Text>
                              </Button>
                            ) : null}
                            {dataTiketMulti.status_approval == 'A' &&
                            dataTiketMulti.after_chief != null ? (
                              <Button
                                style={{
                                  height: 40,
                                  // width: 200,
                                  backgroundColor: 'tomato',
                                  alignSelf: 'center',
                                }}
                                onPress={() =>
                                  showModalImage({
                                    link_url: dataTiketMulti.wo1link_url,
                                    name_approval:
                                      dataTiketMulti.wo1name_approval,
                                    date_approval:
                                      dataTiketMulti.wo1date_approval,
                                    // status_approval:
                                    //   dataTiketMulti.status_approval,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    color: BaseColor.whiteColor,
                                    fontSize: 14,
                                  }}
                                >
                                  After WO
                                </Text>
                              </Button>
                            ) : null}
                          </View>
                        )}
                      </View>
                    )
                    // {/* klik need approve munculin tempat tanda tangan, lalu save. save ke table apa? api nya sudah ada belum ya? save dalam bentuk apa ya? image? */}
                    //   {/* set save data ke table sv entry hd, ubah status_approval, name_approval = nama user login, date_approval = tanggal dia tanda tangan, link_url = url image tanda tangan */}
                  }

                  {
                    //muncul kalo statusnya P aja (Process)
                    dataTiketMulti.status == 'P' &&
                    dataTiketMulti.status_approval == 'Y' &&
                    dataTiketMulti.before_chief != null ? (
                      <View style={{ marginTop: 10 }}>
                        <Button
                          style={{
                            height: 40,
                            width: 200,
                            alignSelf: 'center',
                          }}
                          onPress={() =>
                            buttonSignature(allDataforDetail, 'before_wo')
                          }
                        >
                          <Text
                            style={{
                              color: BaseColor.whiteColor,
                              fontSize: 14,
                            }}
                          >
                            Signature Before WO
                          </Text>
                        </Button>
                      </View>
                    ) : // {/* jika status approval di sv_entry hd = N, maka muncul tombol need approve. kalo status approval = Y berarti sudah diapprove */}
                    null
                    // {/* klik need approve munculin tempat tanda tangan, lalu save. save ke table apa? api nya sudah ada belum ya? save dalam bentuk apa ya? image? */}
                    //   {/* set save data ke table sv entry hd, ubah status_approval, name_approval = nama user login, date_approval = tanggal dia tanda tangan, link_url = url image tanda tangan */}
                  }

                  {
                    //muncul kalo statusnya P aja (Process)
                    dataTiketMulti.status == 'F' &&
                    dataTiketMulti.status_approval == 'B' &&
                    dataTiketMulti.after_chief != null ? (
                      <View style={{ marginTop: 10 }}>
                        <Button
                          style={{
                            height: 40,
                            width: 200,
                            alignSelf: 'center',
                          }}
                          onPress={() =>
                            buttonSignatureAfter(allDataforDetail, 'after_wo')
                          }
                        >
                          <Text
                            style={{
                              color: BaseColor.whiteColor,
                              fontSize: 14,
                            }}
                          >
                            Signature After WO
                          </Text>
                        </Button>
                      </View>
                    ) : // {/* jika status approval di sv_entry hd = N, maka muncul tombol need approve. kalo status approval = Y berarti sudah diapprove */}
                    null
                    // {/* klik need approve munculin tempat tanda tangan, lalu save. save ke table apa? api nya sudah ada belum ya? save dalam bentuk apa ya? image? */}
                    //   {/* set save data ke table sv entry hd, ubah status_approval, name_approval = nama user login, date_approval = tanggal dia tanda tangan, link_url = url image tanda tangan */}
                  }

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                      Gallery of Request
                    </Text>
                  </View>
                  <View>
                    {dataImageMulti.length > 0 ? (
                      dataImageMulti.map((item, key) => {
                        return (
                          <TouchableOpacity
                            key={key}
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() =>
                              navigation.navigate('PreviewImageHelpdesk', {
                                images: dataImageMulti,
                              })
                            }
                          >
                            <Image
                              key={key}
                              style={{
                                flex: 1,
                                width: '100%',
                                height: 400,
                                marginTop: 20,
                              }}
                              source={{ uri: `${item.file_url}` }}
                            />
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text>No Gallery of Request</Text>
                    )}
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                      Gallery of Solved
                    </Text>
                  </View>
                  <View style={{ marginBottom: '40%' }}>
                    {image_solved.length > 0 ? (
                      image_solved?.map((item, key) => {
                        return (
                          // <View key={key}>
                          <TouchableOpacity
                            key={key}
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() =>
                              navigation.navigate('PreviewImageHelpdesk', {
                                images: image_solved,
                              })
                            }
                          >
                            <Image
                              key={key}
                              style={{
                                flex: 1,
                                width: '100%',
                                height: 400,
                                marginTop: 10,
                              }}
                              source={{ uri: `${item.file_url}` }}
                            />
                          </TouchableOpacity>
                          // </View>
                        );
                      })
                    ) : (
                      <Text>No Gallery of Solved</Text>
                    )}
                  </View>

                  {/* //contoh bikin signature  dtaro  sini */}
                  {/* {
                    (dataTiketMulti.status == 'A',
                    'P',
                    'M',
                    'F',
                    'Y',
                    'Z' ? (
                      <View>
                        <Button>
                          <Text>{dataTiketMulti.status} ada</Text>
                        </Button>
                      </View>
                    ) : (
                      <Text>{dataTiketMulti.status} gada</Text>
                    ))
                  } */}
                  {/* //contoh bikin signature  dtaro  sini */}
                  {/* //contoh image slider view */}
                  {/* <View style={{marginTop: 50}}>
                    <Text style={{fontWeight: 'bold'}}>Finish of Services</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <ScrollView horizontal>
                      {imagesDummy.map((item, key) => {
                        return (
                          <TouchableOpacity
                            key={key}
                            //   style={{flex: 1}}
                            activeOpacity={1}
                            onPress={() =>
                              navigation.navigate('PreviewImage', {
                                images: imagesDummy,
                              })
                            }>
                            <Image
                              key={key}
                              style={{width: 100, height: 100}}
                              source={item.image}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View> */}
                  {/* //contoh image slider view */}
                </View>
              </ScrollView>
            )}
            {tab.id == 2 && (
              <ScrollView>
                <View>
                  {dataTiketMulti.status != 'R' ? (
                    <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View style={widthStyle}>
                          <Text>Assign To</Text>
                        </View>
                        <View style={{ width: 10 }}>
                          <Text>:</Text>
                        </View>
                        <View>
                          <Text style={{ flexWrap: 'wrap' }}>
                            {dataTiketMulti.assign_to}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <View>
                          <Text>Problem Cause</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <View
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderColor: '#555',
                              borderRadius: 10,
                              borderWidth: 1,
                              padding: 5,
                            }}
                          >
                            <Text style={{ width: '100%' }}>
                              {dataTiketMulti.problem_cause}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {dataAction.map((data, index) => {
                        <View key={index} style={{ marginVertical: 5 }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View style={widthStyle}>
                              <Text>Action By</Text>
                            </View>
                            <View style={{ width: 10 }}>
                              <Text>:</Text>
                            </View>
                            <View>
                              <Text>{data.action_by}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View style={widthStyle}>
                              <Text>Action Taken</Text>
                            </View>
                            <View style={{ width: 10 }}>
                              <Text>:</Text>
                            </View>
                            <View>
                              <Text>{data.action_taken}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View style={widthStyle}>
                              <Text>Action Date</Text>
                            </View>
                            <View style={{ width: 10 }}>
                              <Text>:</Text>
                            </View>
                            <View>
                              <Text>{data.action_date}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View style={widthStyle}>
                              <Text>Action Date</Text>
                            </View>
                            <View style={{ width: 10 }}>
                              <Text>:</Text>
                            </View>
                            <View>
                              <Text>{data.action_date}</Text>
                            </View>
                          </View>
                        </View>;
                      })}
                      {/* <TouchableOpacity
                        //   style={btnConfirm}
                        onPress={() => saveConfirm()}>
                        <Text>Confirm</Text>
                      </TouchableOpacity> */}
                    </View>
                  ) : (
                    <View>
                      <Text>No Feedback</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        )}

        <View>
          <Modal
            isVisible={modalImage}
            style={{ height: '100%' }}
            onBackdropPress={() => setModalImage(false)}
          >
            <View
              style={{
                backgroundColor: BaseColor.whiteColor,
                height: '60%',
                borderRadius: 30,
                // justifyContent: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                ></View>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: 'space-between',
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => setModalImage(false)}>
                    <View style={{ width: 30, height: 20 }}>
                      <Icon name={'times'} size={20}></Icon>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',

                  // flex: 1,
                  // margin: 10,
                  marginTop: '20%',
                  margin: 10,
                  borderColor: BaseColor.grayColor,
                  borderRadius: 15,
                  borderWidth: 1,
                  width: '90%',
                  // height: 300,
                }}
              >
                <Image
                  source={{ uri: link_url }}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                ></Image>
              </View>
              <View>
                <Text style={{ textAlign: 'center' }}>
                  Signature Name : {name_approval}
                </Text>
              </View>
              <View>
                <Text style={{ textAlign: 'center' }}>
                  Date Approval :{' '}
                  {moment(date_approval).format('DD-MM-YYYY H:mm')}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
