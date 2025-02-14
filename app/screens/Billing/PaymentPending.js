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
import { useDispatch, useSelector } from 'react-redux';
import { BlockLine } from '@components';
import dummypaymentChannel from './dummy_paymentchannel.json';
import getUnitUser from '../../selectors/UnitUserSelector';

const PaymentPending = ({ route }) => {
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

  const [loading, setLoading] = useState(true);
  const [urlPayment, setUrlPayment] = useState('');
  const fetchPayment = dummypaymentChannel.data;
  const [paymentChannel, setPaymentChannel] = useState([]);
  const [choosedPaymentChannel, setChoosedPaymentChannel] = useState(null);
  const unitUser = useSelector((state) => getUnitUser(state));

  console.log('unitUser', unitUser);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={'Payment Pending'}
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
        <Text>{unitUser.lot_no}</Text>
        <View
          style={{
            padding: 15,
            marginVertical: 8,
            borderRadius: 5,

            //card
            backgroundColor: colors.background, //common
            borderRadius: 10, //common
            elevation: 3, // For Android shadow
            shadowColor: colors.text, // For iOS shadow
            shadowOffset: { width: 0, height: 1 }, // For iOS shadow
            shadowOpacity: 0.2, // For iOS shadow
            shadowRadius: 1.5, // For iOS shadow
            margin: 10, //common

            //overflow: "hidden",
          }}
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ alignSelf: 'start' }}>
              <Text style={{ fontSize: 12, color: colors.text }}>
                Invoice Invoice
              </Text>
              <Text style={{ fontSize: 12, color: colors.text }}>Payment</Text>
              <Text style={{ fontSize: 12, color: colors.text }}>Amount</Text>
              <Text style={{ fontSize: 12, color: colors.text }}>
                Processed by
              </Text>
            </View>
            <View style={{ alignSelf: 'start' }}>
              <Text style={{ fontSize: 12, color: colors.text }}>
                Invoice Invoice
              </Text>
              <Text style={{ fontSize: 12, color: colors.text }}>Payment</Text>
              <Text style={{ fontSize: 12, color: colors.text }}>Amount</Text>
              <Text style={{ fontSize: 12, color: colors.text }}>
                Processed by
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentPending;
