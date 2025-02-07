import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  Text,
  Header,
  Icon,
  colors,
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
import {
  FlatList,
  ScrollView,
  View,
  ActivityIndicator,
  Animated,
  ImageBackground,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  NewsList,
  NotFound,
  ProductGrid1,
  ProductGrid2,
} from '../../components';
import List from '../../components/Product/List';
import styles from './styles';
import LottieView from 'lottie-react-native';
import getProject from '../../selectors/ProjectSelector';
import { useSelector, useDispatch } from 'react-redux';
import { CheckBox, Badge } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import getUser from '../../selectors/UserSelectors';
import { API_URL_LOKAL } from '@env';
import { parseHexTransparency } from '@utils';

const Store = (props) => {
  // const {navigation} = props;
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(true);
  const [hasError, setErrors] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const project = useSelector((state) => getProject(state));
  const user = useSelector((state) => getUser(state));
  // console.log('project selector', project);
  // console.log('user selector', user);

  const [defaulTower, setDefaultTower] = useState(false);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [showChooseProject, setShowChooseProject] = useState(false);
  const [show, setShow] = useState(false);

  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [email, setEmail] = useState('');
  const [db_profile, setDb_Profile] = useState('');

  const [defaultprojectName, setDefaultProjectName] = useState(true);
  const [textProjectName, setTextProjectName] = useState('');
  //   const [defaulTower, setDefaultTower] = projectSelector.length > 1 ? useState(false) : useState(true);
  // const [checkedEntity, setCheckedEntity] =
  //   projectSelector.length > 1 ? useState(false) : useState(true);

  const [dataMember, setDataMember] = useState([]);
  const [memberID, setMemberID] = useState('');
  const [memberName, setMemberName] = useState('');
  const [tenantNo, setTenantNo] = useState('');
  const [lotNo, setLotNo] = useState('');
  const [defaultMemberID, setDefaultMemberID] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  // console.log('memberID', memberID);
  // console.log('lotNo', lotNo);
  // console.log('data >', data);

  // useEffect(() => {
  //   console.log('lengt project selector', projectSelector.Data.length);
  //   if (projectSelector.Data.length > 1) {
  //     setDefaultTower(false);
  //   } else {
  //     setDefaultTower(true);
  //     setSpinner(false);
  //     setCheckedEntity(true);
  //     setShow(true);
  //     setEntity(projectSelector.Data[0].entity_cd);
  //     setProjectNo(projectSelector.Data[0].project_no);
  //     setDb_Profile(projectSelector.Data[0].db_profile);
  //   }
  // }, []);

  // --- useeffect untuk project
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
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
        setCheckedEntity(true);
        setSpinner(false);
        setShow(true);
        // console.log('spinner after', spinner);
      }
    }, 3000);
  }, [project]);

  useEffect(() => {
    // console.log('entity_cd useEffect for menustore dan member', entity_cd);
    if (entity_cd != '' && project_no != '') {
      // console.log('ada entity dan ada project');
      getMenuStore();
      getMember();
    }
  }, [entity_cd, project_no]);

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : '');
  }, [email]);
  // --- useeffect untuk update email/name

  useEffect(() => {
    if (defaultprojectName == true) {
      setTextProjectName(project.data[0]);
    }
  }, []);

  const getMenuStore = () => {
    setSpinner(true);
    const entity = entity_cd;
    // console.log('entity for menu store', entity_cd);
    // console.log('project for menu store', project_no);
    const project = project_no;

    const config = {
      method: 'get',
      url: API_URL_LOKAL + `/modules/store/facility-type`,
      // url:
      //   'https://apps.pakubuwono-residence.com/apiwebpbi_train/api' +
      //   // `/modules/store/facility-type`,
      //   `/pos/factype`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
      params: {
        entity_cd: entity,
        project_no: project,
        member_id: memberID,
        // entity_cd: '01',
        // project_no: '01',
      },
    };
    axios(config)
      .then((res) => {
        const cekdata = res.data.data;
        const filterdata = cekdata
          .filter((item) => item.facility_type !== 'RS')
          .map((items) => items);
        // console.log('cek filter data menu store', filterdata);

        // Set data dan spinner berdasarkan kondisi
        setData(filterdata);
        setDataFetched(true); // Tandai bahwa data sudah diambil
        setSpinner(false); // Set spinner false setelah data di-set
      })
      .catch((error) => {
        console.error('Error fetching menu store:', error);
        setDataFetched(true); // Tandai bahwa data sudah diambil
        setSpinner(false); // Pastikan spinner dimatikan jika terjadi error
      });
  };

  const dummyData = {
    success: true,
    message: 'Success',
    data: [
      {
        member_id: '10021',
        member_name: 'Shinta',
        tenant_no: '10021',
        lot_no: 'F2621',
        card_no: null,
        email: 'haniyya.ulfah@ifca.co.id',
        hand_phone: '628972573500',
      },
      {
        member_id: '10022',
        member_name: 'Juliastuty',
        tenant_no: '10022',
        lot_no: 'F2622',
        card_no: null,
        email: 'haniyya.ulfah@ifca.co.id',
        hand_phone: '628972573500',
      },
    ],
  };

  const getMember = () => {
    const entity = entity_cd;
    const project = project_no;
    const emails = email;

    const config = {
      method: 'GET',
      // url: API_URL_LOKAL + `/modules/store/member`,
      url:
        API_URL_LOKAL +
        `/modules/store/member-by-email` +
        `?entity_cd=${entity}&project_no=${project}&email=${emails}`,

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
      // params: {
      //   entity_cd: entity,
      //   project_no: project,
      //   email: emails,
      // },
    };

    axios(config)
      .then((res) => {
        const data = res.data.data;
        // const dataDummy = dummyData.data;
        // console.log('data length member', dataDummy.length);
        setDataMember(data);
        // setDataMember(dataDummy);
        // if (defaultMemberID == true) {
        //   // setTextLotno(resLotno[0]);
        //   setMemberID(res.data.data[0].member_id);
        //   setMemberName(res.data.data[0].member_name);
        //   setTenantNo(res.data.data[0].tenant_no);
        //   setLotNo(res.data.data[0].lot_no);
        // }
        if (data.length > 1) {
          setDefaultMemberID(false);
          setDataMember(data);
          // setMemberID(res.data.Data[0].member_id);
          // setMemberName(res.data.Data[0].member_name);
          // setTenantNo(res.data.Data[0].tenant_no);
        } else {
          setMemberID(res.data.data[0].member_id);
          setMemberName(res.data.data[0].member_name);
          setTenantNo(res.data.data[0].tenant_no);
          setLotNo(res.data.data[0].lot_no);
        }
        // setDataMember(res.data.Data);
      })
      .catch((error) => {
        console.log('error get member api', error.response);
        // alert('error get');
      });
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
          // getTicketStatus(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  const handleCheckChange = (index, data) => {
    console.log('klik handle change', index);
    setCheckedEntity(index);
    setShow(true);

    setEntity(data.entity_cd);
    setProjectNo(data.project_no);
    setDb_Profile(data.db_profile);
  };

  const onChangeprojectname = (data) => {
    setCheckedEntity(true);
    setShow(true);

    setEntity(data.entity_cd);
    setProjectNo(data.project_no);
    // setEntity('01');
    // setProjectNo('01');
    setDb_Profile(data.db_profile);
    setDefaultProjectName(false);
    console.log('projectname', data);
    setTextProjectName(data);
  };

  const onChangeMemberID = (data) => {
    // console.log('data member', data);
    setDefaultMemberID(false);
    setMemberID(data.member_id);
    setMemberName(data.member_name);
    setTenantNo(data.tenant_no);
    setLotNo(data.lot_no);

    //  setMemberID(res.data.data[0].member_id);
    //  setMemberName(res.data.data[0].member_name);
    //  setTenantNo(res.data.data[0].tenant_no);
    //  setLotNo(res.data.data[0].lot_no);
  };

  const toItemStore = (item) => {
    const dataForItemStore = {
      entity_cd: entity_cd,
      project_no: project_no,
      facility_type: item.facility_type,
      member_id: memberID,
      member_name: memberName,
      audit_user: user.name,
      tenant_no: tenantNo,
      lot_no: lotNo,

      // ...item,
    };
    console.log('for item store', dataForItemStore);
    navigation.navigate('ItemStore', dataForItemStore);
  };

  // cfs_user_project_customer where email login. memberID == business-ID di table tersebut
  //memberName mungkin join dari table atasnya
  const renderContent = () => {
    const mainNews = PostListData[0];
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Header
          title={t('Stores')}
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
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          // showsHorizontalScrollIndicator={false}
          // showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          style={{ zIndex: 10 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            {
              useNativeDriver: false,
            },
          )}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}
              onPress={() => navigation.navigate('RiwayatPesanan')}
              // onPress={() => navigation.navigate('FChooseFriend')}
            >
              <Text style={{ color: BaseColor.whiteColor, fontSize: 14 }}>
                Order History
              </Text>
            </TouchableOpacity>
          </View>

          {/* {spinner ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Text>halo</Text>
            </View>
          )} */}
          {/* CHOOSE PROJECT HERE */}
          {spinner == true ? (
            <View>
              <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
                <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
              </Placeholder>
            </View>
          ) : (
            <View
              style={{ marginTop: 10, marginBottom: 5, marginHorizontal: 10 }}
            >
              <Text style={{ color: '#3f3b38', fontSize: 14 }}>
                Choose Project
              </Text>
              <View
                style={{
                  paddingVertical: 5,
                }}
              >
                <ModalSelector
                  style={{ justifyContent: 'center' }}
                  childrenContainerStyle={{
                    color: '#CDB04A',
                    // alignSelf: 'center',
                    fontSize: 16,
                    // top: 10,
                    // flex: 1,
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontFamily: 'KaiseiHarunoUmi',
                  }}
                  data={project.data}
                  optionTextStyle={{ color: '#333' }}
                  selectedItemTextStyle={{ color: '#3C85F1' }}
                  accessible={true}
                  keyExtractor={(item) => item.project_descs}
                  // initValue={'ahlo'}
                  labelExtractor={(item) => item.project_descs} //khusus untuk lotno
                  cancelButtonAccessibilityLabel={'Cancel Button'}
                  cancelText={'Cancel'}
                  onChange={(option) => {
                    onChangeprojectname(option);
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',

                      paddingLeft: 10,
                      paddingVertical: 5,
                      backgroundColor: colors.primary,
                      justifyContent: 'space-between',
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontSize: 14,

                        // top: 10,
                        // flex: 1,
                        // justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                    >
                      {textProjectName.project_descs}
                    </Text>
                    <Icon
                      name="caret-down"
                      solid
                      size={27}
                      color={BaseColor.goldColor}
                      style={{ marginLeft: 10, marginRight: 10 }}
                      // color={'#CDB04A'}
                    />
                  </View>
                </ModalSelector>
              </View>
            </View>
          )}

          {/* CHOOSE MEMBER NAME  */}

          {spinner == true ? (
            <View>
              <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
                <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
              </Placeholder>
            </View>
          ) : (
            <View
              style={{
                marginTop: 5,
                marginBottom: 20,
                width: '100%',
                // flexDirection: 'row',
                // justifyContent: 'space-between',
              }}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={{ color: '#3f3b38', fontSize: 14 }}>
                  Member Name
                </Text>
                <ModalSelector
                  style={{ justifyContent: 'center' }}
                  childrenContainerStyle={{
                    color: '#CDB04A',
                    // alignSelf: 'center',
                    fontSize: 16,
                    // top: 10,
                    // flex: 1,
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontFamily: 'KaiseiHarunoUmi',
                  }}
                  data={dataMember}
                  optionTextStyle={{ color: '#333' }}
                  selectedItemTextStyle={{ color: '#3C85F1' }}
                  accessible={true}
                  keyExtractor={(item) => item.member_id}
                  // initValue={'ahlo'}
                  labelExtractor={(item) => item.member_name} //khusus untuk lotno
                  cancelButtonAccessibilityLabel={'Cancel Button'}
                  cancelText={'Cancel'}
                  onChange={(option) => {
                    onChangeMemberID(option);
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',

                      paddingLeft: 10,
                      paddingVertical: 5,
                      backgroundColor: colors.primary,
                      justifyContent: 'space-between',
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontSize: 14,

                        // top: 10,
                        // flex: 1,
                        // justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}
                    >
                      {memberName}
                    </Text>
                    <Icon
                      name="caret-down"
                      solid
                      size={27}
                      color={BaseColor.goldColor}
                      style={{ marginLeft: 10, marginRight: 10 }}
                      // color={'#CDB04A'}
                    />
                  </View>
                </ModalSelector>
                {/* <View
                  style={{
                    marginVertical: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      color: '#CDB04A',
                      // alignSelf: 'center',
                      marginLeft: 10,
                      fontSize: 12,
                      // flexWrap: 'wrap',
                      // flex: 1,
                      // width: '100%',
                      // top: 10,
                      // flex: 1,
                      // justifyContent: 'center',
                      fontWeight: '800',
                      fontFamily: 'KaiseiHarunoUmi',
                    }}
                  >
                    {memberName}
                  </Text>
                </View> */}
              </View>
            </View>
          )}

          {/* CLOSE CHOOSE PROJECT HERE */}

          {show && checkedEntity === true ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {data.map((item, index) => (
                <View key={index.toString()} style={{ width: '50%' }}>
                  <TouchableOpacity
                    style={{
                      marginVertical: 30,
                      width: '100%',
                      alignItems: 'center',
                      paddingRight: index % 2 == 0 ? 1 : 0,
                      paddingLeft: index % 2 != 0 ? 1 : 0,

                      marginBottom: 20,
                      // borderColor: '#000',
                      // borderWidth: 1,
                    }}
                    onPress={() => toItemStore(item)}
                  >
                    <ImageBackground
                      source={
                        item.images == '' || item.images == null
                          ? require('@assets/images/logo.png')
                          : {
                              uri: item.images,
                            }
                      }
                      style={styles.imageBackgroundGrid2}
                      imageStyle={{ borderRadius: 8 }}
                    ></ImageBackground>

                    <View>
                      <Text
                        subhead
                        numberOfLines={2}
                        style={{ marginTop: 10, marginLeft: 10 }}
                      >
                        {item.descs}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <ProductGrid2
                    style={{
                      width: '100%',
                      paddingRight: index % 2 == 0 ? 10 : 0,
                      paddingLeft: index % 2 != 0 ? 10 : 0,
                      marginBottom: 20,
                      borderColor: '#000',
                      borderWidth: 1,
                    }}
                    // description={item.description}
                    title={item.descs}
                    image={require('@assets/images/logo.png')}
                    // costPrice={item.costPrice}
                    // salePrice={item.salePrice}
                    // onPress={() => {}}
                    onPress={() => navigation.navigate('ItemStore', item)}
                    // onPress={() => console.log('items for store', item)}
                  /> */}
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
        {/* <NotFound /> */}
        {/* <View style={{flex: 1, padding: 15, paddingTop: 10}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          
            {data.map((item, index) => {
              return (
                <View key={index} style={{width: '50%', height: 200}}>
                  <ProductGrid1
                    key={index}
                    style={{
                      width: '100%',
                      paddingRight: index % 2 == 0 ? 10 : 0,
                      paddingLeft: index % 2 != 0 ? 10 : 0,
                    }}
                    // description={item.available}
                    title={item.descs}
                    // image={item.image}
                    // image={item.image}
                    image={require('@assets/images/logo.png')}
                    // costPrice={item.costPrice}
                    // salePrice={item.salePrice}
                    // isFavorite={item.isFavorite}
                    onPress={() => navigation.navigate('EProduct', item)}
                  />
                </View>
              );
            })}
          </View>
        </View> */}
      </SafeAreaView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {renderContent()} */}

      {spinner ? (
        <View>
          <Placeholder style={{ marginVertical: 4, paddingHorizontal: 10 }}>
            <PlaceholderLine width={100} noMargin style={{ height: 40 }} />
          </Placeholder>
        </View>
      ) : dataFetched ? ( // Periksa apakah data sudah diambil
        data.length > 0 ? (
          renderContent()
        ) : (
          <View style={{ flex: 1 }}>
            <Header
              title={t('Stores')}
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
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                // paddingTop: '50%',
              }}
            >
              <View>
                {/* <Icon
          name={'exclamation-triangle'}
          style={{
            fontSize: 32,
            color: parseHexTransparency(colors.text, 30),
          }}
        /> */}
                <LottieView
                  source={require('@data/comingsoon-lottie.json')}
                  autoPlay
                  style={{ width: 300, height: 300 }}
                />
              </View>
              <Text
                // headline
                bold
                style={{ color: BaseColor.primary }}
                // style={{
                //   color: parseHexTransparency(colors.text, 50),
                // }}
              >
                Store screen coming soon
              </Text>
            </View>
          </View>
        )
      ) : null}
      {/* Jangan tampilkan apa pun jika spinner masih aktif */}
    </View>
  );
};

export default Store;
