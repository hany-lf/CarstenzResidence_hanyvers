import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  CardReport06,
  News43,
  Price2Col,
  Icon,
  PlaceholderLine,
  Placeholder,
  NewsList,
  SafeAreaView,
  Text,
  Button,
  Transaction2Col,
  SearchInput,
  TextInput,
  Preview,
  FlatListSlider,
  FlexWrapLayout,
} from '@components';
import {
  BaseColor,
  BaseStyle,
  useTheme,
  Typography,
  FontWeight,
} from '@config';
import Fonts from '../../config/Fonts';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  Animated,
  ImageBackground,
  RefreshControl,
  Dimensions,
  Pressable,
  PixelRatio,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { useSelector, useDispatch } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import HeaderCard from './HeaderCard';
import HeaderHome from './HeaderHome';
import styles from './styles';
import Swiper from 'react-native-swiper';
import Categories from './Categories';
import SliderNews from './SliderNews';
import axios from 'axios';
import * as Utils from '@utils';
import numFormat from '../../components/numFormat';

import { notifikasi_nbadge, actionTypes } from '../../actions/NotifActions';
import getNotifRed from '../../selectors/NotifSelectors';
import getProject from '../../selectors/ProjectSelector';
import getMenu from '../../selectors/MenuSelectors';
import { get_menu_actions } from '../../actions/MenuActions';
import { data_project } from '../../actions/ProjectActions';
import messaging from '@react-native-firebase/messaging';
import apiCall from '../../config/ApiActionCreator';
// import {TextInput} from '../../components';

import LinearGradient from 'react-native-linear-gradient';
import ModalSelector from 'react-native-modal-selector';

import MasonryList from '@react-native-seoul/masonry-list';
import { ActivityIndicator } from 'react-native-paper';
import { Platform } from 'react-native';

import Modal from 'react-native-modal';
import { color } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

import { fontPixel, pixelSizeVertical } from './normalize';
// import { MenuBar } from '../../components/Svg';
import AlertSvg from '../../components/Svg/home/eye.svg'; // Mengimpor SVG sebagai komponen
import { Alert2 } from '../../components/Svg';

import { API_URL_LOKAL } from '@env';
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Home = (props) => {
  // console.log('hah ini api url dari env??', API_URL_LOKAL);

  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [topics, setTopics] = useState(HomeTopicData);
  const [channels, setChannels] = useState(HomeChannelData);
  const [popular, setPopular] = useState(HomePopularData);
  const [list, setList] = useState(HomeListData);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => getUser(state));
  const notif = useSelector((state) => getNotifRed(state));
  const project = useSelector((state) => getProject(state));
  const dataMenus = useSelector((state) => getMenu(state));
  console.log('project dari useselector', project);
  // console.log('dataMenus', dataMenus);
  // console.log(
  //   "99 state",
  //   useSelector((state) => state)
  // );
  // const email = user.user;
  const [email, setEmail] = useState('');
  // console.log('usr di home', user);
  // console.log('pict user', user.userData.pict)
  // const [fotoprofil, setFotoProfil] = useState(
  //   user != null && user.userData != null
  //     ? { uri: user.userData.pict }
  //     : { uri: `https://dev.ifca.co.id/no-image.png` },
  // );
  const [fotoprofil, setFotoProfil] = useState('');
  // console.log('fotoprofil cek home', fotoprofil);
  const [name, setName] = useState('');
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [getDataNotDue, setDataNotDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);

  const [getDataHistory, setDataHistory] = useState([]);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  // const [entity_cd, setEntity] = useState(project.Data[0].entity_cd);
  // const [project_no, setProjectNo] = useState(project.Data[0].project_no);
  const [lotno, setLotno] = useState([]);
  // console.log('lotno array 0', lotno.lot_no);
  // console.log('fotoprofil >', fotoprofil);
  const repl =
    user != null && user.userData != null
      ? fotoprofil.uri
      : `https://dev.ifca.co.id/no-image.png`;
  // console.log("repll", repl);
  const [text_lotno, setTextLotno] = useState();
  const [default_text_lotno, setDefaultLotno] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [newsannounce, setNewsAnnounce] = useState([]);
  const [newsannounceslice, setNewsAnnounceSlice] = useState([]);
  const [loadNewsAnnounce, setLoadNews] = useState(true);

  const [promoclubfac, setPromoClubFac] = useState([]);
  const [promoclubfacslice, setPromoClubFacSlice] = useState([]);
  const [loadpromoclubAnnounce, setLoadPromoClub] = useState(true);
  const [imagePromoClubFac, setImagePromoClubFac] = useState([]);

  const [eventresto, setEventRestaurant] = useState([]);
  const [eventrestoslice, setEventRestaurantSlice] = useState([]);
  const [loadeventresto, setLoadEventResto] = useState(true);
  const [imageEventResto, setImageEventResto] = useState([]);

  const [statusUser, setStatusUser] = useState('');
  const [modalImage, setModalImage] = useState(false);
  const [imageGreetings, setImageGreetings] = useState([]);
  const [modalShowImage, setmodalShowImage] = useState(false);
  const [urlImageGreetings, setUrlGreetingsImage] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [headerImage, setHeaderImage] = useState([]);

  const [loadMenu, setLoadMenu] = useState(true);

  const dispatch = useDispatch();

  // --- useeffect untuk project
  useEffect(() => {
    console.log('project useeffect', project);

    if (project && project.data && project.data.length > 0) {
      console.log('project di home', project);
      console.log('entity useeffect di home', project.data[0].entity_cd);
      setEntity(project.data[0].entity_cd);
      setProjectNo(project.data[0].project_no);
      // getLotNo();
      // // notifUser();
      // dataNewsAnnounce();
      // dataPromoClubFacilities();
    }
  }, [project]);

  useEffect(() => {
    console.log('entity_cd useeffect', entity_cd);
    console.log('project_no useeffect', project_no);
    if (entity_cd != null && project_no != null) {
      getLotNo();
      // notifUser();
      dataNewsAnnounce();
      dataPromoClubFacilities();
    }
  }, [entity_cd, project_no]);
  // --- useeffect untuk project

  // --- useEffect untuk update email/name
  useEffect(() => {
    if (user != null && user.userData != null) {
      setName(user.userData.name); // Update name hanya ketika user data berubah
      setEmail(user.userData.email);
      dispatch(
        data_project({
          email: user.userData.email,
          token_firebase: user.Token,
        }),
      );
      dispatch(
        get_menu_actions({
          token_firebase: user.Token,
          group_cd: user.userData.Group_Cd,
        }),
      );
    }
  }, [dispatch, user]); // Dependensi hanya pada user

  useFocusEffect(
    useCallback(() => {
      if (user?.userData && user.userData.Group_Cd && user.Token) {
        console.log('useFocusEffect triggered');
        console.log('user di home focus', user);
        console.log('userData di home focus', user.userData);

        // if (user && user.userData) {
        //   console.log('User data:', user.userData);
        dispatch(
          get_menu_actions({
            token_firebase: user.Token,
            group_cd: user.userData.Group_Cd,
          }),
        );
        // }

        dispatch(
          apiCall(API_URL_LOKAL + `/setting/notification`, {
            token_firebase: user.Token,
            entity_cd: entity_cd,
            project_no: project_no,
            email: email,
          }),
        );

        // dispatch(
        //   notifikasi_nbadge({
        //     email: email,
        //     entity_cd: entity_cd,
        //     project_no: project_no,
        //   }),
        // );

        console.log('Profile screen is focused');
        if (
          user != null &&
          user.userData != null &&
          user.userData.pict != null
        ) {
          setFotoProfil(user.userData.pict);
        } else {
          setFotoProfil('https://dev.ifca.co.id/no-image.png');
        }

        // setLoadMenu(true);
      } else {
        console.warn('Data user belum lengkap, menunggu user data');
        // setLoadMenu(false);
        // Mungkin tampilkan loader atau coba panggil ulang API jika perlu
      }
    }, [user, dispatch]),
  );
  // --- useeffect untuk update image pict

  // --- onrefresh ini berfungsi jika ketika ditarik reload, maka update dispatch(ambil data terbaru) menu dari database
  const onRefresh = useCallback(() => {
    if (user?.userData && user.userData.Group_Cd && user.Token) {
      setRefreshing(true);
      console.log('ini refresh on di home', user.userData);
      // if (user && user.userData) {
      //     console.log('user di home refresh', user),
      //     console.log('userData di home refresh', user.userData),
      dispatch(
        get_menu_actions({
          token_firebase: user.Token,
          group_cd: user.userData.Group_Cd,
        }),
      );
      // dispatch(
      //   notifikasi_nbadge({
      //     token_firebase: user.Token,
      //     email: email,
      //     entity_cd: entity_cd,
      //     project_no: project_no,
      //   }),
      // );
      dispatch(
        data_project({
          emails: user.userData.email,
          token_firebase: user.Token,
        }),
      );
      getHeaderImage();
      //    .then(() => setRefreshing(false));  // Ensure refreshing ends after data is fetched
      // }
      // dataPromoClubFacilities();
      wait(5000).then(() => {
        setRefreshing(false);
      });
    } else {
      console.warn('Data user belum lengkap, menunggu user data');
      // setLoadMenu(false);
      // Mungkin tampilkan loader atau coba panggil ulang API jika perlu
    }
  }, [user, dispatch]);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Notification', remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          navigation.navigate('Notification', remoteMessage);
        }
        setLoading(false);
      });
  }, []);

  //untuk load badge notif PENTING DAN HARUS ADA SCRIPT DISPATCH INI
  useEffect(() => {
    dispatch(
      apiCall(API_URL_LOKAL + `/setting/notification`, {
        token_firebase: user.Token,
        entity_cd: entity_cd,
        project_no: project_no,
        email: email,
      }),
    );
  }, [user, entity_cd, project_no, email]);

  // untuk load menu pertama kali dan harus ada script ini
  // useEffect(() => {
  //   if (user.length > 0) {
  //     // Tambahkan pengecekan untuk memastikan user tidak null
  //     dispatch(
  //       get_menu_actions({
  //         token_firebase: user.Token,
  //         group_cd: user.userData.Group_Cd,
  //       }),
  //     );
  //   }
  // }, [user]);

  //untuk load data get chairman message
  // (sebenernya terpakai hanya sekali, saat open screen pertama kali.
  // jika tidak dibatasi dengan akhir[] maka akan menimbulkan load limit.
  // tidak error parah, cuma mengganggu saja)

  const doSomething = async () => {
    // console.log(
    //   'url greetings chairman',
    //   `http://apps.pakubuwono-residence.com/apiwebpbi/api/first_login_Get/` + email,
    // );
    const config = {
      timeout: 5000, // default is `0` (no timeout)
      method: 'get',
      url: API_URL_LOKAL + `/home/greetings`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    await axios(config)
      .then((res) => {
        console.log('res greetings', res.data.data);
        const status_user = res.data.data[0].status;
        // console.log('status user new old', status_user);
        setStatusUser(status_user);

        if (status_user == 'Y') {
          setModalImage(false); // sementara di jadiin false dulu, untuk hide modal.
          getImageGreetings();
        } else {
          setModalImage(false);
        }
        setLoadNews(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('error res greeting', error.response);
        // alert('error get');
      });
  };

  useEffect(() => {
    // doSomething();
    getHeaderImage();
  }, []);

  const getHeaderImage = async () => {
    setSpinner(true);
    const config = {
      method: 'get',
      url: API_URL_LOKAL + `/home/common-mobile-header`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    await axios(config)
      .then((res) => {
        console.log('res header image', res.data.data);
        setHeaderImage(res.data.data);
        // setArrDataTowerUser;
      })
      .catch((error) => {
        console.log('error res header image', error.response);
        setSpinner(false);
      });
  };

  const getImageGreetings = async () => {
    const config = {
      timeout: 5000, // default is `0` (no timeout)
      method: 'get',
      url: API_URL_LOKAL + `/home/greetings`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    // console.log(
    //   'url greetings chairman',
    //   `http://apps.pakubuwono-residence.com/apiwebpbi/api/first_login_Get/` + email,
    // );
    await axios(config)
      .then((res) => {
        // console.log('res greetings', res.data.data);
        const image_greetings = res.data.data;
        // console.log('image_greetings', image_greetings);
        setImageGreetings(image_greetings);
        setLoadNews(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('error res image greeting', error);
        // alert('error get');
      });
  };

  const pressChairmanMessage = async () => {
    //sementara ditutup dulu prosesnya update status dan tanggalnya
    // setModalImage(false);

    await axios
      .post(API_URL_LOKAL + `/home/greetings-change-status/` + email)
      .then((res) => {
        console.log('res update tanggal greetings', res.data.data);
        // console.log('status user new old', status_user);
        setModalImage(false);
        setLoadNews(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('error update tanggal greetings', error);
        // alert('error get');
      });

    //setelah itu jalanin disini update data status jadi Old dan tanggal first_logindate today where email
  };

  const previewZoomGreeting = (item) => {
    // navigation.navigate('PreviewImageHome', {images: item});
    // navigation.navigate('PinchZoom');
    setUrlGreetingsImage(item);
    setmodalShowImage(true);
  };

  //https://dev.ifca.co.id/apiifcares/api/facility/book/unit?entity=01&project=01&email=martin7id@yahoo.com
  // https://dev.ifca.co.id/apicarstensz/api/facility/book/unit?entity=01&project=01&email=martin7id@yahoo.com

  async function getLotNo() {
    // console.log('email getlotno', email);
    console.log('entitycode getlotno', entity_cd);
    // console.log('projectno getlotno', project_no);

    const params = {
      entity_cd: entity_cd,
      project_no: project_no,
      email: email,
    };
    console.log('params getlotno', params);
    const config = {
      timeout: 5000, // default is `0` (no timeout)
      method: 'get',
      // url: 'http://dev.ifca.co.id:8080/apiciputra/api/approval/groupMenu?approval_user=MGR',
      url: API_URL_LOKAL + `/home/common-unit`,
      // url: API_URL_LOKAL + `/home/common-unit` ,
      headers: {
        'content-type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${user.Token}`,
      },
      // params: {approval_user: user.userIDToken.UserId},
      params: params,
    };

    try {
      await axios(config)
        .then((res) => {
          const resLotno = res.data.data;
          console.log('reslotno', resLotno);
          // console.log("reslotno", res);
          // console.log('default_text_lotno', default_text_lotno);
          if (default_text_lotno === true) {
            // console.log('ini kena gaksih?', res.data.data[0]);
            setTextLotno(res.data.data[0]);
          }
          setLotno(resLotno);

          // if (default_text_lotno === true) {
          //   console.log('ini kena gaksih?', default_text_lotno);
          //     if (default_text_lotno == true) {
          //       setTextLotno(resLotno[0]);
          //     }
          // }

          setSpinner(false);
        })
        .catch((error) => {
          console.log('error reslotno', error.response);
          // alert('error get');
        });
    } catch (error) {
      console.log('error get lotno', error.response);
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  // const notifUser = useCallback(
  //   (entity_cd, project_no, email) =>
  //     dispatch(notifikasi_nbadge(email, entity_cd, project_no)),
  //   [email, entity_cd, project_no, dispatch],
  // );

  // const dataImage = async () => {
  //   const config = {
  //     method: 'get',
  //     // url: 'http://dev.ifca.co.id:8080/apiciputra/api/approval/groupMenu?approval_user=MGR',
  //     url: API_URL_LOKAL + `/about/image`,
  //     headers: {
  //       'content-type': 'application/json',
  //       // 'X-Requested-With': 'XMLHttpRequest',
  //       Authorization: `Bearer ${user.Token}`,
  //     },
  //     // params: {approval_user: user.userIDToken.UserId},
  //     params: {},
  //   };

  //   await axios(config)
  //     .then((res) => {
  //       console.log("res image", res.data.data);
  //       // console.log('data images', res.data[0].images);
  //       setData(res.data.data);
  //       // return res.data;
  //     })
  //     .catch((error) => {
  //       console.log("error get about us image", error.response);
  //       // alert('error get');
  //     });
  // };

  async function fetchDataDue() {
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
      setDataDue(res.data.data);
      // console.log('data get data due', res.data.data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function fetchDataNotDue() {
    // console.log('email di home untuk fetchdatanotdue', email);
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
      setDataNotDue(res.data.data);
      // console.log('data get data not due', res.data.data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function fetchDataHistory() {
    // console.log('email di home untuk fetchdatahistory', email);
    const config = {
      method: 'get',
      url: API_URL_LOKAL + `/modules/billing/summary-history/${email}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };
    try {
      const res = await axios(config);
      setDataHistory(res.data.data);
      // console.log('data get history', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  const dataNewsAnnounce = async () => {
    const params = {
      entity_cd: entity_cd,
      project_no: project_no,
    };
    const config = {
      method: 'get',
      // url: 'http://dev.ifca.co.id:8080/apiciputra/api/approval/groupMenu?approval_user=MGR',
      url: API_URL_LOKAL + '/home/news',
      headers: {
        'content-type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${user.Token}`,
      },
      // params: {approval_user: user.userIDToken.UserId},
      params: params,
    };
    console.log('config news', config);
    await axios(config)
      .then((res) => {
        // console.log('res news', res.data.data);
        const datanews = res.data.data;
        const slicedatanews = datanews.slice(0, 6);
        // console.log("slice data", slicedatanews);
        setNewsAnnounceSlice(slicedatanews);
        setNewsAnnounce(datanews);
        setLoadNews(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('error get news announce home', error.response);
        // alert('error get');
      });
  };

  const dataPromoClubFacilities = async () => {
    const params = {
      entity_cd: entity_cd,
      project_no: project_no,
    };
    const config = {
      method: 'get',
      // url: 'http://dev.ifca.co.id:8080/apiciputra/api/approval/groupMenu?approval_user=MGR',
      url: API_URL_LOKAL + `/home/promo`,
      headers: {
        'content-type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${user.Token}`,
      },
      // params: {approval_user: user.userIDToken.UserId},
      params: params,
    };

    await axios(config)
      .then((res) => {
        // console.log("res promoclubfacilities", res.data.data);
        const datapromoclub = res.data.data;
        // console.log('data promo ada isinya ga', datapromoclub);

        // filter by category

        const filterForPromo = datapromoclub
          .filter((item) => item.category === 'P') //promo
          .map((items) => items);

        const filterForClub = datapromoclub
          .filter((item) => item.category === 'C') //club
          .map((items) => items);

        const filterForFacilities = datapromoclub
          .filter((item) => item.category === 'F') //facility
          .map((items) => items);

        const filterForEvent = datapromoclub
          .filter((item) => item.category == 'E') //event
          .map((items) => items);

        const filterForRestaurant = datapromoclub
          .filter((item) => item.category == 'R') //restauran
          .map((items) => items);

        // join data atau data gabungan all per 2 category

        const joinFilterDataPromoClubFac = [
          ...filterForPromo,
          ...filterForClub,
          ...filterForFacilities,
        ];

        const joinFilterDataEventRestaurant = [
          ...filterForEvent,
          ...filterForRestaurant,
        ];

        // slice data for image

        const slicedatapromoclubfac = joinFilterDataPromoClubFac.slice(0, 6);
        const slicedataeventresto = joinFilterDataEventRestaurant.slice(0, 6);

        // console.log('slicedataeventresto', slicedataeventresto);
        // console.log('slicedatapromoclubfac', slicedatapromoclubfac);

        // console.log('joinFilterDataPromoClubFac', joinFilterDataPromoClubFac);

        // pecah array images from data slice

        const arrayImagePromoClubFac = slicedatapromoclubfac.map(
          (item, key) => {
            // console.log('item promo club fac', item.url_image);
            return { url_image: item.url_image, key: key };
            // return { url_image: `${item.url_image}`.replace('http://localhost/', 'https://ifca.carstensz.co.id/') , key: key };
            // item.url_image
            // return {
            //   ...item.url_image,
            // };
          },
        );

        const arrayImageEventResto = slicedataeventresto.map((item, key) => {
          return { url_image: item.url_image, key: key };
        });

        // const slicedatapromo = datapromoclub.slice(0, 6);
        // console.log('slice data promo', arrayImagePromoClubFac);
        // console.log('image promo club', datapromoclub.image);

        // const tes = slicedatapromo.map((item, key) => {
        //   return {
        //     ...item.images[0],
        //   };
        // });
        // console.log('tes gambar map', tes);

        // console.log("image club fac", arrayImagePromoClubFac);

        setImagePromoClubFac(arrayImagePromoClubFac);
        setPromoClubFacSlice(slicedatapromoclubfac);
        setPromoClubFac(joinFilterDataPromoClubFac);

        setImageEventResto(arrayImageEventResto);
        setEventRestaurantSlice(slicedatapromoclubfac);
        setEventRestaurant(joinFilterDataEventRestaurant);

        setLoadNews(false);
        // return res.data;
      })
      .catch((error) => {
        console.log('error get promo club facilities', error.response);
        // alert('error get');
      });
  };

  const galery = [...data];

  //TOTAL DATE DUE
  const sum =
    getDataDue == 0
      ? 0
      : getDataDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  // console.log('sum', sum);

  //TOTAL DATE NOT DUE
  const sumNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : getDataNotDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  // console.log('sumNotDue', sumNotDue);

  const math_total = Math.floor(sumNotDue) + Math.floor(sum);
  // console.log('math total', math_total);

  const unique =
    getDataDue == 0 ? 0 : [...new Set(getDataDue.map((item) => item.doc_no))];
  // console.log('unique', unique);

  const uniqueNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : [...new Set(getDataNotDue.map((item) => item.doc_no))];
  // console.log('uniqueNotDue', uniqueNotDue);

  const invoice = unique == 0 ? 0 : unique.length;
  // console.log('invoice', invoice);

  const invoiceNotDue = uniqueNotDue == 0 ? 0 : uniqueNotDue.length;
  // console.log('invoiceNotDue', invoiceNotDue);

  const total_outstanding = Math.floor(invoice) + Math.floor(invoiceNotDue);
  // console.log('total_outstanding', total_outstanding);

  useEffect(() => {}, [dataMenus]);

  useEffect(() => {
    // console.log('galery', galery);

    // dataNewsAnnounce();
    // dataPromoClubFacilities();

    // console.log('datauser', user);
    // console.log('about', data);
    fetchDataDue();
    fetchDataNotDue();
    fetchDataHistory();

    // getLotNo();

    setLoading(false);

    if (user != null && user.userData != null && user.userData.pict != null) {
      setFotoProfil(user.userData.pict);
    } else {
      setFotoProfil('https://dev.ifca.co.id/no-image.png');
    }
    // console.log('User state updated: home', user);
  }, [user]);

  const goPostDetail = (item) => () => {
    navigation.navigate('PostDetail', { item: item });
  };

  const onChangeText = (text) => {
    setKeyword(text);
    // setCategory(
    //   text
    //     ? category.filter(item => item.title.includes(text))
    //     : CategoryData,
    // );
  };

  const onChangelot = (lot) => {
    setDefaultLotno(false);
    // console.log('lot', lot);
    setTextLotno(lot);
  };

  const goToMoreNewsAnnounce = (item) => {
    // console.log('item go to', item.length);
    // navigation.navigate('NewsAnnounce', { items: item });
  };

  const goToEventResto = (item) => {
    // console.log('item go to', item.length);
    navigation.navigate('EventResto', { items: item });
  };

  const goToPromoClubFac = (item) => {
    // console.log('item go to', item.length);
    navigation.navigate('ClubFacilities', { items: item });
  };

  const CardItem = ({ i, item }) => {
    // console.log('key card item', i);
    // console.log('item card', item);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PreviewImageHome', { images: item.url_image })
        }
      >
        <View key={i} style={([styles.shadow], {})}>
          <Image
            source={{ uri: item.url_image }}
            style={
              ([styles.shadow],
              {
                height: i % 2 ? 300 : 200,
                width: 200,
                margin: 5,
                borderRadius: 10,
                alignSelf: 'stretch',
              })
            }
            resizeMode={'cover'}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    // console.log('lot_no render', text_lotno);
    // if (!text_lotno) {
    //   return <ActivityIndicator />; // Gantikan dengan komponen loading atau pesan sementara lainnya
    // }

    return (
      <View
        style={[BaseStyle.safeAreaView, {}]}
        edges={['right', 'top', 'left']}
      >
        {user == null || user == '' ? (
          <Text>data user dihome null</Text>
        ) : // <HeaderHome />
        null}
        <View>
          <Modal
            isVisible={modalImage}
            animationType={'slide'}
            style={{ height: '100%', padding: 0, margin: 0 }}
            onBackdropPress={() => pressChairmanMessage()}
          >
            <View
              style={{
                // flex: 1,
                // backgroundColor: BaseColor.whiteColor,
                height: '90%',
                // backgroundColor: BaseColor.whiteColor,
                // borderRadius: 30,
                marginTop: '10%',
                // justifyContent: 'center',
              }}
            >
              {/* Button close X  */}
              <View
                style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}
              >
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                ></View>
                {/* <View
                  style={{
                    marginTop: 20,
                    justifyContent: 'space-between',
                    marginRight: 10,
                  }}>
                  <Pressable onPress={() => pressChairmanMessage()}>
                    <View style={{width: 30, height: 20}}>
                      <Icon name={'times'} size={20}></Icon>
                    </View>
                  </Pressable>
                </View>
              */}
              </View>
              {imageGreetings.map((item, index) => (
                <View
                  style={{
                    // flex: 1,
                    // position: 'absolute',
                    // top: 0,
                    height: '70%',
                    width: '100%',
                    backgroundColor: BaseColor.whiteColor,
                    borderRadius: 30,
                  }}
                  key={index}
                >
                  <ImageBackground
                    source={{
                      uri: item.greetings_file.replace('https', 'http'),
                    }}
                    // resizeMode="stretch"
                    // resizeMode="stretch"
                    // resizeMode="cover"
                    resizeMode="contain"
                    // source={require('@assets/images/ChairmanMessage.jpeg')}
                    style={{
                      // width: Dimensions.get('window').width,
                      marginLeft: '5%',
                      width: '95%',
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      // marginTop: 20,
                      // height: Dimensions.get('window').height,
                      // resizeMode: 'cover',
                      // justifyContent: 'center',
                      // paddingVertical: 10,
                    }}
                  ></ImageBackground>
                </View>
              ))}
            </View>
            <View
              style={{
                marginBottom: '10%',
                backgroundColor: BaseColor.whiteColor,
                paddingVertical: 20,
                // flex: 1,
                //     justifyContent: 'flex-end',
                //     marginBottom: 36,
              }}
            >
              {/* <Button style={{backgroundColor: colors.primary}}>
              </Button> */}
              {imageGreetings.map((item, index) => (
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'space-between',
                      flex: 1,
                      // backgroundColor: 'red',
                      // width: '50%',
                    }}
                  >
                    {/* <Text>halo</Text> */}
                    <Pressable
                      onPress={() =>
                        previewZoomGreeting(
                          item.greetings_file.replace('https', 'http'),
                        )
                      }
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            fontSize: 16,
                            color: colors.primary,
                          }}
                        >
                          Preview Zoom
                        </Text>
                        <Icon
                          name="search"
                          solid
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'space-between',
                      // marginRight: 10,
                      // flex: 1,
                      // backgroundColor: 'blue',
                      // width: '50%',
                    }}
                  >
                    <Pressable onPress={() => pressChairmanMessage()}>
                      <View
                        style={{
                          alignItems: 'center',
                          marginRight: 20,
                          flexDirection: 'row',
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            fontSize: 16,
                            color: colors.primary,
                          }}
                        >
                          Next
                        </Text>
                        <Icon
                          name="arrow-right"
                          solid
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </Modal>
        </View>
        {/* Close Modal Greeting Chairman  */}

        {/* Modal Show Image Greeting Chairman  */}
        <View>
          <Modal
            // style={{margin: 10, padding: 10}}
            isVisible={modalShowImage}
            onBackdropPress={() => setmodalShowImage(false)}
          >
            <View>
              {/* Button close X  */}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    // marginTop: 10,
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                ></View>
                <View
                  style={{
                    // marginTop: 10,
                    justifyContent: 'space-between',
                    // marginRight: 10,
                  }}
                >
                  <Pressable onPress={() => setmodalShowImage(false)}>
                    <View style={{ height: 25 }}>
                      <Icon name={'times'} size={20} color={'white'}></Icon>
                    </View>
                  </Pressable>
                </View>
              </View>
              <View
                style={{
                  // flex: 1,
                  // position: 'absolute',
                  // left: 0,
                  height: '90%',
                  // width: Dimensions.get('window').width,
                  width: '100%',
                  backgroundColor: BaseColor.whiteColor,
                  borderRadius: 30,
                }}
              >
                <ImageZoom
                  cropWidth={320}
                  cropHeight={570}
                  // cropWidth={100}
                  // cropHeight={100}
                  // imageWidth={325.5}
                  // imageHeight={360}
                  imageWidth={360}
                  imageHeight={360}
                >
                  <Image
                    // key={key}
                    style={{
                      width: '100%',
                      height: '100%',
                      marginLeft: 5,
                    }}
                    resizeMode="contain"
                    // resizeMode="stretch"
                    // resizeMode="cover"
                    // resizeMode="center"
                    source={{ uri: urlImageGreetings }}
                  />
                </ImageZoom>
              </View>
            </View>
          </Modal>
        </View>
        {/* Modal Show Image Greeting Chairman  */}

        <ScrollView
          // contentContainerStyle={styles.paddingSrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {spinner === false ? (
            headerImage.map((item, key) => {
              return (
                <ImageBackground
                  // source={require('../../assets/images/image-home/Main_Image.png')}
                  source={{ uri: item.img_url }}
                  style={{ height: 400 }} // Match the height of Swiper
                  imageStyle={{
                    flex: 1,

                    height: 400,
                    width: '100%',
                    // borderBottomLeftRadius: 175,
                    // borderBottomRightRadius: 175,
                  }}
                >
                  <LinearGradient
                    colors={['rgba(73, 73, 73, 0)', 'transparent']}
                    // colors={['#4c669f', '#3b5998', '#192f6a']}
                    // {...otherGradientProps}
                    style={{
                      height: 400,
                      // height: '85%',
                      width: '100%',

                      flexDirection: 'column',
                      // flex: 1,
                      justifyContent: 'center',
                      // top: 30,
                      // borderBottomLeftRadius: 200,
                      // borderBottomRightRadius: 200,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'center',
                        top: 0,
                      }}
                    >
                      <View style={{ alignItems: 'center', top: 0 }}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'DMSerifDisplay',
                            fontSize: 10,
                          }}
                        >
                          {/* Once Upon Your Lifetime */}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', top: 0 }}>
                        <Image
                          style={{
                            height: 100,
                            width: '80%',
                            //padding: 100,
                            resizeMode: 'contain',
                          }}
                          source={require('../../assets/images/image-home/vector-logo-carstensz.png')}
                        ></Image>
                      </View>

                      {/* ---- tagline carstensz */}
                      <View
                        style={{
                          // flex: 1,
                          alignItems: 'center',

                          left: 47,
                          justifyContent: 'center',

                          width: '80%',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'white',
                            fontFamily: Fonts.type.Zocial,
                            // lineHeight: 10,
                          }}
                        >
                          Iconic Living at BSD - Gading Serpong
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              );
            })
          ) : (
            <View>
              {/* <Spinner visible={this.state.spinner} /> */}
              <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
                <PlaceholderLine width={100} noMargin style={{ height: 100 }} />
              </Placeholder>
            </View>
          )}

          {/* ---- header image dan nama dan unit */}
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 35,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {/* ---sementara dulu  */}

            <Image
              // source={fotoprofil}
              source={{ uri: fotoprofil }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
              }}
            />

            <View style={{ alignSelf: 'center', marginLeft: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  // adjustsFontSizeToFit={true}
                  // allowFontScaling={true}
                  style={{
                    // fontSize: 18,s
                    fontSize: fontPixel(18),
                    paddingVertical: pixelSizeVertical(10),
                    // marginVertical: 3,
                    fontFamily: 'DMSerifDisplay',
                  }}
                >
                  {name}
                </Text>
                {/* <Text>{MenuBar}</Text> */}

                <Icon
                  name="star"
                  solid
                  size={18}
                  color={colors.primary}
                  style={{ marginHorizontal: 5 }}
                />
              </View>
              {/* <Text>{lotno.length}</Text> */}

              {lotno.length != 0 ? (
                <View
                  style={{
                    // backgroundColor: '#141F40',
                    backgroundColor: colors.primary,
                    height: 30,
                    // width: '100%',
                    width: 150,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                    <Text
                      adjustsFontSizeToFit={true}
                      allowFontScaling={true}
                      style={{
                        color: '#fff',
                        alignSelf: 'center',
                        fontSize: 14,
                        justifyContent: 'center',
                        paddingRight: 10,

                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                    >
                      Unit
                    </Text>

                    <ModalSelector
                      style={{ justifyContent: 'center', alignSelf: 'center' }}
                      childrenContainerStyle={{
                        color: '#141F40',
                        alignSelf: 'center',
                        fontSize: 16,
                        // top: 10,
                        // flex: 1,
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                      data={lotno}
                      optionTextStyle={{ color: '#333' }}
                      selectedItemTextStyle={{ color: '#141F40' }}
                      accessible={true}
                      keyExtractor={(item) => item.lot_no}
                      // initValue={'ahlo'}
                      labelExtractor={(item) => item.lot_no} //khusus untuk lotno
                      cancelButtonAccessibilityLabel={'Cancel Button'}
                      cancelText={'Cancel'}
                      onChange={(option) => {
                        onChangelot(option);
                      }}
                    >
                      <Text
                        style={{
                          color: '#CDB04A',
                          alignSelf: 'center',
                          fontSize: 16,
                          // top: 10,
                          // flex: 1,
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontFamily: 'KaiseiHarunoUmi',
                        }}
                      >
                        {/* {lotno.lot_no} */}
                        {text_lotno.lot_no}

                        {/* 12312 */}
                      </Text>
                    </ModalSelector>
                    <Icon
                      name="caret-down"
                      solid
                      size={26}
                      // color={colors.primary}
                      style={{ marginLeft: 5 }}
                      color={'#CDB04A'}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    height: 30,
                    // width: '100%',
                    width: 150,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                    <Text
                      style={{
                        color: '#fff',
                        alignSelf: 'center',
                        fontSize: 14,
                        justifyContent: 'center',
                        paddingRight: 10,

                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                    >
                      Unit
                    </Text>

                    <ModalSelector
                      style={{ justifyContent: 'center', alignSelf: 'center' }}
                      childrenContainerStyle={{
                        color: '#CDB04A',
                        alignSelf: 'center',
                        fontSize: 16,
                        // top: 10,
                        // flex: 1,
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                      data={lotno}
                      optionTextStyle={{ color: '#333' }}
                      selectedItemTextStyle={{ color: '#3C85F1' }}
                      accessible={true}
                      keyExtractor={(item) => item.lot_no}
                      // initValue={'ahlo'}
                      labelExtractor={(item) => item.lot_no} //khusus untuk lotno
                      cancelButtonAccessibilityLabel={'Cancel Button'}
                      cancelText={'Cancel'}
                      onChange={(option) => {
                        onChangelot(option);
                      }}
                    >
                      <Text
                        style={{
                          color: '#CDB04A',
                          alignSelf: 'center',
                          fontSize: 16,
                          // top: 10,
                          // flex: 1,
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontFamily: 'KaiseiHarunoUmi',
                        }}
                      >
                        {/* Lot No Available */}-
                      </Text>
                    </ModalSelector>
                    <Icon
                      name="caret-down"
                      solid
                      size={26}
                      // color={colors.primary}
                      style={{ marginLeft: 5 }}
                      color={'#CDB04A'}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          {/* ---- header image dan nama dan unit */}

          {/* --- menu dinamis kotak-kotak  */}
          <View style={styles.paddingContent}>
            {user == null || user == '' || user.userData == null ? (
              <Text>user not available</Text>
            ) : // dataMenus.map((item, index)=>(
            //   <Text key={index}>{item.Title}</Text>
            // ))
            dataMenus.length > 0 ? (
              <Categories style={{ marginTop: 10 }} dataMenus={dataMenus} />
            ) : (
              <ActivityIndicator />
            )}
          </View>
          {/* --- menu dinamis  */}

          {/* ----- content news ---- */}
          <View style={{ marginBottom: 10, flex: 1 }}>
            <View style={{ marginLeft: 30, marginTop: 20, marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}
              >
                Our Bulletin
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 20,
                }}
              >
                <Text>News</Text>
                {
                  newsannounce.length >= 6 ? (
                    <TouchableOpacity
                      onPress={() => goToMoreNewsAnnounce(newsannounce)}
                    >
                      <View
                        style={{
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ marginHorizontal: 5, fontSize: 14 }}>
                          More
                        </Text>
                        <Icon
                          name="arrow-right"
                          solid
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null
                  // <Text>kurang dari 6</Text>
                }
              </View>
            </View>
            <View style={{ marginVertical: 10, marginLeft: 20 }}>
              {loadNewsAnnounce ? (
                <ActivityIndicator />
              ) : (
                <SliderNews
                  data={newsannounceslice}
                  local={true}
                  // contentContainerStyle={{ paddingHorizontal: 16 }}
                  // onPress={console.log('klik')}
                />
              )}
            </View>
          </View>
          {/* ----- content news ----- */}

          {/* ---- content event promo resto----  */}
          <View style={{ marginBottom: 20, flex: 1 }}>
            <View style={{ marginLeft: 30, marginTop: 20, marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}
              >
                This Weekend
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 20,
                }}
              >
                <Text>Event And Restaurant</Text>
                {
                  eventresto.length >= 5 ? (
                    <TouchableOpacity
                      onPress={() => goToEventResto(eventresto)}
                    >
                      <View
                        style={{
                          alignSelf: 'center',
                          flexDirection: 'row',

                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            marginHorizontal: 5,
                            fontSize: 14,
                            alignItems: 'center',
                          }}
                        >
                          More
                        </Text>
                        <Icon
                          name="arrow-right"
                          solid
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null
                  // <Text>kurang dari 6</Text>
                }
              </View>
            </View>

            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
              <ScrollView horizontal>
                <MasonryList
                  data={imageEventResto}
                  // data={sliceArrEvent}
                  style={{ alignSelf: 'stretch' }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    alignSelf: 'stretch',
                    // alignSelf: 'flex-start',
                  }}
                  keyExtractor={(item, index) => index}
                  numColumns={3}
                  renderItem={CardItem}
                />
              </ScrollView>
            </View>
          </View>
          {/* ---- content event promo resto---- */}

          {/* ---- content facility club ----  */}
          <View style={{ marginBottom: 20, flex: 1 }}>
            <View style={{ marginLeft: 30, marginTop: 20, marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}
              >
                Club And Facilities
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 20,
                }}
              >
                <Text>Check Our Promo Here</Text>
                {
                  promoclubfac.length >= 3 ? (
                    <TouchableOpacity
                      onPress={() => goToPromoClubFac(promoclubfac)}
                    >
                      <View
                        style={{
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ marginHorizontal: 5, fontSize: 14 }}>
                          More
                        </Text>
                        <Icon
                          name="arrow-right"
                          solid
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null
                  // <Text>kurang dari 6</Text>
                }
              </View>
            </View>
            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
              <ScrollView horizontal>
                <FlatList
                  pagingEnabled={true}
                  decelerationRate="fast"
                  bounces={false}
                  data={imagePromoClubFac}
                  numColumns={3}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('PreviewImageHome', {
                          images: item.url_image,
                        })
                      }
                    >
                      <View key={item.rowID} style={{}}>
                        {/* <Text></Text> */}
                        <Image
                          source={{ uri: item.url_image }}
                          style={
                            ([styles.shadow],
                            {
                              height: 450,
                              margin: 5,
                              width: 250,
                              borderRadius: 10,
                            })
                          }
                          resizeMode={'cover'}
                        ></Image>
                      </View>
                    </TouchableOpacity>
                  )}
                  // keyExtractor={(item, index) => item.toString() + index}
                  keyExtractor={(item, index) => index}
                />
              </ScrollView>
            </View>
          </View>
          {/* ---- content facility club ---- */}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}
      >
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Home;
