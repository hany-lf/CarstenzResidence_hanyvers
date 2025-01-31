import {
  FilterESort,
  ProductBlock,
  ProductGrid2,
  SafeAreaView,
  Tag,
  Header,
  Icon,
  Text,
  Button,
  CardBooking,
  FormCounterSelect,
} from '@components';
import CounterSelectCheckout from '@components/Form/CounterSelectCheckout';
import ProductList from './List';
import numFormat from '../../components/numFormat';
import { BaseColor, BaseStyle, useTheme } from '@config';
// Load sample data
import { EPostListData, ESortOption } from '@data';
import { useNavigation } from '@react-navigation/native';
import * as Utils from '@utils';
import { parseHexTransparency } from '@utils';
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { addItemToCart, updateCartItem } from '../../actions/cartActions';
import Checkout from './Checkout';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import styles from './styles';
import getProject from '../../selectors/ProjectSelector';
import getUser from '../../selectors/UserSelectors';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { ActivityIndicator, Divider } from 'react-native-paper';

import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox, Badge } from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';

import getCartData from '../../selectors/cartSelectors';
import { data_cart } from '../../actions/cartActions';
import numFormattanpaRupiah from '../../components/numFormattanpaRupiah';
import { API_URL_LOKAL } from '@env';
let timeoutChangeMode = null;

const initialLayout = { width: Dimensions.get('window').width };

const Product = (params) => {
  const [dataMember, setDataMember] = useState(params.params);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [modeView, setModeView] = useState('list');
  const [list, setList] = useState(EPostListData);
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(true);
  const user = useSelector((state) => getUser(state));
  // console.log('user for itemstore', user);

  const [dataItemStore, setItemStore] = useState([]);
  const [dataItemStoreFilter, setItemStoreFilter] = useState([]);
  const projectSelector = useSelector((state) => getProject(state));
  //   console.log('project selector di product', projectSelector);

  const [modalVisible, setModalVisible] = useState(false);

  const [dataBuy, setDataBuy] = useState([]);
  const [total, setTotal] = useState(0);
  const [qty, setQty] = useState(0);

  const [showAddQuantity, setShowAddQuantity] = useState(false);
  const [showButtonToCart, setButtonToCart] = useState(false);

  const [ArrayDataBuy, setArrayDataBuy] = useState([]);

  const [disableAddToCart, setDisableAddToCart] = useState(false);

  const cartSelector = useSelector((state) => getCartData(state));
  // console.log('cart selector item store', cartSelector.length);
  //   const {navigation, route} = props;
  // console.log('routes di product', dataMember);

  //testing
  const [tambahItem, setTambahItem] = useState(false);
  const [taxRatePerItem, setTaxRatePerItem] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalHarga, setTotals] = useState(0);
  const [ArrayDataCheckout, setArrayDataCheckout] = useState([]);
  const [trxRate, setTrxRate] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [valueCurrent, setValueCurrent] = useState(0);
  const [valueChangeQty, setValue] = useState(0);

  const getItemStore = () => {
    // const entity_cd = projectSelector.Data[0].entity_cd;
    const entity_cd = dataMember.entity_cd;
    // console.log('entity get item store', entity_cd);
    // const project_no = projectSelector.Data[0].project_no;
    const project_no = dataMember.project_no;
    const charges_type = dataMember.facility_type;

    axios
      .get(
        API_URL_LOKAL +
          `/modules/store/products?entity_cd=${entity_cd}&project_no=${project_no}&trx_class=H&charges_type=${charges_type}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.Token}`,
          },
        },
      )
      .then((res) => {
        console.log('res', res.data.data.length);
        console.log(res.data.success);
        if (res.data.success == true) {
          const datas = res.data;
          const arrLocation = datas.data;

          const qtyArrayItem = arrLocation.map((item) => {
            return {
              ...item,
              qty: 0,
            };
          });

          setItemStoreFilter(qtyArrayItem);
          setSpinner(false);
        } else {
          setSpinner(false);
        }

        const datas = res.data.data;
        const qtyArrayItem = datas.map((item) => {
          return {
            ...item,
            qty: 0,
          };
        });

        setItemStore(qtyArrayItem);
      })
      .catch((error) => {
        console.log('error get item store', error.response);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getItemStore();
      searchFilterFunction();
      setTotals(0); // ini di set supaya kalo refresh kembali ke 0 lagi total nya
      // setItemCart();
    }, 1000);
  }, []);

  const searchFilterFunction = (text) => {
    // console.log('text', text);
    // console.log('arrayholder', arrayholder);

    const newData = dataItemStore.filter((item) => {
      const itemData = `${item.descs.toUpperCase()}`;
      // console.log('item qty??', item.trx_qty);
      const textData = text;
      return itemData.indexOf(textData) > -1;
    });
    // console.log('new data', newData);
    setItemStoreFilter(newData);
    // console.log('dataItemStoreFilter??', dataItemStoreFilter);
  };

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  const renderList = () => {
    return spinner ? (
      <ActivityIndicator color={colors.primary} />
    ) : dataItemStore == '' || dataItemStore == null ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          paddingTop: '50%',
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
            source={require('@data/91191-404-notfound.json')}
            autoPlay
            style={{ width: 300, height: 300 }}
          />
        </View>
        <Text
          headline
          bold
          style={{
            color: parseHexTransparency(colors.text, 50),
          }}
        >
          Data Not Found
        </Text>
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <CardBooking
          loading={loading}
          description={t('total_price')}
          price={numFormattanpaRupiah(totalHarga)}
          secondDescription={'Tax included'}
          textButton={t('checkout')}
          //   // onPress={() => navigation.navigate('EShipping')}
          onPress={() =>
            totalHarga == 0 ? setShowAlert(true) : checkoutSave()
          }
          style={{ paddingTop: 0 }}
          // onPress={() => checkoutSave()}
        />
        <Divider style={{ marginTop: 10, marginBottom: 20 }} />
        <TextInput
          placeholder="Search"
          style={{
            color: '#555',
            fontSize: 14,
            borderColor: '#000',
            borderWidth: 0.5,
            borderRadius: 10,
            marginHorizontal: 20,
            height: 40,
            paddingLeft: 5,
          }}
          // onChangeText={this.handleSearch}
          onChangeText={(text) => searchFilterFunction(text.toUpperCase())}
          // onChangeText={text => onSearch(text)}
          autoCorrect={false}
        />

        <FlatList
          contentContainerStyle={{
            paddingVertical: 22,
            paddingBottom: 50,
            paddingHorizontal: 10,
          }}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={dataItemStoreFilter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Checkout
                loading={loading}
                style={{ marginTop: 10, flex: 1, marginLeft: 10 }}
                title={item.descs}
                description={item.remarks}
                // image={item.image}
                image={
                  // require('@assets/images/logo.png')

                  item.images != '' && item.images != null
                    ? { uri: item.images }
                    : require('@assets/images/logo.png')
                }
                //image di component checkoutnya sengaja di tutup, karena tidak pakai url uri
                salePrice={numFormattanpaRupiah(item.default_price)}
                // description={item.description}
                // secondDescription={item.tax_rate}
                onDelete={() =>
                  setDataListCheckout(
                    dataListCheckout.filter(
                      (dataListCheckout) =>
                        dataListCheckout.trx_code != item.trx_code,
                    ),
                  )
                }
                // onDelete={() => onDelete()}
                // onChange={total => console.log('total', total)}
                //   onChange={value => changeQty(value, item.unit_price, index, item)}
                // onChange={value =>
                //   changeQty(value, item.default_price, index, item)
                // }
                // CurrentValue={item.qty}
              />

              {/* <View style={{justifyContent: 'center'}}> */}
              <View
                style={[
                  styles.contentPicker,
                  {
                    backgroundColor: colors.background,
                    flexDirection: 'column',
                  },
                  // style,
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    changeQty(
                      valueChangeQty,
                      item.default_price,
                      index,
                      item,
                      'up',
                    )
                  }
                >
                  <Icon name="plus-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text title2 style={{ width: 'auto', textAlign: 'center' }}>
                  {item.qty}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    changeQty(
                      valueChangeQty,
                      item.default_price,
                      index,
                      item,
                      'down',
                    )
                  }
                >
                  <Icon
                    name="minus-circle"
                    size={24}
                    color={BaseColor.grayColor}
                  />
                </TouchableOpacity>
              </View>
              {/* </View> */}
            </View>
          )}
        />

        {/* ---- MODAL ALERT UNTUK SUKSES PAYMENT ---- */}
        <View>
          <Modal
            isVisible={showAlert}
            style={{ height: '100%' }}
            onBackdropPress={() => onCloseAlert()}
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
                  {'Alert'}
                </Text>
                <Text>You have to set the quantity</Text>
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
                  onPress={() => onCloseAlert()}
                >
                  <Text style={{ fontSize: 13, color: colors.whiteColor }}>
                    {t('OK')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
        {/* ---- CLOSE MODAL ALERT UNTUK SUKSES PAYMENT ---- */}
      </View>
    );
  };

  const changeQty = (value, unit_price, index, item, type) => {
    const arraytes = dataItemStoreFilter;

    const qtyCurrent = arraytes[index].qty;

    if (type == 'up') {
      // valueNew = qtyArrayItem + 1;
      arraytes[index].qty = qtyCurrent + 1;
      setItemStore(arraytes);
      setItemStoreFilter(arraytes);
      // this.setState({ type: true });
    } else {
      arraytes[index].qty = qtyCurrent - 1 > 0 ? qtyCurrent - 1 : 0;
      setItemStore(arraytes);
      setItemStoreFilter(arraytes);
    }

    setTambahItem(true);
    setTaxRatePerItem(item.tax_rate);

    // setTotal(value * unit_price);

    const totalAwal = item.qty * unit_price;

    // const totalAwal = value * parseFloat(unit_price).toFixed(2);
    const totalAwaldenganTax =
      totalAwal + item.qty * Math.round(unit_price * (item.tax_rate / 100));

    const taxSebelumdiJumlah = Math.round(
      (item.qty * unit_price) / item.tax_rate,
    );

    const dataCheckout = {
      totalHarga: item.qty * unit_price,

      quantity: item.qty,
      default_price: item.default_price,
      descs: item.descs,
      //   ...item,
      // ...dataMember,

      count_tax_rate_per_item: Math.round(
        item.qty * unit_price * (item.tax_rate / 100),
      ),
      total_harga_with_tax: totalAwaldenganTax,

      // ----- pengganti item
      trx_code: item.trx_code,

      unit_price: item.default_price,
      curr_cd: item.currency_cd, //ini dari api juga
      currency_rate: item.currency_cd, //ini dari api juga
      discountTotal: 0,
      discountPercent: 0,
      images: item.images,
      // ---- pengganti ...item

      tax_rate: item.tax_rate,

      indexToCart: index,
    };

    const arrayCart = [...ArrayDataCheckout, dataCheckout];

    const newArray = [
      ...new Map(arrayCart.map((item) => [item.trx_code, item])).values(),
    ];

    setArrayDataCheckout(newArray);

    const itemFortotal =
      ArrayDataCheckout.length == 0
        ? totalAwaldenganTax
        : newArray.reduce(
            (total, currentItem) =>
              (total = total + currentItem.total_harga_with_tax),
            0,
          );

    const itemFortax =
      ArrayDataCheckout.length == 0
        ? taxSebelumdiJumlah
        : newArray.reduce(
            (tax, currentItem) =>
              (tax = tax + currentItem.count_tax_rate_per_item),
            0,
          );

    // const total = newArray.reduce(
    //   (total, currentItem) =>
    //     (total = total + currentItem.total_harga_with_tax),
    //   0,
    // );

    const floatTotal =
      itemFortotal == 0 ? 0 : parseFloat(itemFortotal).toFixed(2);

    const floatTax = itemFortax == 0 ? 0 : parseFloat(itemFortax).toFixed(2);

    setTotalTax(floatTax);
    setTotals(floatTotal);
  };

  const checkoutSave = () => {
    const dataSplice = ArrayDataCheckout;

    // dataSplice.splice(0, 1);
    const indexOfObject = dataSplice.findIndex((object) => {
      return object.trx_qty === 0;
    });
    console.log(indexOfObject); // 👉️ 1

    if (indexOfObject == -1) {
      const formData = {
        entity_cd: dataMember.entity_cd, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        project_no: dataMember.project_no, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        facility_type: dataMember.facility_type,
        member_id: dataMember.member_id, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        member_name: dataMember.member_name, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        audit_user: dataMember.audit_user, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        tenant_no: dataMember.tenant_no,
        images: dataItemStore.images,
        datadetail: dataSplice, // dapet dari isi redux (ini yg nantinya ada kode item, qty, total, dll)
      };
      // console.log('formdata', formData);
      dispatch(data_cart(formData));
      navigation.navigate('DeliveryAndPayment', formData);
    } else {
      dataSplice.splice(indexOfObject, 1);

      // console.log(arr); // 👉️ [{id: 1}, {id: 5}]
      // console.log('remaining', dataSplice);
      const formData = {
        entity_cd: dataMember.entity_cd, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        project_no: dataMember.project_no, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        facility_type: dataMember.facility_type,
        member_id: dataMember.member_id, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        member_name: dataMember.member_name, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        audit_user: dataMember.audit_user, // sebenernya ini cukup ambil dari data array 0, karena termasuk member item yang sama disetiap array produk
        tenant_no: dataMember.tenant_no,
        images: dataItemStore.images,
        datadetail: dataSplice, // dapet dari isi redux (ini yg nantinya ada kode item, qty, total, dll)
      };
      // console.log('formdata', formData);
      dispatch(data_cart(formData));
      navigation.navigate('DeliveryAndPayment', formData);
    }
  };

  return (
    <ScrollView
      // stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <Fragment>{renderList()}</Fragment>
    </ScrollView>
  );
};

// const ProductCopy = (params) => {
//   console.log('params', params);
// };

export default function ItemStore({ route }) {
  const { colors } = useTheme();
  // console.log('routeee', route);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    // {key: 'feedback', title: 'Feedback'},
  ]);
  // console.log('rputes', routes);
  const renderScene = SceneMap({
    all: Product,
    // feedback: Product,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderIndicator={() => null}
      scrollEnabled
      style={[styles.tabbar, { backgroundColor: colors.background }]}
      tabStyle={styles.tab}
      activeColor={BaseColor.whiteColor}
      inactiveColor={colors.text}
      renderLabel={({ route, focused, color }) => (
        <Tag
          primary={true}
          style={{
            backgroundColor: focused ? colors.primary : colors.background,
          }}
          textStyle={{
            color: color,
          }}
        >
          {route.title}
        </Tag>
      )}
    />
  );

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={'Items Store'}
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

      <Product params={route.params} style={{ marginTop: 0 }} />

      {/* Kalo mau pake tab dibuka aja ini, tapi harus ada kondisi id / kode buat filter tab nya */}
      {/* <TabView
        scrollEnabled={true}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      /> */}
    </SafeAreaView>
  );
}
