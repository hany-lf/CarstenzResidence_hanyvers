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
  Tag,
  ListOptionSelected,
} from '@components';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { enableExperimental } from '@utils';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { CheckBox } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  TouchableOpacity,
  View,
  Platform,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { ProgressBar, MD3Colors, ToggleButton } from 'react-native-paper';
import Modal from 'react-native-modal';
// import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import getProject from '../../selectors/ProjectSelector';
import axios from 'axios';
import client from '../../controllers/HttpClient';
import styles from './styles';

//   import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_LOKAL } from '@env';
export default function SeatBooking(props) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const users = useSelector((state) => getUser(state));
  const [email, setEmail] = useState(users.user);
  const [urlApi, seturlApi] = useState(client);

  const [spinner, setSpinner] = useState(true);
  const [spinnerHour, setSpinnerHours] = useState(true);
  const [dataCategory, setDataCategory] = useState([]);

  const [passPropStorage, setPassPropStorage] = useState();
  const [passProp, setpassProp] = useState(props.route.params);
  console.log('passProp', passProp);
  const [selected, setSelected] = useState(null);
  const [getBookingTime, setBookingTime] = useState([]);
  const [loadingTab, setLoadingTab] = useState(true);
  const [getDataOnClick, setDataOnClick] = useState();
  const [getDateOnClick, setDateOnClick] = useState([]);
  const [getDatesOnClick, setDatesOnClick] = useState([]);
  const [getSlotOnClick, setSlotOnClick] = useState([]);
  const [getHourOnClick, setHourOnClick] = useState([]);
  const [getCategoryOnClick, setCategoryOnClick] = useState([]);
  const [time, setTime] = useState({});
  const [timedate, setTimeDate] = useState([]);
  const [data, setData] = useState([]);
  const [databookdate, setDatabookDate] = useState([]);
  const [dataBooked1, setDataBooked1] = useState([]);
  const [dataBooked2, setDataBooked2] = useState([]);
  const [dataBooked3, setDataBooked3] = useState([]);
  const [dataBooked4, setDataBooked4] = useState([]);
  const [dataBookedOH1, setDataBookedOH1] = useState([]);
  const [dataBookedOH2, setDataBookedOH2] = useState([]);
  const [dataBookedOH3, setDataBookedOH3] = useState([]);
  const [dataBookedOH4, setDataBookedOH4] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const [isClick, setisClick] = useState(false);
  // const [isExpandReason, setIsExpandReason] = useState(false);
  const [isIconUp, setIconUp] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDataActive, setDataIsActive] = useState();
  const [isDateActive, setDateIsActive] = useState();
  const [isCategoryActive, setCategoryIsActive] = useState();

  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [messageResult, setMessageResult] = useState('');
  const [statusResult, setStatus] = useState('');

  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const project = useSelector((state) => getProject(state));

  const handleNavigate = () => {
    navigation.navigate('SpecTroffice');
  };
  const TABS = [
    {
      id: 'R',
      title: t('Reguler'),
    },
    {
      id: 'O',
      title: t('Overhaul'),
    },
  ];
  const TABSLOT = [
    {
      slot: 1,
      title: t('SLOT 1'),
    },
    {
      slot: 2,
      title: t('SLOT 2'),
    },
  ];

  // console.log('Overhaul Clg', TABS[1]);
  const [tab, setTab] = useState(TABS[0]);
  const [tabOverhaul, setTabOverhaul] = useState(TABS[1]);
  const [tabslot, setTabSlot] = useState(TABSLOT[0]);
  // console.log('bookdate', data[4]?.book_date);
  const TABSDATE = [
    {
      id: 1,
      title: data[0]?.book_date,
    },
    {
      id: 2,
      title: data[1]?.book_date,
    },
    {
      id: 3,
      title: data[2]?.book_date,
    },
    {
      id: 4,
      title: data[3]?.book_date,
    },
  ];
  const [tabDate, setTabDate] = useState(TABSDATE[0]);

  console.log(
    'tabDate >',

    moment(data[0]?.book_date).locale('en').format('ddd DD'),
  );

  const tab1 = data.filter((x) => x.id == '1');
  const tab2 = data.filter((x) => x.id == '2');
  const tab3 = data.filter((x) => x.id == '3');
  const tab4 = data.filter((x) => x.id == '4');

  useEffect(() => {
    getDateBook(dataTowerUser);
  }, [dataTowerUser]);

  // --- useeffect untuk project
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      // getTower();
      if (project && project.data && project.data.length > 0) {
        // console.log('entity useeffect di home', project.data[0].entity_cd);
        setEntity(project.data[0].entity_cd);
        setProjectNo(project.data[0].project_no);
        // const projects = project.data.map((item, id) => ({
        //   label: item.descs,
        //   value: item.project_no,
        // }));
        console.log('data di project', project);
        setProjectData(project.data);
        // setValueProject(projects);
      }
      // getCategoryHelp;
      // setSpinner(false);
    }, 3000);
  }, [project]);

  useEffect(() => {
    if (entity_cd && project_no) {
      // getLotNo();
      const params = {
        entity_cd: entity_cd,
        project_no: project_no,
      };
      getTicketStatus(params);
      setShow(true);
    }
  }, [entity_cd, project_no]);
  // --- useeffect untuk project

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(
      users != null && user.userData != null ? users.userData.email : '',
    );
  }, [email]);
  // --- useeffect untuk update email/name

  const getDateBook = async (datas) => {
    const entity_cd = datas.entity_cd;
    const project_no = datas.project_no;
    const category_cd = passProp.category_cd;
    // console.log(
    //   "test url >",
    //   `http://apps.pakubuwono-residence.com/apiwebpbi/api/modules/troffice/booking-hours?entity_cd=` +
    //     entity_cd +
    //     `&project_no=` +
    //     project_no +
    //     `&category_cd=` +
    //     category_cd
    // );
    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/troffice/booking-hours',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: { entity_cd, project_no, category_cd },
    };
    await axios(config)
      .then((res) => {
        // console.log('data get date book', res.data[0]);
        // console.log('datas nih dipake buat entity projek', datas);
        setData(res.data);
        setDatabookDate(res.data);
        // getdata();
        getBooked(datas, res.data);
        getBookedOverHaul(datas, res.data);
        setSpinner(false);
      })
      // .catch(error => console.error(error))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const createAxiosConfig = (endpoint, method = 'get', params = {}) => {
    return {
      method: method,
      url: `${API_URL_LOKAL}${endpoint}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: params,
    };
  };

  const getBooked = async (datas, databookdates) => {
    const entity_cd = datas.entity_cd;
    // console.log('next abis tower', datas);
    const project_no = datas.project_no;
    const category_cd = passProp.category_cd;
    // const databookdates = databookdate;
    // console.log('data obj_data', obj_data);
    // console.log('params :', category_cd);
    // console.log('data book date atas', databookdates);
    // console.log('next abis tower if', entity_cd);

    // const databookdates = databookdate;
    // console.log('data obj_data', obj_data);
    // console.log('data book date if', databookdates);

    // alert('undefined');
    const params_api =
      '?' +
      'entity_cd=' +
      entity_cd +
      '&' +
      'project_no=' +
      project_no +
      '&' +
      'category_cd=' +
      category_cd +
      '&' +
      'req_type=' +
      tab.id;

    const endpoints = [
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[0].book_date,
        req_type: tab.id,
        id: 1,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[1].book_date,
        req_type: tab.id,
        id: 2,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[2].book_date,
        req_type: tab.id,
        id: 3,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[3].book_date,
        req_type: tab.id,
        id: 4,
      }),
    ];

    // let endpoints = [
    //   API_URL_LOKAL +
    //     `/modules/troffice/booking-hours_category` +
    //     params_api +
    //     '&' +
    //     'book_date=' +
    //     databookdates[0].book_date +
    //     // '2021-12-15' +
    //     `&id=1`,
    //   API_URL_LOKAL +
    //     `/modules/troffice/booking-hours_category` +
    //     params_api +
    //     '&' +
    //     'book_date=' +
    //     databookdates[1].book_date +
    //     // '2021-12-15' +
    //     `&id=2`,
    //   API_URL_LOKAL +
    //     `/modules/troffice/booking-hours_category` +
    //     params_api +
    //     '&' +
    //     'book_date=' +
    //     databookdates[2].book_date +
    //     // '2021-12-15' +
    //     `&id=3`,
    //   API_URL_LOKAL +
    //     `/modules/troffice/booking-hours_category` +
    //     params_api +
    //     '&' +
    //     'book_date=' +
    //     databookdates[3].book_date + // '2021-12-15' + // data[3]?.book_date +
    //     `&id=4`,
    // ];
    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        axios.spread(
          (
            { data: dataBooked1 },
            { data: dataBooked2 },
            { data: dataBooked3 },
            { data: dataBooked4 },
          ) => {
            console.log('res1: ', dataBooked1);
            console.log('res2: ', dataBooked2);
            console.log('res3: ', dataBooked3);
            console.log('res4: ', dataBooked4);

            if (dataBooked1) {
              setDataBooked1(dataBooked1);
            }
            if (dataBooked2) {
              setDataBooked2(dataBooked2);
            }
            if (dataBooked3) {
              setDataBooked3(dataBooked3);
            }
            if (dataBooked4) {
              setDataBooked4(dataBooked4);
            }
          },
        ),
      )
      .catch((error) => console.error('ini error if getbooking', error))
      .finally(
        () => setLoading(false),
        setSpinnerHours(false),
        setSpinner(false),
      );
  };

  const getBookedOverHaul = async (datas, databookdates) => {
    const entity_cd = datas.entity_cd;
    // console.log('next abis tower', datas);
    const project_no = datas.project_no;
    const category_cd = passProp.category_cd;
    const overhaul = 'O';

    const endpoints = [
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[0].book_date,
        req_type: overhaul,
        id: 1,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[1].book_date,
        req_type: overhaul,
        id: 2,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[2].book_date,
        req_type: overhaul,
        id: 3,
      }),
      createAxiosConfig(`/modules/troffice/hours-by-category`, 'get', {
        entity_cd: entity_cd,
        project_no: project_no,
        category_cd: category_cd,
        book_date: databookdates[3].book_date,
        req_type: overhaul,
        id: 4,
      }),
    ];

    console.log('endpoint', endpoints);
    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        axios.spread(
          (
            { data: dataBookedOH1 },
            { data: dataBookedOH2 },
            { data: dataBookedOH3 },
            { data: dataBookedOH4 },
          ) => {
            console.log('res1: ', dataBookedOH1);
            console.log('res2: ', dataBookedOH2);
            console.log('res3 OH: ', dataBookedOH3);
            console.log('res4: ', dataBookedOH4);

            if (dataBookedOH1) {
              setDataBookedOH1(dataBookedOH1);
            }
            if (dataBookedOH2) {
              setDataBookedOH2(dataBookedOH2);
            }
            if (dataBookedOH3) {
              setDataBookedOH3(dataBookedOH3);
            }
            if (dataBookedOH4) {
              setDataBookedOH4(dataBookedOH4);
            }
          },
        ),
      )
      .catch((error) => console.error('ini error if getbooking', error))
      .finally(
        () => setLoading(false),
        setSpinnerHours(false),
        setSpinner(false),
      );
  };

  useEffect(() => {
    setTimeout(() => {
      setSpinnerHours(false);
    }, 5000);
  }, []);

  const setExpandIcon = (indexs) => {
    // console.log('indexs', indexs);
    setIsExpand(!isExpand);
    setIconUp(indexs ? !isIconUp : isIconUp);
  };

  // const setExpandIconReason = indexs => {
  //   console.log('indexs', indexs);
  //   // setIsExpandReason(!isExpandReason);
  //   setIconUp(indexs ? !isIconUp : isIconUp);
  // };

  const onBookingPress = (dtbook, date, jam_booking, slt) => {
    // console.log('dtbook', dtbook);
    // console.log('dtbook length', ...dtbook.slot_hours);
    // const obj = {...dtbook.slot_hours};
    const obj = dtbook.slot_hours;

    obj.map(function (value, i) {
      // console.log('result dtbook loop', i, value);
      return i, value;
    });

    const result = obj.filter(booked);

    function booked(book) {
      return (book = dtbook.databook !== null || dtbook.databook !== '');
    }

    // const booked = book => {
    //   return (book = dtbook.databook !== null || dtbook.databook !== '');
    // };

    // console.log('result filter databook', result);
    // console.log('obj databook', obj);
    // console.log('datab databook', datab);
    const item = {
      databook: dtbook,
      items: dtbook.book_date,
      jam_booking: jam_booking,
      slot: slt,
    };

    setDateOnClick(item.items);
    setDatesOnClick(date);
    setHourOnClick(item.jam_booking);
    setSlotOnClick(item.slot);
    setisClick(true);
    // setModalVisible(true);
    // navigation.navigate('BookingDetail', item);
  };

  // console.log('getDatesOnClick', getDatesOnClick);
  const handleClick = (jam, slot, category, date) => {
    // setIsActive(current => !current);

    setIsActive(jam);
    setDataIsActive(slot);
    setCategoryIsActive(category);
    setDateIsActive(date);
    // console.log('date is active', date);
    // console.log('slot is active', slot);
    // console.log('jam is active', jam);
    // console.log('category >', category);
    // console.log('dataBooked1.book_date', dataBooked1.book_date);
    // console.log('tab.id', tab.id);
    // console.log('tabDate.id', tabDate.id);
  };
  // console.log('getDateOnClick', getDateOnClick);
  const handleClickType = (jam, slot, category, date) => {
    // setIsActive(current => !current);
    setIsActive('ALL');
    setDataIsActive(slot);
    setCategoryIsActive(category);
    setDateIsActive(date);
  };

  useEffect(() => {
    const id = props?.params?.id;
    if (id) {
      TABSDATE.forEach((tab) => {
        tab.id == id && setTabDate(tab);
      });
    }
  }, [props?.params?.id]);

  // console.log('passprop kategori help', passProp);

  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };

  //  setdataTowerUser(dat);
  //       setEntity(dat.entity_cd);
  //       setProjectNo(dat.project_no);
  //       getDateBook(dat);

  const getDataStorage = async () => {
    const value = await AsyncStorage.getItem('@troStorage');
    // const DataTower = await AsyncStorage.getItem('@DataTower');

    const passPropStorage = JSON.parse(value);

    setPassPropStorage(passPropStorage);
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getTower(users);
      getDataStorage();
      //func baru
      getTime();
      // getCategoryHelp;
      // setSpinner(false);
    }, 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTab(false);
    }, 8000);
  }, []);

  useEffect(() => {
    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/home/common-current-time',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: {},
    };
    axios(config)
      .then((time) => {
        // console.log('time from server?', time.data);
        setTime(time.data);
      })
      // .catch(error => console.error(error))
      .catch((error) => console.error(error.response.data))
      .finally(() => setLoading(false));
  }, []);

  // const addDate = time.setDate(time.getDate() + 1);
  // console.log('addDate >', addDate);

  const datatime = {
    timeget: time.tanggal,
    daily: time.jam,
  };

  useEffect(() => {
    const config = {
      method: 'post',
      url:
        API_URL_LOKAL +
        `/modules/facilities/booking-hours-by-date?entity_cd=01&project_no=01&facility_cd=CA&book_date=2021-12-07&id=1`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: {},
    };
    axios(config)
      .then((data) => {
        // console.log('timedate', data.data);
        setTimeDate(data[0]);

        setSpinner(false);
      })
      // .catch(error => console.error(error))
      .catch((error) => console.error(error.response.data))
      .finally(() => setLoading(false));
  }, []);

  const getTime = async () => {
    const entity = passProp.entity_cd;
    const project = passProp.project_no;

    const config = {
      method: 'post',
      url: API_URL_LOKAL + '/modules/troffice/master-booking-time',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: {
        entity_cd: entity,
        project_no: project,
      },
    };
    try {
      await axios(config).then((res) => {
        const datas = res.data.data;

        let ans = datas.reduce((agg, curr) => {
          // console.log('agg', agg);
          let found = agg.find((x) => x.hours === curr.hours);
          if (found) {
            found.subslot.push(curr.subslot);
          } else {
            agg.push({
              hours: curr.hours,
              subslot: [curr.subslot],
            });
          }
          return agg;
        }, []);

        const result = ans.reduce((acc, curr) => {
          if (acc[curr.hours] === undefined) acc[curr.hours] = 0;
          curr.subslot.forEach((x) => (acc[curr.hours] += x.length));
          return acc;
        }, {});

        // console.log('counters datas >', datas);
        // console.log('counters >', result);

        // setBookingTime(ans);
        setBookingTime(ans);
        // console.log('ans >', ...ans);
      });
    } catch (error) {
      // console.log('Error from getTime', error);
    }
    // console.log('entity?', ...entity) //untuk pecahin array jadi object pake ...
    // console.log('project?', ...project)
  };

  // const handleGetSlot = (data, slot, hours) => {
  //   setDataOnClick(data);
  //   setSlotOnClick(slot);
  //   setHourOnClick(hours);
  // };

  const getMasterHours = getBookingTime.map((data) => data.hours);
  const getMaster = getBookingTime.map((data) => data);

  // console.log('master', getMaster);
  // console.log('splice', getMasterHours);

  const getMasterSlot = getBookingTime.map((data) => data.subslot);
  const getLoopSlot = [{ ...getMasterSlot }];

  function submitTicket() {
    const passProps = passProp;
    console.log('passprops', passProps);
    const body = passPropStorage;

    // const fileImg = image.uri.replace('file://', '');

    const bodyData = new FormData();
    bodyData.append('entity_cd', passProp.entity_cd);
    bodyData.append('project_no', passProp.project_no);
    bodyData.append('debtor_acct', passProp.dataDebtor.debtor_acct);
    {
      tab.id === 'O'
        ? bodyData.append('category_cd', 'A208')
        : bodyData.append('category_cd', passProp.category_cd);
    }
    bodyData.append('work_requested', passProp.workRequested);
    {
      isActive == 'ALL'
        ? bodyData.append('hours', isActive)
        : bodyData.append('hours', getHourOnClick);
    }
    bodyData.append('req_date', getDateOnClick);
    bodyData.append('subslot', getSlotOnClick);
    bodyData.append('reported_by', 'MGR');
    bodyData.append('serv_req_by', passProp.reportName);
    bodyData.append('contact_no', passProp.contactNo);
    bodyData.append('complain_source', 'MOBILE');
    bodyData.append('lot_no', passProp.select_lot_no);
    bodyData.append('req_email', passProp.dataDebtor.email);
    bodyData.append('respond_time', '');
    bodyData.append('req_type', tab.id);
    bodyData.append('zone_cd', passProp.zone_cd);
    bodyData.append('audit_user', 'MGR');
    // bodyData.append('audit_user', passProp.reportName);
    // bodyData.append('reportdate', '04 Nov 2021 08:47');
    bodyData.append(
      'reported_date',
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    );
    bodyData.append(
      'audit_date',
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    );

    console.log('liatbody', bodyData);

    const config = {
      method: 'post',
      url: API_URL_LOKAL + '/modules/troffice/save-maintenance',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: bodyData,
    };

    return axios(config)
      .then((res) => {
        // console.log('res ?', res);
        return res.json().then((resJson) => {
          // alert(resJson.Pesan);
          console.log('resJson', resJson);
          setMessage(resJson.message);
          setMessageResult(resJson.Result);
          // setStatus(resJson.Status);
          setStatus(resJson.success);
          showModalSuccess(true);
        });
      })
      .catch((err) => {
        console.log('err ?', err);
      });
  }

  console.log('messageResult', messageResult);

  const onCloseModal = () => {
    showModalSuccess(false);
    navigation.navigate('SpecTroffice');
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('ac_cleaning')} //belum dibuat lang
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
        contentContainerStyle={{ paddingHorizontal: 20 }}
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

        <View style={{ marginTop: 30, paddingHorizontal: 10 }}>
          <Text subheadline bold>
            Today
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
            borderRadius: 15,
            borderColor: colors.dark,
            borderBottomWidth: 1,
            padding: 10,
            marginBottom: 15,
            marginTop: 10,
          }}
        >
          <Text>{datatime.timeget}</Text>

          <Icon
            name="calendar-week"
            size={20}
            color={colors.primary}
            enableRTL={true}
            // onPress={() => setOpen(true)}
          />
        </View>

        <View>
          {/* REGULER */}
          {tab.id == 'R' ? (
            <View style={{ flexDirection: 'column' }}>
              {loadingTab ? (
                <View style={{ marginTop: 10 }}>
                  {/* <Spinner visible={this.state.spinner} /> */}
                  {/* <Placeholder style={{marginVertical: 4, paddingHorizontal: 10}}>
                      <PlaceholderLine width={100} noMargin style={{height: 40}} />
                    </Placeholder> */}
                  <ProgressBar
                    progress={1}
                    color={colors.primary}
                    indeterminate={true}
                  />
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    {TABSDATE.map((item, index) => (
                      <View
                        key={index}
                        style={{ flex: 1, paddingHorizontal: 5 }}
                      >
                        <Tag
                          outline
                          style={{
                            height: 60,
                            width: 60,
                            marginBottom: 20,

                            flexDirection: 'column',
                            backgroundColor:
                              tabDate.id == item.id
                                ? colors.primary
                                : colors.background,
                          }}
                          onPress={() => {
                            enableExperimental();
                            setTabDate(item);
                          }}
                        >
                          <View
                            style={{
                              flexGrow: 1,
                              flexDirection: 'row',
                            }}
                          >
                            <Text
                              bold
                              body1={tabDate.id != item.id}
                              light={tabDate.id != item.id}
                              whiteColor={tabDate.id == item.id}
                              style={{ textAlign: 'center', fontSize: 14 }}
                            >
                              {moment(item.title)
                                .locale('en')
                                .format('ddd DD')
                                .replace(' ', '\n')}
                            </Text>
                          </View>
                        </Tag>
                      </View>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {TABSLOT.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flex: 1,
                          paddingHorizontal: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Tag
                          primary
                          style={{
                            paddingVertical: 10,
                            backgroundColor:
                              tabslot.slot == item.slot
                                ? colors.primary
                                : colors.background,
                          }}
                          onPress={() => {
                            enableExperimental();
                            setTabSlot(item);
                          }}
                        >
                          <Text
                            bold
                            body1={tabslot.slot != item.slot}
                            light={tabslot.slot != item.slot}
                            whiteColor={tabslot.slot == item.slot}
                          >
                            {item.title}
                          </Text>
                        </Tag>
                      </View>
                    ))}
                  </View>

                  {/* TAB 1 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {/*SLOT A*/}
                      {tabDate.id == 1 && tabslot.slot == 1 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked1.open_book} -{' '}
                          {dataBooked1.close_book}
                        </Text>
                      )}
                      {tabDate.id == 1 &&
                      tabslot.slot == 1 &&
                      dataBooked1.close_status == 'Y'
                        ? dataBooked1?.slot_hours.map &&
                          dataBooked1?.slot_hours.map((items, indexs) =>
                            // passProp (tipe unit 1)
                            items.subslot == '1' && passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked1.open_book > items.jam ||
                                dataBooked1.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y'
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked1.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked1.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked1,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : (
                              items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked1.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked1.open_book > items.jam ||
                                  dataBooked1.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked1.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked1.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked1,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          // items.book_date,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 1 &&
                          tabslot.slot == 1 &&
                          dataBooked1.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}

                      {/*SLOT B*/}
                      {tabDate.id == 1 && tabslot.slot == 2 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked1.open_book} -{' '}
                          {dataBooked1.close_book}
                        </Text>
                      )}

                      {tabDate.id == 1 &&
                      tabslot.slot == 2 &&
                      dataBooked1.close_status == 'Y'
                        ? dataBooked1?.slot_hours.map &&
                          dataBooked1?.slot_hours.map((items, indexs) =>
                            items.subslot == '2' &&
                            dataBooked1.count_slot_1 >= '3' &&
                            passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked1.open_book > items.jam ||
                                dataBooked1.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked1.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked1.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked1,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : tabDate.id == 1 &&
                              items.subslot == '2' &&
                              passProp.slot == 1 &&
                              items.jam == '08:30' &&
                              dataBooked1.count_slot_1 < '3' ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  SLOT 1 MUST ALL BOOKED
                                </Text>
                              </View>
                            ) : tabDate.id == 1 &&
                              items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.jam == '08:30' &&
                              dataBooked1.count_slot_1 < '1' ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  SLOT 1 MUST ALL BOOKED
                                </Text>
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              items.jam == '08:30' &&
                              dataBookedOH1.count_slot_1 > 0 ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  This Slot Was Booked
                                </Text>
                              </View>
                            ) : (
                              items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked1.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked1.open_book > items.jam ||
                                  dataBooked1.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked1.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked1.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked1,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 1 &&
                          tabslot.slot == 2 &&
                          dataBooked1.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}
                    </View>
                  )}

                  {/* TAB 2 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View style={{ flex: 1, paddingHorizontal: 5 }}>
                      {/*SLOT A*/}
                      {tabDate.id == 2 && tabslot.slot == 1 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked2.open_book} -{' '}
                          {dataBooked2.close_book}
                        </Text>
                      )}
                      {tabDate.id == 2 &&
                      tabslot.slot == 1 &&
                      dataBooked2.close_status == 'Y'
                        ? dataBooked2?.slot_hours.map &&
                          dataBooked2?.slot_hours.map((items, indexs) =>
                            // passProp (tipe unit 1)
                            items.subslot == '1' && passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked2.open_book > items.jam ||
                                dataBooked2.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked2.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked2.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked2,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // isDateActive == getDateOnClick &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : (
                              items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked2.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked2.open_book > items.jam ||
                                  dataBooked2.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked2.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked2.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked2,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 2 &&
                          tabslot.slot == 1 &&
                          dataBooked2.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}

                      {/*SLOT B*/}
                      {tabDate.id == 2 && tabslot.slot == 2 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked2.open_book} -{' '}
                          {dataBooked2.close_book}
                        </Text>
                      )}

                      {tabDate.id == 2 &&
                      tabslot.slot == 2 &&
                      dataBooked2.close_status == 'Y'
                        ? dataBooked2?.slot_hours.map &&
                          dataBooked2?.slot_hours.map((items, indexs) =>
                            items.subslot == '2' &&
                            dataBooked2.count_slot_1 >= '3' &&
                            passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked2.open_book > items.jam ||
                                dataBooked2.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked2.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked2.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked2,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : tabDate.id == 2 &&
                              items.subslot == '2' &&
                              passProp.slot == 1 &&
                              items.jam == '08:30' &&
                              dataBooked2.count_slot_1 < '3' ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  SLOT 1 MUST ALL BOOKED
                                </Text>
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              items.jam == '08:30' &&
                              dataBookedOH2.count_slot_1 > 0 ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  This Slot Was Booked
                                </Text>
                              </View>
                            ) : (
                              items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked2.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked2.open_book > items.jam ||
                                  dataBooked2.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked2.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked2.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked2,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 2 &&
                          tabslot.slot == 2 &&
                          dataBooked2.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}
                    </View>
                  )}

                  {/* TAB 3 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {/*SLOT A*/}
                      {tabDate.id == 3 && tabslot.slot == 1 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked3.open_book} -{' '}
                          {dataBooked3.close_book}
                        </Text>
                      )}
                      {tabDate.id == 3 &&
                      tabslot.slot == 1 &&
                      dataBooked3.close_status == 'Y'
                        ? dataBooked3?.slot_hours.map &&
                          dataBooked3?.slot_hours.map((items, indexs) =>
                            // passProp (tipe unit 1)
                            items.subslot == '1' && passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked3.open_book > items.jam ||
                                dataBooked3.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked3.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked3.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked3,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : (
                              items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked3.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked3.open_book > items.jam ||
                                  dataBooked3.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked3.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked3.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked3,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 3 &&
                          tabslot.slot == 1 &&
                          dataBooked3.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}

                      {/*SLOT B*/}
                      {tabDate.id == 3 && tabslot.slot == 2 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked3.open_book} -{' '}
                          {dataBooked3.close_book}
                        </Text>
                      )}

                      {tabDate.id == 3 &&
                      tabslot.slot == 2 &&
                      dataBooked3.close_status == 'Y'
                        ? dataBooked3?.slot_hours.map &&
                          dataBooked3?.slot_hours.map((items, indexs) =>
                            items.subslot == '2' &&
                            dataBooked3.count_slot_1 >= '3' &&
                            passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked3.open_book > items.jam ||
                                dataBooked3.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked3.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked3.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked3,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Booking
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : tabDate.id == 3 &&
                              items.subslot == '2' &&
                              passProp.slot == 1 &&
                              items.jam == '08:30' &&
                              dataBooked3.count_slot_1 < '3' ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  SLOT 1 MUST ALL BOOKED
                                </Text>
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    ALL
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              items.jam == '08:30' &&
                              dataBookedOH3.count_slot_1 > 0 ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  This Slot Was Booked
                                </Text>
                              </View>
                            ) : (
                              items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked3.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked3.open_book > items.jam ||
                                  dataBooked3.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked3.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked3.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked3,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 3 &&
                          tabslot.slot == 2 &&
                          dataBooked3.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}
                    </View>
                  )}

                  {/* TAB 4 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {/*SLOT A*/}
                      {tabDate.id == 4 && tabslot.slot == 1 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked4.open_book} -{' '}
                          {dataBooked4.close_book}
                        </Text>
                      )}
                      {tabDate.id == 4 &&
                      tabslot.slot == 1 &&
                      dataBooked4.close_status == 'Y'
                        ? dataBooked4?.slot_hours.map &&
                          dataBooked4?.slot_hours.map((items, indexs) =>
                            // passProp (tipe unit 1)
                            items.subslot == '1' && passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked4.open_book > items.jam ||
                                dataBooked4.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked4.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked4.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked4,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                          {time.jam > items.jam
                            ? 'lebih dari jam'
                            : 'kurang dari jam'}
                        </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                  {moment(
                                                    itemdatabook.audit_date,
                                                  ).format(
                                                    'DD MMM YYYY HH:mm:ss',
                                                  )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : (
                              items.subslot == '1' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked4.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked4.open_book > items.jam ||
                                  dataBooked4.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked4.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked4.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked4,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 4 &&
                          tabslot.slot == 1 &&
                          dataBooked4.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}

                      {/*SLOT B*/}
                      {tabDate.id == 4 && tabslot.slot == 2 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBooked4.open_book} -{' '}
                          {dataBooked4.close_book}
                        </Text>
                      )}

                      {tabDate.id == 4 &&
                      tabslot.slot == 2 &&
                      dataBooked4.close_status == 'Y'
                        ? dataBooked4?.slot_hours.map &&
                          dataBooked4?.slot_hours.map((items, indexs) =>
                            items.subslot == '2' &&
                            dataBooked4.count_slot_1 >= '3' &&
                            passProp.slot == 1 ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    {items.jam.substring(0, 5)}
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                items.databook == '' ||
                                dataBooked4.open_book > items.jam ||
                                dataBooked4.close_book < items.jam ? (
                                  <TouchableOpacity
                                    disabled={
                                      items.status_avail != 'Y' &&
                                      passProp.slot == 3
                                        ? // ||
                                          // time.jam > items.jam

                                          true
                                        : (false && items.databook == '') ||
                                          items.databook == null ||
                                          dataBooked4.open_book > items.jam
                                        ? true
                                        : false ||
                                          dataBooked4.close_book < items.jam
                                    }
                                    onPress={() => {
                                      onBookingPress(
                                        dataBooked4,
                                        items.book_date,
                                        items.jam,
                                        items.subslot,
                                      );
                                      handleClick(
                                        items.jam,
                                        items.subslot,
                                        tab.id,
                                        tabDate.id,
                                      );
                                    }}
                                    style={StyleSheet.flatten([
                                      {
                                        height: 50,
                                        backgroundColor:
                                          tabDate.id == isDateActive &&
                                          isActive == items.jam &&
                                          isDataActive == items.subslot &&
                                          // getDateOnClick == items.book_date &&
                                          isCategoryActive == tab.id
                                            ? 'salmon'
                                            : colors.primary,
                                        // items.status_avail == 'Y'
                                        //   ? // &&
                                        //     // time.jam < items.jam
                                        //     colors.primary
                                        //   : items.databook[0].status == 'O'
                                        //   ? BaseColor.orangeColor
                                        //   : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      isExpand && {
                                        height: 50,
                                        backgroundColor:
                                          items.status_avail == 'Y'
                                            ? // &&
                                              // time.jam < items.jam
                                              colors.primary
                                            : items.databook[0].status == 'O'
                                            ? BaseColor.orangeColor
                                            : BaseColor.redColor,
                                        padding: 15,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                      },
                                      // isClick && {
                                      //   backgroundColor:
                                      //     getHourOnClick != null
                                      //       ? 'tomato'
                                      //       : colors.primary,

                                      //     },
                                    ])}
                                  >
                                    <Text whiteColor subheadline bold>
                                      Select
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{ marginRight: 5 }}
                                    // onPress={() => setExpandIcon(indexs)}
                                    onPress={() => setExpandIcon(indexs)}
                                  >
                                    {/* {console.log('boolean apasi ini', indexs)} */}
                                    <View
                                      style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 10,
                                        backgroundColor: colors.primary,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Icon
                                        name={
                                          'chevron-down'
                                          // isIconUp ? 'chevron-up' : 'chevron-down'
                                        }
                                        color={'#fff'}
                                      ></Icon>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ) : tabDate.id == 4 &&
                              items.subslot == '2' &&
                              passProp.slot == 1 &&
                              items.jam == '08:30' &&
                              dataBooked4.count_slot_1 < '3' ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  SLOT 1 MUST ALL BOOKED
                                </Text>
                              </View>
                            ) : // passProp (tipe unit 3)
                            items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook != '' ? (
                              <View
                                key={indexs}
                                style={StyleSheet.flatten([
                                  {
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'space-between',
                                    borderRadius: 15,
                                    borderColor: '#dbdbdb',
                                    borderBottomWidth: 1,
                                  },
                                  !isExpand && {
                                    borderBottomWidth: 1,

                                    borderBottomColor: colors.border,
                                  },
                                ])}
                              >
                                <View style={{ flexDirection: 'column' }}>
                                  <Text key={items.id} bold>
                                    ALL
                                  </Text>
                                  <Text
                                    key={items.id}
                                    bold
                                    style={{ justifyContent: 'center' }}
                                  >
                                    Slot : {items.subslot}
                                  </Text>
                                </View>
                                {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                                <View>
                                  {items.databook != ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View key={keys}>
                                            <Text
                                              bold
                                              style={{
                                                width: 200,
                                              }}
                                            >
                                              {itemdatabook.serv_req_by}
                                            </Text>
                                            <Text bold>
                                              {itemdatabook.lot_no}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}

                                  {isExpand && (
                                    <View key={indexs}>
                                      {items.databook !== ''
                                        ? items.databook.map(
                                            (itemdatabook, keys) => (
                                              <View
                                                key={keys}
                                                style={{ width: '100%' }}
                                              >
                                                <Text>
                                                  {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                                  Report No :{' '}
                                                  {itemdatabook.report_no}
                                                </Text>
                                                <Text>
                                                  Category :{' '}
                                                  {itemdatabook.category_cd}
                                                </Text>
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  )}
                                </View>
                                {items.status_avail == 'Y' ||
                                  (items.databook != '' && (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            ) : items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              items.jam == '08:30' &&
                              dataBookedOH4.count_slot_1 > 0 ? (
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: '25%',
                                }}
                              >
                                <IconFontisto
                                  name="holiday-village"
                                  size={40}
                                  color={colors.primary}
                                  style={{
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}
                                ></IconFontisto>
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
                                  This Slot Was Booked
                                </Text>
                              </View>
                            ) : (
                              items.subslot == '2' &&
                              passProp.slot == 3 &&
                              items.databook == '' &&
                              (items.jam == '08:30' ? (
                                <View
                                  key={indexs}
                                  style={StyleSheet.flatten([
                                    {
                                      paddingVertical: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignContent: 'space-between',
                                      borderRadius: 15,
                                      borderColor: '#dbdbdb',
                                      borderBottomWidth: 1,
                                    },
                                    !isExpand && {
                                      borderBottomWidth: 1,

                                      borderBottomColor: colors.border,
                                    },
                                  ])}
                                >
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text bold>
                                      {moment(dataBooked4.book_date).format(
                                        'LL',
                                      )}
                                    </Text>
                                    <Text bold>Slot : {items.subslot}</Text>
                                  </View>
                                  {/* <Text key={items.id} bold>
                      {time.jam > items.jam
                        ? 'lebih dari jam'
                        : 'kurang dari jam'}
                    </Text> */}
                                  <View>
                                    {items.databook != ''
                                      ? items.databook.map(
                                          (itemdatabook, keys) => (
                                            <View key={keys}>
                                              <Text
                                                bold
                                                style={{
                                                  width: 200,
                                                }}
                                              >
                                                {itemdatabook.serv_req_by}
                                              </Text>
                                              <Text bold>
                                                {itemdatabook.lot_no}
                                              </Text>
                                            </View>
                                          ),
                                        )
                                      : null}

                                    {isExpand && (
                                      <View key={indexs}>
                                        {items.databook !== ''
                                          ? items.databook.map(
                                              (itemdatabook, keys) => (
                                                <View
                                                  key={keys}
                                                  style={{ width: '100%' }}
                                                >
                                                  <Text>
                                                    {/* Created date :{' '}
                                              {moment(
                                                itemdatabook.audit_date,
                                              ).format(
                                                'DD MMM YYYY HH:mm:ss',
                                              )} */}
                                                    Report No :{' '}
                                                    {itemdatabook.report_no}
                                                  </Text>
                                                  <Text>
                                                    Category :{' '}
                                                    {itemdatabook.category_cd}
                                                  </Text>
                                                </View>
                                              ),
                                            )
                                          : null}
                                      </View>
                                    )}
                                  </View>
                                  {items.status_avail == 'Y' ||
                                  items.databook == '' ||
                                  dataBooked4.open_book > items.jam ||
                                  dataBooked4.close_book < items.jam ? (
                                    <TouchableOpacity
                                      disabled={
                                        items.status_avail != 'Y' &&
                                        passProp.slot == 3
                                          ? // ||
                                            // time.jam > items.jam

                                            true
                                          : (false && items.databook == '') ||
                                            items.databook == null ||
                                            dataBooked4.open_book > items.jam
                                          ? true
                                          : false ||
                                            dataBooked4.close_book < items.jam
                                      }
                                      onPress={() => {
                                        onBookingPress(
                                          dataBooked4,
                                          items.book_date,
                                          items.jam,
                                          items.subslot,
                                        );
                                        handleClickType(
                                          items.jam,
                                          items.subslot,
                                          tab.id,
                                          tabDate.id,
                                        );
                                      }}
                                      style={StyleSheet.flatten([
                                        {
                                          height: 50,
                                          backgroundColor:
                                            (tabDate.id == isDateActive &&
                                              isActive == items.jam) ||
                                            (isActive == 'ALL' &&
                                              isDataActive == items.subslot &&
                                              tabDate.id == isDateActive &&
                                              // getDateOnClick ==
                                              //   items.book_date &&
                                              isCategoryActive == tab.id)
                                              ? 'salmon'
                                              : colors.primary,
                                          // items.status_avail == 'Y'
                                          //   ? // &&
                                          //     // time.jam < items.jam
                                          //     colors.primary
                                          //   : items.databook[0].status == 'O'
                                          //   ? BaseColor.orangeColor
                                          //   : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        isExpand && {
                                          height: 50,
                                          backgroundColor:
                                            items.status_avail == 'Y'
                                              ? // &&
                                                // time.jam < items.jam
                                                colors.primary
                                              : items.databook[0].status == 'O'
                                              ? BaseColor.orangeColor
                                              : BaseColor.redColor,
                                          padding: 15,
                                          borderRadius: 15,
                                          justifyContent: 'center',
                                        },
                                        // isClick && {
                                        //   backgroundColor:
                                        //     getHourOnClick != null
                                        //       ? 'tomato'
                                        //       : colors.primary,

                                        //     },
                                      ])}
                                    >
                                      <Text whiteColor subheadline bold>
                                        Select
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={{ marginRight: 5 }}
                                      // onPress={() => setExpandIcon(indexs)}
                                      onPress={() => setExpandIcon(indexs)}
                                    >
                                      {/* {console.log('boolean apasi ini', indexs)} */}
                                      <View
                                        style={{
                                          width: 25,
                                          height: 25,
                                          borderRadius: 10,
                                          backgroundColor: colors.primary,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          alignContent: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Icon
                                          name={
                                            'chevron-down'
                                            // isIconUp ? 'chevron-up' : 'chevron-down'
                                          }
                                          color={'#fff'}
                                        ></Icon>
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : null)
                            ),
                          )
                        : tabDate.id == 4 &&
                          tabslot.slot == 2 &&
                          dataBooked4.close_status == 'N' && (
                            <View
                              style={{
                                flex: 1,
                                marginTop: '50%',
                              }}
                            >
                              <IconFontisto
                                name="holiday-village"
                                size={40}
                                color={colors.primary}
                                style={{
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                }}
                              ></IconFontisto>
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
                                Sorry! The Facility is closed.
                              </Text>
                            </View>
                          )}
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : null}

          {/* OVERHAUL */}

          {tab.id == 'O' ? (
            <View style={{ flexDirection: 'column' }}>
              {loadingTab ? (
                <View style={{ marginTop: 10 }}>
                  {/* <Spinner visible={this.state.spinner} /> */}
                  {/* <Placeholder style={{marginVertical: 4, paddingHorizontal: 10}}>
                      <PlaceholderLine width={100} noMargin style={{height: 40}} />
                    </Placeholder> */}
                  <ProgressBar
                    progress={1}
                    color={colors.primary}
                    indeterminate={true}
                  />
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    {TABSDATE.map((item, index) => (
                      <View
                        key={index}
                        style={{ flex: 1, paddingHorizontal: 5 }}
                      >
                        <Tag
                          outline
                          style={{
                            height: 60,
                            width: 60,
                            marginBottom: 20,
                            flexDirection: 'column',
                            backgroundColor:
                              tabDate.id == item.id
                                ? colors.primary
                                : colors.background,
                          }}
                          onPress={() => {
                            enableExperimental();
                            setTabDate(item);
                          }}
                        >
                          <View
                            style={{
                              flexGrow: 1,
                              flexDirection: 'row',
                            }}
                          >
                            <Text
                              bold
                              body1={tabDate.id != item.id}
                              light={tabDate.id != item.id}
                              whiteColor={tabDate.id == item.id}
                              style={{ textAlign: 'center', fontSize: 14 }}
                            >
                              {moment(item.title)
                                .locale('en')
                                .format('ddd DD')
                                .replace(' ', '\n')}
                            </Text>
                          </View>
                        </Tag>
                      </View>
                    ))}
                  </View>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  ></View>
                  {/* OVERHAUL TAB 1 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {tabDate.id == 1 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBookedOH1.open_book} -{' '}
                          {dataBookedOH1.close_book}
                        </Text>
                      )}

                      {tabDate.id == 1 &&
                      dataBookedOH1.close_status == 'Y' &&
                      dataBooked1.count_slot_2 == 0 ? (
                        dataBookedOH1?.slot_hours.map &&
                        dataBookedOH1?.slot_hours.map((items, indexs) => (
                          <View
                            key={indexs}
                            style={StyleSheet.flatten([
                              {
                                paddingVertical: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                borderRadius: 15,
                                borderColor: '#dbdbdb',
                                borderBottomWidth: 1,
                              },
                              !isExpand && {
                                borderBottomWidth: 1,

                                borderBottomColor: colors.border,
                              },
                            ])}
                          >
                            <View style={{ flexDirection: 'column' }}>
                              <Text key={items.id} bold>
                                {items.jam}
                              </Text>
                              <Text
                                key={items.id}
                                bold
                                style={{ justifyContent: 'center' }}
                              >
                                Slot : {items.subslot}
                              </Text>
                            </View>
                            {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                            <View>
                              {items.databook != ''
                                ? items.databook.map((itemdatabook, keys) => (
                                    <View key={keys}>
                                      <Text
                                        bold
                                        style={{
                                          width: 180,
                                        }}
                                      >
                                        {itemdatabook.serv_req_by}
                                      </Text>
                                      <Text bold>{itemdatabook.lot_no}</Text>
                                    </View>
                                  ))
                                : null}

                              {isExpand && (
                                <View key={indexs}>
                                  {items.databook !== ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View
                                            key={keys}
                                            style={{ width: '100%' }}
                                          >
                                            <Text>
                                              {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                              Report No :{' '}
                                              {itemdatabook.report_no}
                                            </Text>
                                            <Text>
                                              Category :{' '}
                                              {itemdatabook.category_cd}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}
                                </View>
                              )}
                            </View>
                            {items.status_avail == 'Y' ||
                            items.databook == '' ||
                            dataBookedOH1.open_book > items.jam ||
                            dataBookedOH1.close_book < items.jam ? (
                              <TouchableOpacity
                                disabled={
                                  items.status_avail != 'Y'
                                    ? // ||
                                      // time.jam > items.jam
                                      true
                                    : false ||
                                      dataBookedOH1.open_book > items.jam
                                    ? true
                                    : false ||
                                      dataBookedOH1.close_book < items.jam
                                    ? true
                                    : false
                                }
                                onPress={() => {
                                  onBookingPress(
                                    dataBookedOH1,
                                    items.book_date,
                                    items.jam,
                                    items.subslot,
                                  );

                                  handleClick(
                                    items.jam,
                                    items.subslot,
                                    tab.id,
                                    tabDate.id,
                                  );
                                }}
                                style={StyleSheet.flatten([
                                  {
                                    height: 50,
                                    backgroundColor:
                                      tabDate.id == isDateActive &&
                                      isActive == items.jam &&
                                      isDataActive == items.subslot &&
                                      // getDatesOnClick == items.book_date &&
                                      isCategoryActive == tab.id
                                        ? 'salmon'
                                        : colors.primary,
                                    // items.status_avail == 'Y'
                                    //   ? // &&
                                    //     // time.jam < items.jam
                                    //     colors.primary
                                    //   : items.databook[0].status == 'O'
                                    //   ? BaseColor.orangeColor
                                    //   : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  isExpand && {
                                    height: 50,
                                    backgroundColor:
                                      items.status_avail == 'Y'
                                        ? // &&
                                          // time.jam < items.jam
                                          colors.primary
                                        : items.databook[0].status == 'O'
                                        ? BaseColor.orangeColor
                                        : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  // isClick && {
                                  //   backgroundColor:
                                  //     getHourOnClick != null
                                  //       ? 'tomato'
                                  //       : colors.primary,
                                  // },
                                ])}
                              >
                                <Text whiteColor subheadline bold>
                                  Select
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{ marginRight: 5 }}
                                // onPress={() => setExpandIcon(indexs)}
                                onPress={() => setExpandIcon(indexs)}
                              >
                                {/* {console.log('boolean apasi ini', indexs)} */}
                                <View
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 10,
                                    backgroundColor: colors.primary,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Icon
                                    name={
                                      'chevron-down'
                                      // isIconUp ? 'chevron-up' : 'chevron-down'
                                    }
                                    color={'#fff'}
                                  ></Icon>
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : tabDate.id == 1 &&
                        dataBookedOH1.close_status == 'N' ? (
                        <View
                          style={{
                            flex: 1,
                            marginTop: '25%',
                          }}
                        >
                          <IconFontisto
                            name="holiday-village"
                            size={40}
                            color={colors.primary}
                            style={{
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}
                          ></IconFontisto>
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
                            Sorry! The Facility is closed.
                          </Text>
                        </View>
                      ) : (
                        tabDate.id == 1 &&
                        dataBookedOH1.close_status == 'Y' && (
                          <View
                            style={{
                              flex: 1,
                              marginTop: '25%',
                            }}
                          >
                            <IconFontisto
                              name="holiday-village"
                              size={40}
                              color={colors.primary}
                              style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}
                            ></IconFontisto>
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
                              Sorry! The Slot is full please choose another
                              slot.
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                  {/* OVERHAUL TAB 2 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {tabDate.id == 2 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBookedOH2.open_book} -{' '}
                          {dataBookedOH2.close_book}
                        </Text>
                      )}

                      {tabDate.id == 2 &&
                      dataBookedOH2.close_status == 'Y' &&
                      dataBooked2.count_slot_2 == 0 ? (
                        dataBookedOH2?.slot_hours.map &&
                        dataBookedOH2?.slot_hours.map((items, indexs) => (
                          <View
                            key={indexs}
                            style={StyleSheet.flatten([
                              {
                                paddingVertical: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                borderRadius: 15,
                                borderColor: '#dbdbdb',
                                borderBottomWidth: 1,
                              },
                              !isExpand && {
                                borderBottomWidth: 1,

                                borderBottomColor: colors.border,
                              },
                            ])}
                          >
                            <View style={{ flexDirection: 'column' }}>
                              <Text key={items.id} bold>
                                {items.jam}
                              </Text>
                              <Text
                                key={items.id}
                                bold
                                style={{ justifyContent: 'center' }}
                              >
                                Slot : {items.subslot}
                              </Text>
                            </View>
                            {/* <Text key={items.id} bold>
                        {time.jam > items.jam
                          ? 'lebih dari jam'
                          : 'kurang dari jam'}
                      </Text> */}
                            <View>
                              {items.databook != ''
                                ? items.databook.map((itemdatabook, keys) => (
                                    <View key={keys}>
                                      <Text
                                        bold
                                        style={{
                                          width: 180,
                                        }}
                                      >
                                        {itemdatabook.serv_req_by}
                                      </Text>
                                      <Text bold>{itemdatabook.lot_no}</Text>
                                    </View>
                                  ))
                                : null}

                              {isExpand && (
                                <View key={indexs}>
                                  {items.databook !== ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View
                                            key={keys}
                                            style={{ width: '100%' }}
                                          >
                                            <Text>
                                              {/* Created date :{' '}
                                                {moment(
                                                  itemdatabook.audit_date,
                                                ).format(
                                                  'DD MMM YYYY HH:mm:ss',
                                                )} */}
                                              Report No :{' '}
                                              {itemdatabook.report_no}
                                            </Text>
                                            <Text>
                                              Category :{' '}
                                              {itemdatabook.category_cd}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}
                                </View>
                              )}
                            </View>
                            {items.status_avail == 'Y' ||
                            items.databook == '' ||
                            dataBookedOH2.open_book > items.jam ||
                            dataBookedOH2.close_book < items.jam ? (
                              <TouchableOpacity
                                disabled={
                                  items.status_avail != 'Y'
                                    ? // ||
                                      // time.jam > items.jam
                                      true
                                    : false ||
                                      dataBookedOH2.open_book > items.jam
                                    ? true
                                    : false ||
                                      dataBookedOH2.close_book < items.jam
                                    ? true
                                    : false
                                }
                                onPress={() => {
                                  onBookingPress(
                                    dataBookedOH2,
                                    items.book_date,
                                    items.jam,
                                    items.subslot,
                                  );
                                  handleClick(
                                    items.jam,
                                    items.subslot,
                                    tab.id,
                                    tabDate.id,
                                  );
                                }}
                                style={StyleSheet.flatten([
                                  {
                                    height: 50,
                                    backgroundColor:
                                      tabDate.id == isDateActive &&
                                      isActive == items.jam &&
                                      isDataActive == items.subslot &&
                                      // getDateOnClick == items.book_date &&
                                      isCategoryActive == tab.id
                                        ? 'salmon'
                                        : colors.primary,
                                    // items.status_avail == 'Y'
                                    //   ? // &&
                                    //     // time.jam < items.jam
                                    //     colors.primary
                                    //   : items.databook[0].status == 'O'
                                    //   ? BaseColor.orangeColor
                                    //   : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  isExpand && {
                                    height: 50,
                                    backgroundColor:
                                      items.status_avail == 'Y'
                                        ? // &&
                                          // time.jam < items.jam
                                          colors.primary
                                        : items.databook[0].status == 'O'
                                        ? BaseColor.orangeColor
                                        : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  // isClick && {
                                  //   backgroundColor:
                                  //     getHourOnClick != null
                                  //       ? 'tomato'
                                  //       : colors.primary,
                                  // },
                                ])}
                              >
                                <Text whiteColor subheadline bold>
                                  Select
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{ marginRight: 5 }}
                                // onPress={() => setExpandIcon(indexs)}
                                onPress={() => setExpandIcon(indexs)}
                              >
                                {/* {console.log('boolean apasi ini', indexs)} */}
                                <View
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 10,
                                    backgroundColor: colors.primary,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Icon
                                    name={
                                      'chevron-down'
                                      // isIconUp ? 'chevron-up' : 'chevron-down'
                                    }
                                    color={'#fff'}
                                  ></Icon>
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : tabDate.id == 2 &&
                        dataBookedOH2.close_status == 'N' ? (
                        <View
                          style={{
                            flex: 1,
                            marginTop: '25%',
                          }}
                        >
                          <IconFontisto
                            name="holiday-village"
                            size={40}
                            color={colors.primary}
                            style={{
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}
                          ></IconFontisto>
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
                            Sorry! The Facility is closed.
                          </Text>
                        </View>
                      ) : (
                        tabDate.id == 2 &&
                        dataBookedOH2.close_status == 'Y' && (
                          <View
                            style={{
                              flex: 1,
                              marginTop: '25%',
                            }}
                          >
                            <IconFontisto
                              name="holiday-village"
                              size={40}
                              color={colors.primary}
                              style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}
                            ></IconFontisto>
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
                              Sorry! The Slot is full please choose another
                              slot.
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {/* OVERHAUL TAB 3 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {tabDate.id == 3 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBookedOH3.open_book} -{' '}
                          {dataBookedOH3.close_book}
                        </Text>
                      )}

                      {tabDate.id == 3 &&
                      dataBookedOH3.close_status == 'Y' &&
                      dataBooked3.count_slot_2 == 0 ? (
                        dataBookedOH3?.slot_hours.map &&
                        dataBookedOH3?.slot_hours.map((items, indexs) => (
                          <View
                            key={indexs}
                            style={StyleSheet.flatten([
                              {
                                paddingVertical: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                borderRadius: 15,
                                borderColor: '#dbdbdb',
                                borderBottomWidth: 1,
                              },
                              !isExpand && {
                                borderBottomWidth: 1,

                                borderBottomColor: colors.border,
                              },
                            ])}
                          >
                            <View style={{ flexDirection: 'column' }}>
                              <Text key={items.id} bold>
                                {items.jam}
                              </Text>
                              <Text
                                key={items.id}
                                bold
                                style={{ justifyContent: 'center' }}
                              >
                                Slot : {items.subslot}
                              </Text>
                            </View>
                            {/* <Text key={items.id} bold>
        {time.jam > items.jam
          ? 'lebih dari jam'
          : 'kurang dari jam'}
      </Text> */}
                            <View>
                              {items.databook != ''
                                ? items.databook.map((itemdatabook, keys) => (
                                    <View key={keys} style={{ marginLeft: 10 }}>
                                      <Text
                                        bold
                                        style={{
                                          width: 180,
                                        }}
                                      >
                                        {itemdatabook.serv_req_by}
                                      </Text>
                                      <Text bold>{itemdatabook.lot_no}</Text>
                                    </View>
                                  ))
                                : null}

                              {isExpand && (
                                <View key={indexs}>
                                  {items.databook !== ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View
                                            key={keys}
                                            style={{
                                              width: '100%',
                                              marginLeft: 10,
                                            }}
                                          >
                                            <Text>
                                              {/* Created date :{' '}
                                {moment(
                                  itemdatabook.audit_date,
                                ).format(
                                  'DD MMM YYYY HH:mm:ss',
                                )} */}
                                              Report No :{' '}
                                              {itemdatabook.report_no}
                                            </Text>
                                            <Text>
                                              Category :{' '}
                                              {itemdatabook.category_cd}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}
                                </View>
                              )}
                            </View>
                            {items.status_avail == 'Y' ||
                            items.databook == '' ||
                            dataBookedOH3.open_book > items.jam ||
                            dataBookedOH3.close_book < items.jam ? (
                              <TouchableOpacity
                                disabled={
                                  items.status_avail != 'Y'
                                    ? // ||
                                      // time.jam > items.jam
                                      true
                                    : false ||
                                      dataBookedOH3.open_book > items.jam
                                    ? true
                                    : false ||
                                      dataBookedOH3.close_book < items.jam
                                    ? true
                                    : false
                                }
                                onPress={() => {
                                  onBookingPress(
                                    dataBookedOH3,
                                    items.book_date,
                                    items.jam,
                                    items.subslot,
                                  );
                                  handleClick(
                                    items.jam,
                                    items.subslot,
                                    tab.id,
                                    tabDate.id,
                                  );
                                }}
                                style={StyleSheet.flatten([
                                  {
                                    height: 50,
                                    backgroundColor:
                                      tabDate.id == isDateActive &&
                                      isActive == items.jam &&
                                      isDataActive == items.subslot &&
                                      // getDateOnClick == items.book_date &&
                                      isCategoryActive == tab.id
                                        ? 'salmon'
                                        : colors.primary,
                                    // items.status_avail == 'Y'
                                    //   ? // &&
                                    //     // time.jam < items.jam
                                    //     colors.primary
                                    //   : items.databook[0].status == 'O'
                                    //   ? BaseColor.orangeColor
                                    //   : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  isExpand && {
                                    height: 50,
                                    backgroundColor:
                                      items.status_avail == 'Y'
                                        ? // &&
                                          // time.jam < items.jam
                                          colors.primary
                                        : items.databook[0].status == 'O'
                                        ? BaseColor.orangeColor
                                        : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  // isClick && {
                                  //   backgroundColor:
                                  //     getHourOnClick != null
                                  //       ? 'tomato'
                                  //       : colors.primary,
                                  // },
                                ])}
                              >
                                <Text whiteColor subheadline bold>
                                  Select
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{ marginRight: 5 }}
                                // onPress={() => setExpandIcon(indexs)}
                                onPress={() => setExpandIcon(indexs)}
                              >
                                {/* {console.log('boolean apasi ini', indexs)} */}
                                <View
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 10,
                                    backgroundColor: colors.primary,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Icon
                                    name={
                                      'chevron-down'
                                      // isIconUp ? 'chevron-up' : 'chevron-down'
                                    }
                                    color={'#fff'}
                                  ></Icon>
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : tabDate.id == 3 &&
                        dataBookedOH3.close_status == 'N' ? (
                        <View
                          style={{
                            flex: 1,
                            marginTop: '25%',
                          }}
                        >
                          <IconFontisto
                            name="holiday-village"
                            size={40}
                            color={colors.primary}
                            style={{
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}
                          ></IconFontisto>
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
                            Sorry! The Facility is closed.
                          </Text>
                        </View>
                      ) : (
                        tabDate.id == 3 &&
                        dataBookedOH3.close_status == 'Y' && (
                          <View
                            style={{
                              flex: 1,
                              marginTop: '25%',
                            }}
                          >
                            <IconFontisto
                              name="holiday-village"
                              size={40}
                              color={colors.primary}
                              style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}
                            ></IconFontisto>
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
                              Sorry! The Slot is full please choose another
                              slot.
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {/* OVERHAUL TAB 4 */}
                  {spinnerHour ? (
                    <View></View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 5,
                      }}
                    >
                      {tabDate.id == 4 && (
                        <Text style={{ fontStyle: 'italic' }}>
                          Operational Hour : {dataBookedOH4.open_book} -{' '}
                          {dataBookedOH4.close_book}
                        </Text>
                      )}

                      {tabDate.id == 4 &&
                      dataBookedOH4.close_status == 'Y' &&
                      dataBooked3.count_slot_2 == 0 ? (
                        dataBookedOH4?.slot_hours.map &&
                        dataBookedOH4?.slot_hours.map((items, indexs) => (
                          <View
                            key={indexs}
                            style={StyleSheet.flatten([
                              {
                                paddingVertical: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                borderRadius: 15,
                                borderColor: '#dbdbdb',
                                borderBottomWidth: 1,
                              },
                              !isExpand && {
                                borderBottomWidth: 1,

                                borderBottomColor: colors.border,
                              },
                            ])}
                          >
                            <View style={{ flexDirection: 'column' }}>
                              <Text key={items.id} bold>
                                {items.jam}
                              </Text>
                              <Text
                                key={items.id}
                                bold
                                style={{ justifyContent: 'center' }}
                              >
                                Slot : {items.subslot}
                              </Text>
                            </View>
                            {/* <Text key={items.id} bold>
        {time.jam > items.jam
          ? 'lebih dari jam'
          : 'kurang dari jam'}
      </Text> */}
                            <View>
                              {items.databook != ''
                                ? items.databook.map((itemdatabook, keys) => (
                                    <View key={keys}>
                                      <Text
                                        bold
                                        style={{
                                          width: 180,
                                        }}
                                      >
                                        {itemdatabook.serv_req_by}
                                      </Text>
                                      <Text bold>{itemdatabook.lot_no}</Text>
                                    </View>
                                  ))
                                : null}

                              {isExpand && (
                                <View key={indexs}>
                                  {items.databook !== ''
                                    ? items.databook.map(
                                        (itemdatabook, keys) => (
                                          <View
                                            key={keys}
                                            style={{ width: '100%' }}
                                          >
                                            <Text>
                                              {/* Created date :{' '}
                                {moment(
                                  itemdatabook.audit_date,
                                ).format(
                                  'DD MMM YYYY HH:mm:ss',
                                )} */}
                                              Report No :{' '}
                                              {itemdatabook.report_no}
                                            </Text>
                                            <Text>
                                              Category :{' '}
                                              {itemdatabook.category_cd}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    : null}
                                </View>
                              )}
                            </View>
                            {items.status_avail == 'Y' ||
                            items.databook == '' ||
                            dataBookedOH4.open_book > items.jam ||
                            dataBookedOH4.close_book < items.jam ? (
                              <TouchableOpacity
                                disabled={
                                  items.status_avail != 'Y'
                                    ? // ||
                                      // time.jam > items.jam
                                      true
                                    : false ||
                                      dataBookedOH4.open_book > items.jam
                                    ? true
                                    : false ||
                                      dataBookedOH4.close_book < items.jam
                                    ? true
                                    : false
                                }
                                onPress={() => {
                                  onBookingPress(
                                    dataBookedOH4,
                                    items.book_date,
                                    items.jam,
                                    items.subslot,
                                  );
                                  handleClick(
                                    items.jam,
                                    items.subslot,
                                    tab.id,
                                    tabDate.id,
                                  );
                                }}
                                style={StyleSheet.flatten([
                                  {
                                    height: 50,
                                    backgroundColor:
                                      tabDate.id == isDateActive &&
                                      isActive == items.jam &&
                                      isDataActive == items.subslot &&
                                      // getDateOnClick == items.book_date &&
                                      isCategoryActive == tab.id
                                        ? 'salmon'
                                        : colors.primary,
                                    // items.status_avail == 'Y'
                                    //   ? // &&
                                    //     // time.jam < items.jam
                                    //     colors.primary
                                    //   : items.databook[0].status == 'O'
                                    //   ? BaseColor.orangeColor
                                    //   : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  isExpand && {
                                    height: 50,
                                    backgroundColor:
                                      items.status_avail == 'Y'
                                        ? // &&
                                          // time.jam < items.jam
                                          colors.primary
                                        : items.databook[0].status == 'O'
                                        ? BaseColor.orangeColor
                                        : BaseColor.redColor,
                                    padding: 15,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                  },
                                  // isClick && {
                                  //   backgroundColor:
                                  //     getHourOnClick != null
                                  //       ? 'tomato'
                                  //       : colors.primary,
                                  // },
                                ])}
                              >
                                <Text whiteColor subheadline bold>
                                  Select
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{ marginRight: 5 }}
                                onPress={() => setExpandIcon(indexs)}
                              >
                                <View
                                  style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 10,
                                    backgroundColor: colors.primary,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Icon
                                    name={
                                      'chevron-down'
                                      // isIconUp ? 'chevron-up' : 'chevron-down'
                                    }
                                    color={'#fff'}
                                  ></Icon>
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : tabDate.id == 4 &&
                        dataBookedOH4.close_status == 'N' ? (
                        <View
                          style={{
                            flex: 1,
                            marginTop: '25%',
                          }}
                        >
                          <IconFontisto
                            name="holiday-village"
                            size={40}
                            color={colors.primary}
                            style={{
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}
                          ></IconFontisto>
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
                            Sorry! The Facility is closed.
                          </Text>
                        </View>
                      ) : (
                        tabDate.id == 4 &&
                        dataBookedOH4.close_status == 'Y' && (
                          <View
                            style={{
                              flex: 1,
                              marginTop: '25%',
                            }}
                          >
                            <IconFontisto
                              name="holiday-village"
                              size={40}
                              color={colors.primary}
                              style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}
                            ></IconFontisto>
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
                              Sorry! The Slot is full please choose another
                              slot.
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: '17%',
          borderWidth: 1,
          borderStyle: 'solid',
          borderTopEndRadius: 15,
          borderTopLeftRadius: 15,
          justifyContent: 'center',
          // flex: 1,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            borderRightWidth: 2,
            borderRightColor: colors.primary,
          }}
        >
          <View
            style={{
              marginBottom: 15,
              marginLeft: '15%',
              marginRight: '15%',
              marginTop: 8,
            }}
          >
            <Text bold>Selected Slot</Text>
          </View>
          {/* {getSlotOnClick.map((data, index) => (
                  <Text>{data}</Text>
                ))}  */}
          <Text>
            Date : {moment(getDateOnClick).locale('en').format('DD ddd')}
          </Text>
          <Text>Category : {tab.title}</Text>
          <Text>
            Hours : {passProp.slot == '3' ? isActive : getHourOnClick} - Slot :{' '}
            {getSlotOnClick}
          </Text>
        </View>

        {getHourOnClick == null || getHourOnClick == '' ? (
          <Button
            disabled
            small
            style={{
              marginTop: 35,
              marginHorizontal: 'auto',
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
              paddingVertical: 10,
              paddingHorizontal: 10,
              flex: 1,
            }}
            onPress={() => {
              submitTicket();
              navigation.navigate('SpecTroffice');
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: 14,
              }}
            >
              {t('Booking')}
            </Text>
          </Button>
        ) : (
          <Button
            medium
            style={{
              marginTop: 35,
              marginHorizontal: 'auto',
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
              flex: 1,
            }}
            onPress={() => {
              submitTicket();
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 14,
              }}
            >
              {t('Booking')}
            </Text>
          </Button>
        )}
      </View>

      <View>
        <Modal
          isVisible={modalSuccessVisible}
          style={{ height: '100%' }}
          // onBackdropPress={() => showModalSuccess(true)}>
          onBackdropPress={() => showModalSuccess(true)}
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
            {statusResult == false ? (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.primary,
                    marginBottom: 10,
                  }}
                >
                  {message}
                </Text>
                {/* <Text>{message}</Text> */}
                <IconAnt
                  name="checkcircleo"
                  size={80}
                  color={colors.primary}
                ></IconAnt>
                <Text> </Text>
                <Text>Result</Text>
                <Text>Schedule Success Booked on Ticket</Text>
                <Text bold>{messageResult}</Text>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'salmon',
                    marginBottom: 10,
                  }}
                >
                  {message}
                </Text>
                {/* <Text>{message}</Text> */}
                <IconAnt
                  name="closecircleo"
                  size={80}
                  color={'salmon'}
                ></IconAnt>
                <Text> </Text>
                <Text bold>{messageResult}</Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Button
                style={{
                  marginTop: 10,
                  // marginBottom: 10,

                  width: 70,
                  height: 40,
                }}
                onPress={() => {
                  onCloseModal();
                }}
              >
                <Text style={{ fontSize: 13, color: '#FFF' }}>{t('OK')}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
