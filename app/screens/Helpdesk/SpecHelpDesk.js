import {
  Text,
  TextInput,
  // CheckBox,
  PlaceholderLine,
  Placeholder,
  Button,
  SafeAreaView,
  Header,
  Icon,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { CheckBox } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import getProject from '../../selectors/ProjectSelector';
import axios from 'axios';
import client from '../../controllers/HttpClient';
import styles from './styles';

import ModalDropdown_debtor from '@components/ModalDropdown_debtor';
import ModalDropdown_lotno from '@components/ModalDropdown_lotno';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_LOKAL } from '@env';
import { Dropdown } from 'react-native-element-dropdown';

export default function SpecHelpDesk() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const users = useSelector((state) => getUser(state));
  const [email, setEmail] = useState(users.user);

  const [urlApi, seturlApi] = useState(client);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [dataDebtor, setDataDebtor] = useState([]);
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [db_profile, setDb_Profile] = useState('');
  const [spinner, setSpinner] = useState(true);

  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const project = useSelector((state) => getProject(state));

  const [debtor, setDebtor] = useState('');
  const [textDebtor, settextDebtor] = useState('');
  const [textNameDebtor, settextNameDebtor] = useState('');
  const [dataLotno, setDataLotno] = useState([]);
  const [textLot, setLotno] = useState('');
  const [reportName, setreportName] = useState(users.name);
  const [contactNo, setcontactNo] = useState('');
  const [requiredText, setrequiredText] = useState(false);
  const [textFloor, settextFloor] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [tenant_no, setTenantNo] = useState('');

  const [defaulTower, setDefaultTower] = useState(false);
  const [defaultDebtor, setDefaultDebtor] = useState(false);
  const [defaultLotNo, setDefaultLotNo] = useState(false);

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
        console.log('data di project', project);
        setProjectData(project.data);
        setValueProject(projects);
      }
      // getCategoryHelp;
      // setSpinner(false);
    }, 3000);
  }, [project]);

  // useEffect(() => {
  //   if (entity_cd && project_no) {
  //     // getLotNo();
  //     const params = {
  //       entity_cd: entity_cd,
  //       project_no: project_no,
  //     };
  //     getDebtor(params);
  //     // setShow(true);
  //   }
  // }, [entity_cd, project_no]);
  // --- useeffect untuk project

  // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(
      users != null && users.userData != null ? users.userData.email : '',
    );
  }, [email]);
  // --- useeffect untuk update email/name

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
          getDebtor(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  //-----FOR GET DEBTOR
  const getDebtor = async (data) => {
    // console.log(object)
    console.log('data for debtor', data);

    const formData = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      email: email,
    };

    console.log('data for', formData);

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/debtor',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    };
    await axios(config)
      .then((res) => {
        // console.log('res', res);
        const datas = res.data;
        const dataDebtors = datas.data;
        console.log('res debtor', dataDebtors);
        console.log('ada berapa length debtor', dataDebtors.length);

        if (dataDebtors.length > 1) {
          setDefaultDebtor(false);
        } else {
          setDefaultDebtor(true);
          setDebtor(dataDebtors[0].debtor_acct);
          setTenantNo(dataDebtors[0].tenant_no);
          settextDebtor(
            dataDebtors[0].debtor_acct + ' - ' + dataDebtors[0].name,
          );
          settextNameDebtor(dataDebtors[0].name);
          const params = {
            entity_cd: data.entity_cd,
            project_no: data.project_no,
            tenant_no: dataDebtors[0].tenant_no,
          };
          console.log('params for lotno default', params);

          // setCheckedEntity(true);

          getLot(params, '');
          setSpinner(false);
          // console.log('params for debtor tower default', params);
          // getDebtor(params);
        }

        setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch((error) => {
        console.log('error get tower api', error.response);
        // alert('error get');
      });
  };

  const handleChangeModal = ({ data, index }) => {
    console.log('index,', index);
    // console.log('data chjange', data);
    // data.data.map(dat => {
    //   console.log('data for text debtor', dat);
    //   if (dat) {

    setDebtor(index.debtor_acct);
    setTenantNo(index.tenant_no);
    settextDebtor(index.debtor_acct + ' - ' + index.name);
    settextNameDebtor(index.name);
    getLot('', index.tenant_no);
    //   }
    // });
    setSpinner(false);
  };

  const getLot = async (data, tenantno) => {
    console.log('tenant_no lot', data);
    const params = {
      entity_cd: entity_cd || data.entity_cd,
      project_no: project_no || data.project_no,
      email: email,
      tenant_no: tenantno || data.tenant_no,
    };

    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/lot-no',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: params,
    };

    console.log('url getlotno', API_URL_LOKAL + '/modules/cs/lot-no', params);

    await axios(config)
      .then((res) => {
        // console.log('datalotno', res);
        const datas = res.data;
        const dataLotno = datas.data;
        console.log('datalotno', dataLotno);

        console.log('ada berapa length debtor', dataLotno.length);
        // console.log(object)

        if (dataLotno.length > 1) {
          setDefaultLotNo(false);
        } else {
          setDefaultLotNo(true);
          setLotno(dataLotno[0].lot_no);
          // this.setState({textLot: lot});
          getFloor(dataLotno[0].lot_no);
          setSpinner(false);
          // console.log('params for debtor tower default', params);
          // getDebtor(params);
        }

        setDataLotno(dataLotno);

        // return res.data;
      })
      .catch((error) => {
        console.log('error get lotno api', error.response);
        // alert('error get');
      });
  };

  const handleLotChange = (lot) => {
    console.log('lot', lot);
    setLotno(lot);
    // this.setState({textLot: lot});
    getFloor(lot);
  };

  const getFloor = async (lot) => {
    console.log('lot getfloor', lot);

    const params = {
      lot_no: lot,
    };
    const config = {
      method: 'get',
      url: API_URL_LOKAL + '/modules/cs/floor',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${users.Token}`,
      },
      params: params,
    };

    await axios(config)
      .then((res) => {
        // console.log('res floor', res);
        const datas = res.data;

        const dataFloor = datas.data;

        settextFloor(dataFloor);

        // return res.data;
      })
      .catch((error) => {
        console.log('error get floor api', error.response);
        alert('error get');
      });
  };

  const handleNavigation = async () => {
    // try {
    console.log('textfloor spec help', textFloor);
    console.log('textlot spec help', textLot);
    console.log('reportName reportName', reportName);
    console.log('contactNo', contactNo);
    if (
      (!contactNo && !reportName && textLot.length < 0) ||
      textLot == '' ||
      textLot == null
    ) {
      alert('Please Check Field Lot No Entry');
    } else {
      console.log('contactNo else', contactNo);
      console.log('reportName else', reportName);
      console.log('textLot else', textLot);
      const saveStorage = {
        contactNo: contactNo,
        reportName: reportName,
        entity_cd: entity_cd,
        project_no: project_no,
        dataDebtor: dataDebtor[0],
        lot_no: dataLotno[0],
        floor: textFloor,
      };
      const jsonValue = JSON.stringify(saveStorage);
      // //   setdataFormHelp(saveStorage);
      console.log('awal mula props', saveStorage);

      await AsyncStorage.setItem('@helpdeskStorage', jsonValue);
      navigation.navigate('CategoryHelp', { saveStorage });
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('ticket')}
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
      <View style={styles.wrap}>
        <Text title2>Ticket</Text>
        <Text headline style={{ fontWeight: 'normal' }}>
          Service Request Form
        </Text>

        {checkedEntity === false ? null : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <View>
              <View style={{ marginBottom: 5, paddingBottom: 0, marginTop: 5 }}>
                <ModalDropdown_debtor
                  label="Debtor"
                  data={dataDebtor}
                  onChange={(index) =>
                    handleChangeModal({ data: dataDebtor, index })
                  }
                  value={textDebtor}
                  style={{ marginBottom: 0, paddingBottom: 0 }}
                />
              </View>

              <Text
                style={{
                  color: '#3f3b38',
                  fontSize: 14,
                  marginBottom: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
              >
                Username
              </Text>
              <TextInput
                editable={false} //wajib true kalo mau di klik-klik / di isi manual
                value={textNameDebtor} //dari nama debtor
                onChangeText={(text) => settextNameDebtor(text)}
                style={{
                  marginBottom: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
              />
              <View style={{ marginTop: 15 }}>
                <ModalDropdown_lotno
                  label="Lot No"
                  data={dataLotno}
                  onChange={(option) => handleLotChange(option.lot_no)}
                  value={textLot}
                />
              </View>
              <View style={{ marginTop: 0 }}>
                <Text
                  style={{
                    color: '#3f3b38',
                    fontSize: 14,
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                >
                  Taken By
                </Text>
                <TextInput
                  placeholder="Reported By"
                  editable={true}
                  value={reportName}
                  onChangeText={(text) => setreportName(text)}
                />
              </View>
              <View style={{ marginTop: 15 }}>
                <Text
                  style={{
                    color: '#3f3b38',
                    fontSize: 14,
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                >
                  Contact No
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Contact No"
                  editable={true}
                  value={contactNo}
                  onChangeText={(text) => setcontactNo(text)}
                  required={requiredText}
                />
              </View>

              <Button
                style={{
                  width: 100,
                  height: 45,
                  alignSelf: 'center',
                  marginTop: 20,
                }}
                onPress={() => handleNavigation()}
              >
                <Text style={{ color: '#FFF' }}>Next</Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
