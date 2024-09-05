import {
  CategoryIcon,
  Header,
  Icon,
  SafeAreaView,
  TextInput,
  Text,
  Svg,
} from '@components';
import { BaseColor, BaseStyle, Typography, useTheme } from '@config';
//import { FCategoryData } from "@data";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View, Linking } from 'react-native';
import { API_URL_LOKAL } from '@env';
import getUser from '../../selectors/UserSelectors';
import { useSelector } from 'react-redux';
import { NavEmergency } from '../../components/Svg';
// import Svg, { Path, Circle } from 'react-native-svg';
// import { Svg } from '../../components';

const Emergency = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => getUser(state));

  async function fetchDataDue() {
    try {
      const config = {
        method: 'GET',
        url: API_URL_LOKAL + '/setting/emergency-contact',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.Token}`,
        },
        params: {},
      };
      const res = await axios(config);
      setData(res.data.data);
      console.log('data', data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }
  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchDataDue();
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchDataDue();
      setLoading(false);
    }, 500);
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <CategoryIcon
        loading={loading}
        style={{
          marginBottom: 10,
        }}
        title={item.contact_name}
        subtitle={item.contact_name}
        icon="phone"
        // color={item.color}
        onPress={() => Linking.openURL(`tel:${item.contact_no}`)}
      />
    );
  };

  const onChangeText = (text) => {
    setSearch(text);
    setData(
      text ? data.filter((item) => item.contact_name.includes(text)) : data,
    );
  };

  const renderContent = () => {
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        edges={['right', 'top', 'left']}
      >
        <Header
          title={t('Emergency Call')}
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
        {/* <View style={{paddingHorizontal: 20, marginVertical: 20}}>
          <TextInput
            style={[BaseStyle.textInput, Typography.body1]}
            onChangeText={onChangeText}
            autoCorrect={false}
            placeholder={t('search')}
            placeholderTextColor={BaseColor.grayColor}
            value={search}
            selectionColor={colors.primary}
            onSubmitEditing={() => {}}
          />
        </View> */}

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            marginVertical: 10,
          }}
          numColumns={1}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 5,

                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  marginRight: 10,
                }}
              >
                <NavEmergency
                  width={30}
                  height={30}
                  fill={BaseColor.goldColor}
                />
              </View>
              <View>
                <Text style={{ fontSize: 14, color: colors.text }}>
                  {item.contact_name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.text }}>
                  {item.contact_no}
                </Text>
              </View>
            </View>
            // <CategoryIcon
            //   loading={loading}
            //   style={{
            //     marginBottom: 10,
            //   }}
            //   title={item.contact_name}
            //   subtitle={item.contact_no}
            //   icon={() => (
            //     <NavEmergency
            //       width={20}
            //       height={20}
            //       fill={BaseColor.goldColor}
            //     />
            //   )}
            //   // color={item.color}
            //   onPress={() => Linking.openURL(`tel:${item.contact_no}`)}
            // />
          )}
        />
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Emergency;
