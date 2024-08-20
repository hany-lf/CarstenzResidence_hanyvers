import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  Text,
  NewsList,
  Header,
  Icon,
  Tag,
  colors,
  PlaceItem,
} from '@components';
import { BaseStyle, useTheme } from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import { useRoute } from '@react-navigation/core';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, View, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProductBlock } from '../../components';
import numFormat from '../../components/numFormat';
import List from '../../components/Product/List';
import styles from './styles';
import { enableExperimental } from '@utils';
import { API_URL_LOKAL } from '@env';
import getUser from '../../selectors/UserSelectors';
import { useSelector } from 'react-redux';

const Rent = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute();
  const [data, setData] = useState([]);
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setErrors] = useState(false);
  const user = useSelector((state) => getUser(state));
  const TABS = [
    {
      id: 1,
      title: t('Rent'),
    },
    {
      id: 2,
      title: t('Sale'),
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getDataRentUnit();
      getDataSaleUnit();
    }, 1000);
  }, [user]);

  const getDataSaleUnit = () => {
    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/rs/sale-unit/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };

    axios(config)
      .then(({ data }) => {
        console.log('sale -> data', data);
        setData(data.data);
        console.log('data >', data[0].images);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const getDataRentUnit = () => {
    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/rs/rent-unit/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.Token}`,
      },
    };

    axios(config)
      .then(({ data }) => {
        console.log('rent -> data', data.data);
        setRent(data.data);
        console.log('data >', data.data[0].images);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const goPost = (item) => () => {
    navigation.navigate('Post', { item: item });
  };
  const goProductDetail = (item) => {
    navigation.navigate('EProductDetail', { item: item });
  };
  const goPostDetail = (item) => () => {
    navigation.navigate('PostDetail', { item: item });
  };

  const goToCategory = () => {
    navigation.navigate('Category');
  };

  const renderContent = () => {
    const mainNews = PostListData[0];
    return (
      <SafeAreaView edges={['right', 'top', 'left']}>
        <Header
          title={t('Rent or Sale')}
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
        <ScrollView contentContainerStyle={styles.paddingSrollView}>
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
          <View style={{ flex: 1 }}>
            {tab.id == 1 && (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={styles.paddingFlatList}
                data={rent}
                keyExtractor={(item, index) => item.rowID}
                renderItem={({ item, index }) => (
                  <ProductBlock
                    key={index}
                    loading={loading}
                    adv_descs={item.adv_descs}
                    adv_title={item.adv_title}
                    style={{ marginVertical: 8 }}
                    // images={item.images[0].pict}
                    images={item.images}
                    avatar={item.avatar}
                    email={item.email}
                    qty_bathroom={item.qty_bathroom}
                    qty_bedroom={item.qty_bedroom}
                    nett={item.nett}
                    semi_gross={item.semi_gross}
                    agent_name={item.agent_name}
                    publish_date={moment(item.publish_date).format('H:mm:ss')}
                    // publish_date={moment(item.date_created).format("H:mm:ss")}
                    price_descs={item.price_descs}
                    onPress={() => goProductDetail(item)}
                    isFavorite={item.isFavorite}
                    salePercent={item.salePercent}
                    currency={item.currency}
                    price={item.price}
                  />
                )}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            {tab.id == 2 && (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={styles.paddingFlatList}
                data={data}
                keyExtractor={(item, index) => item.rowID}
                renderItem={({ item, index }) => (
                  <ProductBlock
                    key={index}
                    loading={loading}
                    description={item.description}
                    subject={item.subject}
                    style={{ marginVertical: 8 }}
                    // images={item.images[0].pict}
                    images={item.images}
                    avatar={item.avatar}
                    email={item.email}
                    advID={item.advID}
                    qty_bathroom={item.qty_bathroom}
                    qty_bedroom={item.qty_bedroom}
                    nett={item.nett}
                    semi_gross={item.semi_gross}
                    agent_name={item.agent_name}
                    publish_date={moment(item.publish_date).format('H:mm:ss')}
                    price_descs={item.price_descs}
                    onPress={() => goProductDetail(item)}
                    isFavorite={item.isFavorite}
                    salePercent={item.salePercent}
                    currency={item.currency}
                    price={item.price}
                  />
                )}
              />
            )}
          </View>
          {/* <FlatList
            scrollEnabled={false}
            contentContainerStyle={styles.paddingFlatList}
            data={data}
            renderItem={({item, index}) => (
              <ProductBlock
                loading={loading}
                description={item.description}
                subject={item.subject}
                style={{marginVertical: 8}}
                images={item.images[0].pict}
                avatar={item.avatar}
                email={item.email}
                qty_bathroom={item.qty_bathroom}
                qty_bedroom={item.qty_bedroom}
                nett={item.nett}
                semi_gross={item.semi_gross}
                agent_name={item.agent_name}
                publish_date={moment(item.publish_date).format('H:mm:ss')}
                price_descs={item.price_descs}
                onPress={() => goProductDetail(item)}
                isFavorite={item.isFavorite}
                salePercent={item.salePercent}
              />
            )}
          /> */}
        </ScrollView>
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

export default Rent;
