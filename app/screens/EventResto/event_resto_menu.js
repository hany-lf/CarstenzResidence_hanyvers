import {
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  Text,
  Header,
  Icon,
  colors,
} from '@components';
import { BaseStyle, useTheme, BaseColor } from '@config';

import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NewsList, NotFound, CategoryGrid } from '../../components';
import List from '../../components/Product/List';
import styles from './styles';
import { CardReport01, CardReport08 } from '../../components';
import getProject from '../../selectors/ProjectSelector';
import getUser from '../../selectors/UserSelectors';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { API_URL_LOKAL } from '@env';

const EventRestoMenu = (props) => {
  const { navigation } = props;
  const { route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setErrors] = useState(false);
  const [dataItems, setdataItems] = useState([]);
  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const project = useSelector((state) => getProject(state));
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const user = useSelector((state) => getUser(state));

  const [eventresto, setEventRestaurant] = useState([]);
  const [eventrestoslice, setEventRestaurantSlice] = useState([]);
  const [loadeventresto, setLoadEventResto] = useState(true);
  const [imageEventResto, setImageEventResto] = useState([]);
  const [show, setShow] = useState(false);
  const [checkedEntity, setCheckedEntity] = useState(false);
  //   console.log('dataItems', dataItems);

  // --- useeffect untuk project
  useEffect(() => {
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
      //   console.log('data di project', project);
      setProjectData(project.data);
      setValueProject(projects);
      dataPromoClubFacilities();
      setShow(true);
    }
  }, [project]);

  useEffect(() => {
    if (entity_cd != null && project_no != null) {
      dataPromoClubFacilities();
    }
  }, [entity_cd, project_no]);

  //   useEffect(() => {
  //     dataPromoClubFacilities();

  //     setLoading(false);
  //   }, [user]);

  const handleClickProject = (item, index) => {
    // console.log('index', index);
    setValueProjectSelected(item.value);

    setIsFocus(!isFocus);
    setShowChooseProject(!showChooseProject);

    if (item.value != null) {
      //   console.log('value project selected', item.value);
      projectData.map((items, index) => {
        // console.log('items project data', items);
        if (items.project_no === item.value) {
          //   console.log('items choose project handle', items);
          //   console.log('index', index);
          // setProjectData(items);
          setCheckedEntity(true);
          // setShow(true);
          dataPromoClubFacilities();
          //   getTicketStatus(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  const dataPromoClubFacilities = async () => {
    if (entity_cd && project_no) {
      // Just to be extra safe
      const params = {
        entity_cd: entity_cd,
        project_no: project_no,
      };

      // Lakukan sesuatu dengan params

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
        params: { params },
      };
      //   console.log('config', config);

      await axios(config)
        .then((res) => {
          //   console.log('res promoclubfacilities', res.data.data);
          const datapromoclub = res.data.data;
          // console.log('data promo ada isinya ga', datapromoclub);

          const filterForEvent = datapromoclub
            .filter((item) => item.category == 'E') //event
            .map((items) => items);

          const filterForRestaurant = datapromoclub
            .filter((item) => item.category == 'R') //restauran
            .map((items) => items);

          // join data atau data gabungan all per 2 category

          const joinFilterDataEventRestaurant = [
            ...filterForEvent,
            ...filterForRestaurant,
          ];

          // slice data for image

          const slicedataeventresto = joinFilterDataEventRestaurant.slice(0, 6);

          const arrayImageEventResto = slicedataeventresto.map((item, key) => {
            return { url_image: item.url_image, key: key };
          });

          setImageEventResto(arrayImageEventResto);
          //   console.log('image event resto', arrayImageEventResto);
          setEventRestaurant(joinFilterDataEventRestaurant);

          // return res.data;
        })
        .catch((error) => {
          console.log('error get promo club facilities', error.response);
          // alert('error get');
        });
    }
  };

  const renderContent = () => {
    const mainNews = PostListData[0];
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { flex: 1 }]}
        edges={['right', 'top', 'left']}
      >
        <Header
          title={t('Event & Restaurant')}
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
          onPressRight={() => {
            // alert('test')
            // handleClickProject()
            setShowChooseProject(!showChooseProject);
            // navigation.navigate("ViewHistoryStatusTRO");
          }}
          renderRight={() => {
            return (
              <Icon
                name="sync-alt"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
        />
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
        {/* <ScrollView contentContainerStyle={styles.paddingSrollView}> */}
        {imageEventResto.length > 0 ? (
          <FlatList
            scrollEnabled={true}
            contentContainerStyle={styles.paddingFlatList}
            data={imageEventResto}
            numColumns={2}
            key={2}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <CategoryGrid
                onPress={() =>
                  navigation.navigate('PreviewImageHome', {
                    images: item.url_image,
                  })
                }
                // style={{paddingHorizontal: 5}}
                image={{ uri: item.url_image }}
                //   title={item.descs} //bisa aja dimunculin, tapi harus deskripsi / textnya betul
              ></CategoryGrid>
            )}
          />
        ) : loading ? (
          <View>
            <ActivityIndicator size="large" color="#37BEB7" />
          </View>
        ) : (
          <NotFound />
        )}
        {/* </ScrollView> */}
      </SafeAreaView>
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

export default EventRestoMenu;
