import {
  Text,
  Button,
  SafeAreaView,
  Header,
  Icon,
  CheckBox,
} from '@components';
import ListTransaction from '@components/List/Transaction';
import PropTypes from 'prop-types';
import React, { useState, Fragment, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import styles from './styles';
import { useTheme, BaseStyle, BaseColor } from '@config';
import numFormat from '@components/numFormat';
import { useNavigation, useRoute } from '@react-navigation/core';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import numFormattanpaRupiah from '@components/numFormattanpaRupiah';
import { API_URL_LOKAL } from '@env';
import getUser from '@selectors/UserSelectors';
import getProjectUser from '@selectors/ProjectUserSelector';
import getUnitUser from '@selectors/UnitUserSelector';
import { useDispatch, useSelector } from 'react-redux';
import { BlockLine } from '@components';
import dummypaymentChannel from './dummy_paymentchannel.json';
const DetailBilling = ({ route }) => {
  const { colors } = useTheme();
  const [params, setParams] = useState(route?.params);

  const navigation = useNavigation();
  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setErrors] = useState(false);
  const { t } = useTranslation();
  const [dataDetail, setDetailData] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const user = useSelector((state) => getUser(state));
  const projectUser = useSelector((state) => getProjectUser(state));
  const unitUser = useSelector((state) => getUnitUser(state));

  const [loading, setLoading] = useState(true);
  const [urlPayment, setUrlPayment] = useState('');
  const fetchPayment = dummypaymentChannel.data;
  const [paymentChannel, setPaymentChannel] = useState([]);
  const [choosedPaymentChannel, setChoosedPaymentChannel] = useState(null);

  const detailData = async () => {
    const entity_cd = projectUser.entity_cd;
    const project_no = projectUser.project_no;
    const debtor_acct = params.debtor_acct;
    const fin_month = params.fin_month;
    const fin_year = params.fin_year;
    try {
      const config = {
        method: 'get',
        url:
          API_URL_LOKAL +
          `/modules/billing/detail-history/${entity_cd}/${project_no}/${debtor_acct}/${fin_month}/${fin_year}`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.Token}`,
        },
      };
      const res = await axios(config);

      setDetailData(res.data.data);

      setLoading(false);
    } catch (error) {
      console.log('error detail blling -->', error.response);
      setErrors(error);
      // alert(hasError.toString());
    }
  };

  const getPaymentFinpay = async () => {
    // const url_dummy_pakubuwono_demo =
    //   'https://dev.ifca.co.id:4414/apiifcares/api';
    setLoading(true);

    try {
      const config = {
        method: 'get',
        url:
          API_URL_LOKAL +
          `/modules/billing/payment-channel?entity_cd=${projectUser.entity_cd}&project_no=${projectUser.project_no}`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.Token}`,
        },
      };
      const res = await axios(config);

      setPaymentChannel(res.data.data);

      // console.log('urlpayment finpay-->', res);
      setLoading(false);
    } catch (error) {
      console.log('error payment channel-->', error.response);
      setErrors(error);
      // alert(hasError.toString());
    }
  };

  const sumTotal =
    dataDetail != 0 || dataDetail != null || dataDetail.length > 0
      ? dataDetail.reduceRight((max, bills) => {
          // return (max += parseInt(bills.mbal_amt));
          return (max += parseInt(bills.trx_amt));
        }, 0)
      : null;
  const math_total = Math.floor(sumTotal);
  const replaceTotal = math_total
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  useEffect(() => {
    detailData();
    getPaymentFinpay();
    // setPaymentChannel(fetchPayment);
  }, []);

  const clickExpand = () => {
    setIsExpand(!isExpand);
  };

  const clickAttachment = () => {
    const params = {
      entity_cd: entity_cd,
      project_no: project_no,
      debtor_acct: debtor_acct,
      doc_no: doc_no,
      fin_month: fin_month,
      fin_year: fin_year,
    };
    // console.log('params for click attach', params);
    navigation.navigate('AttachmentBilling', params);
  };

  const onCloseModal = () => {
    showModalSuccess(false);
  };

  const handleProccessPayment = async (items) => {
    const itemsPayment = {
      entity_cd: items.entity_cd,
      project_no: items.project_no,
      member_id: user.userData.userID,
      member_name: user.userData.name,
      member_phone: user.userData.Handphone,
      email: user.userData.email,
      lot_no: unitUser.lot_no,
      doc_amt: math_total,
      sof: items.sof_id,
    };
    console.log('items payment', itemsPayment);

    try {
      const config = {
        method: 'post',
        url: API_URL_LOKAL + `/modules/billing/process-billing`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.Token}`,
        },
        data: itemsPayment,
      };
      const res = await axios(config);
      console.log('res proccess payment-->', res);
      if (res.data.success === true) {
        Linking.openURL(res.data.data.redirecturl);
      } else {
        setMessage(res.data.message);
        showModalSuccess(true);
      }
    } catch (error) {
      console.log('error proccess payment-->', error.response.data);
      if (error.response.data.success === false) {
        setMessage(error.response.data.message);
        showModalSuccess(true);
      }
      // console.log('error proccess payment-->', error.response);
      setErrors(error);
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={'Payment Detail'}
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

      <ScrollView>
        <View style={{ flex: 1, padding: 10 }}>
          {dataDetail?.map((item, key) => (
            <View key={key}>
              <Text
                subhead
                bold
                style={{ textAlign: 'center', marginBottom: 10 }}
              >
                {/* {'Invoice ' + route.params.dataDetail[0].doc_no} */}
                Invoice {item.fin_month} - {item.fin_year}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  //   width: '100%',
                  // paddingHorizontal: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
              >
                <View style={{ width: '50%' }}>
                  <Text subhead>{item.descs}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Rp. </Text>
                  <Text subhead>
                    {numFormattanpaRupiah(item.trx_amt)}
                    {/* 100.000.000.00 */}
                  </Text>
                  {/* <Text subhead>{numFormat(item.mbal_amt)}</Text> */}
                </View>
              </View>
            </View>
          ))}
          <BlockLine />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              //   width: 400,
              // paddingHorizontal: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <View>
              <Text subhead bold style={{ fontSize: 14 }}>
                Total
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text subhead bold style={{ fontSize: 14 }}>
                Rp.{' '}
              </Text>
              <Text subhead bold style={{ fontSize: 14 }}>
                {replaceTotal}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={StyleSheet.flatten([
            {
              borderBottomWidth: 1,
              paddingBottom: 1,
              borderBottomColor: colors.border,
              //   borderBottomColor: 'blue',
              alignItems: 'center',
              justifyContent: 'center',
            },
            !isExpand && {
              borderBottomWidth: 1,
              paddingBottom: 1,
              borderBottomColor: colors.background,
              //   borderBottomColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ])}
        >
          <TouchableOpacity onPress={() => clickExpand()}>
            <View style={styles.boxPaymentChannel}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 14, color: BaseColor.whiteColor }}>
                  Select Payment Channel
                </Text>
                <Icon
                  name={isExpand ? 'angle-up' : 'angle-down'}
                  size={18}
                  color={BaseColor.whiteColor}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {isExpand && (
          <View
            style={StyleSheet.flatten([
              { paddingBottom: 20 },
              isExpand && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                marginTop: 15,
                marginHorizontal: 20,
              },
            ])}
          >
            <View
              style={[
                styles.contentCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {paymentChannel.map((item, key) => (
                <View key={key}>
                  <TouchableOpacity
                    onPress={() => setChoosedPaymentChannel(item)}
                  >
                    <CheckBox
                      title={item.sof_name}
                      checked={choosedPaymentChannel === item} // Ubah untuk memeriksa apakah item yang dipilih sama dengan yang ada
                      onPress={() =>
                        setChoosedPaymentChannel(
                          choosedPaymentChannel === item ? null : item,
                        )
                      } // Ubah untuk membatalkan pilihan jika sudah dipilih
                      style={{ justifyContent: 'space-between' }}
                      colorCheck={BaseColor.goldColor}
                      checkedIcon={'check-circle'}
                      uncheckedIcon={'circle'}
                      styleText={{
                        fontSize: 14,
                        color: BaseColor.primary,
                        paddingVertical: 8,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.boxPaymentChannel}
                onPress={
                  () => handleProccessPayment(choosedPaymentChannel)
                  // console.log('item payment chanel', choosedPaymentChannel)
                }
              >
                <Text style={{ color: BaseColor.whiteColor, fontSize: 14 }}>
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View>
        <Modal
          isVisible={modalSuccessVisible}
          style={{ height: '100%' }}
          onBackdropPress={() => showModalSuccess(false)}
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
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 10,
                }}
              >
                {'Ups, Failed!'}
              </Text>
              <Text>{message}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                style={{
                  marginTop: 10,
                  // marginBottom: 10,

                  width: 70,
                  height: 40,
                }}
                onPress={() => onCloseModal()}
              >
                <Text style={{ fontSize: 13, color: BaseColor.whiteColor }}>
                  {t('OK')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default DetailBilling;
