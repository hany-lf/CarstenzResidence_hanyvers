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
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { CheckBox } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";
import IconAnt from "react-native-vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TouchableOpacity, View, ScrollView } from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { tz } from "moment-timezone";
import "moment/locale/id";

import { useSelector } from "react-redux";
import getUser from "../../../selectors/UserSelectors";
import getProject from "../../../selectors/ProjectSelector";

import axios from "axios";
import client from "../../../controllers/HttpClient";
import styles from "../styles";

import ModalDropdown_debtor from "@components/ModalDropdown_debtor";
import ModalDropdown_lotno from "@components/ModalDropdown_lotno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_LOKAL } from "@env";
import { Dropdown } from "react-native-element-dropdown";

export default function SpecTrofficeUnitCleaning(props) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  console.log("propzzz", props);
  console.log("pecah data props", props.route.params);
  // const [dataCategory, setDataCategory] = useState(props.route.params.data);
  // const [indexCategory, setIndexCategory] = useState(props.route.params.index);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const users = useSelector((state) => getUser(state));
  const [email, setEmail] = useState("");

  const [urlApi, seturlApi] = useState(client);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [dataDebtor, setDataDebtor] = useState([]);
  const [entity_cd, setEntity] = useState("");
  const [project_no, setProjectNo] = useState("");
  const [db_profile, setDb_Profile] = useState("");
  const [spinner, setSpinner] = useState(true);

  const [debtor, setDebtor] = useState("");
  const [textDebtor, settextDebtor] = useState("");
  const [textNameDebtor, settextNameDebtor] = useState("");
  const [dataLotno, setDataLotno] = useState([]);
  const [textLot, setLotno] = useState("");
  const [textSlot, setSlot] = useState("");
  const [zoneCode, setZone] = useState("");
  const [typeCode, setType] = useState("");
  const [reportName, setreportName] = useState(users.name);
  const [contactNo, setcontactNo] = useState("");
  const [requiredText, setrequiredText] = useState(false);
  const [textFloor, settextFloor] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [tenant_no, setTenantNo] = useState("");

  const [defaulTower, setDefaultTower] = useState(false);
  const [defaultDebtor, setDefaultDebtor] = useState(false);
  const [defaultLotNo, setDefaultLotNo] = useState(false);
  const [workRequested, setworkRequested] = useState("");

  const dateplus = new Date();
  const datepluss = dateplus.setDate(dateplus.getDate() + 1);
  const [date, setDate] = useState(new Date(datepluss));

  // const [date, setDate] = useState(format);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState({});


  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const user = useSelector((state) => getUser(state));
  const project = useSelector((state) => getProject(state));
  const [show, setShow] = useState(false);
  // moment.locale('id');

  // moment().tz('Asia/Jakarta').format();
  // const tomorrow = moment();

  const tomorrow = new Date();
  moment.locale("id");
  // const format = moment(tomorrow).add(1, 'days').format('DD-MM-YYYY');
  const format = moment(tomorrow).add(1, "days").format("YYYY-MM-DD");



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
        console.log("data di project", project);
        setProjectData(project.data);
        setValueProject(projects);
      }

    }, 3000);
  }, [project]);

  useEffect(() => {
    if (entity_cd && project_no) {

      const params = {
        entity_cd: entity_cd,
        project_no: project_no,
      };
      getDebtor(params);
      setShow(true);
    }
  }, [entity_cd, project_no]);
  // --- useeffect untuk project

    // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : "");
  }, [email]);
  // --- useeffect untuk update email/name

    const handleClickProject = (item, index) => {
    console.log("index", index);
    setValueProjectSelected(item.value);

    setIsFocus(!isFocus);
    setShowChooseProject(!showChooseProject);

    if (item.value != null) {
      console.log("value project selected", item.value);
      projectData.map((items, index) => {
        console.log("items project data", items);
        if (items.project_no === item.value) {
          console.log("items choose project handle", items);
          console.log("index", index);
          // setProjectData(items);
          setCheckedEntity(true);
          setShow(true);
          getDebtor(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  //-----FOR GET DEBTOR
  const getDebtor = async (data) => {
    // console.log(object)
    console.log("data for debtor", data);

 
    const params = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      email: email,
    }

    console.log("data for", params);

  const config = {
      method: "get",
      url: API_URL_LOKAL + "/modules/cs/debtor",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.Token}`,
      },
      params: params,
    };

    console.log('config', config)
 
    await axios(config)
      .then((res) => {
        // console.log('res', res);
        const datas = res.data;
        const dataDebtors = datas.data;
        console.log("res debtor", dataDebtors);
        console.log("ada berapa length debtor", dataDebtors.length);

        if (dataDebtors.length > 1) {
          setDefaultDebtor(false);
        } else {
          setDefaultDebtor(true);
          setDebtor(dataDebtors[0].debtor_acct);
          setTenantNo(dataDebtors[0].tenant_no);
          settextDebtor(
            dataDebtors[0].debtor_acct + " - " + dataDebtors[0].name
          );
          settextNameDebtor(dataDebtors[0].name);
          const params = {
            entity_cd: data.entity_cd,
            project_no: data.project_no,
            tenant_no: dataDebtors[0].tenant_no,
          };
          console.log("params for lotno default", params);

          // setCheckedEntity(true);

          getLot(params, "");
          setSpinner(false);
          // console.log('params for debtor tower default', params);
          // getDebtor(params);
        }

        setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch((error) => {
        console.log("error get tower api", error.response);
        // alert('error get');
      });
  };

  useEffect(() => {
    const config = {
      method: "get",
      url: API_URL_LOKAL + "/home/common-current-time",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.Token}`,
      },
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

  const datatime = {
    timeget: time.tanggal,
    daily: time.jam,
  };

  const handleChangeModal = ({ data, index }) => {
    console.log("index,", index);
    // console.log('data chjange', data);
    // data.data.map(dat => {
    //   console.log('data for text debtor', dat);
    //   if (dat) {

    setDebtor(index.debtor_acct);
    setTenantNo(index.tenant_no);
    settextDebtor(index.debtor_acct + " - " + index.name);
    settextNameDebtor(index.name);
    getLot("", index.tenant_no);
    //   }
    // });
    setSpinner(false);
  };

  const getLot = async (data, tenantno) => {
    console.log("tenant_no lot", data);
    const params = {
      entity_cd: entity || data.entity_cd,
      project_no: project_no || data.project_no,
      email: email,
      tenant_no: tenantno || data.tenant_no,
    };
  const config = {
    method: "get",
    url: API_URL_LOKAL + "/modules/cs/lot-no",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${user.Token}`,
    },
    params: params,
  };

    await axios(config)
      .then((res) => {
        // console.log('datalotno', res);
        const datas = res.data;
        const dataLotno = datas.data;
        console.log("datalotno >", dataLotno);
        // console.log('datalotno type >', dataLotno.type);
        console.log("datalotno >", datas);

        console.log("ada berapa length debtor", dataLotno.length);
        // console.log(object)

        if (dataLotno.length > 1) {
          setDefaultLotNo(false);
        } else {
          setDefaultLotNo(true);
          setLotno(dataLotno[0].lot_no);
          setSlot(dataLotno[0].slot);
          setZone(dataLotno[0].zone_cd);
          setType(dataLotno[0].type);
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
        console.log("error get lotno api", error.response);
        // alert('error get');
      });
  };

  const handleLotChange = (lot, zone, slot, type) => {
    console.log("lot", lot);
    console.log("zones", zone);
    setSlot(slot);
    setLotno(lot);
    setZone(zone);
    setType(type);
    // this.setState({textLot: lot});
    getFloor(lot);
  };

  const getFloor = async (lot) => {
    console.log("lot getfloor", lot);
    const lotno = lot;

    const params = {
      lot_no: lotno,
    };

    const config = {
      method: "get",
      url: API_URL_LOKAL + "/modules/cs/floor",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.Token}`,
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
        console.log("error get floor api", error.response);
        alert("error get");
      });
  };

  const handleNavigation = async () => {
    // try {
    console.log("textfloor spec help", textFloor);
    if (
      (!contactNo && !reportName && textLot.length < 0) ||
      textLot == "" ||
      textLot == null
    ) {
      alert("Please Check Field Lot No Entry");
    } else {
      const saveStorage = {
        contactNo: contactNo,
        workRequested: workRequested,
        reportName: reportName,
        entity_cd: entity,
        project_no: project_no,
        dataDebtor: dataDebtor[0],
        lot_no: dataLotno[0],
        slot: textSlot,
        floor: textFloor,
        sch_date: date,
        zone_cd: zoneCode,
        lot_type: typeCode,
        select_lot_no: textLot,
      };
      const jsonValue = JSON.stringify(saveStorage);
      //   setdataFormHelp(saveStorage);
      console.log("awal mula props", saveStorage);

      await AsyncStorage.setItem("@troStorage", jsonValue);
      // navigation.navigate('CategoryHelp', {saveStorage});
      // if()
      navigation.navigate("PriceList", saveStorage);
      // navigation.navigate('SeatBooking', saveStorage);
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={["right", "top", "left"]}
    >
      <Header
        title={t("Form")} //belum dibuat lang
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
        onPressRight={() => {
          setShowChooseProject(!showChooseProject);
        }}
        onPressLeft={() => {
          navigation.goBack();
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
          placeholder={!isFocus ? "Choose Project" : "Choose Project"}
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
        {/* <View style={{flexDirection: 'center'}}> */}
        <Text
          headline
          style={{
            fontWeight: "normal",
            // fontFamily: 'KaiseiHarunoUmi',
            alignSelf: "center",
          }}
        >
          Unit Cleaning Attendant
        </Text>
        <Text
          headline
          style={{
            fontWeight: "normal",
            // fontFamily: 'KaiseiHarunoUmi',
            alignSelf: "center",
          }}
        >
          Service Request
        </Text>
        {/* </View> */}

        {/* {dataCategory.descs.includes('AC') ? <Text>ini klik ac</Text> : <Text>ini klik water</Text>} */}
        {/* {indexCategory == 0 ? <Text>ini klik ac</Text> : <Text>ini klik water</Text>} */}

        
        {checkedEntity === false ? null : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <View>
              <View style={{ marginBottom: 5, paddingBottom: 0, marginTop: 5 }}>
                <Text
                  style={{
                    color: "#3f3b38",
                    // color: '#CDB04A',
                    alignSelf: "flex-start",
                    fontSize: 14,
                    // fontSize: 16,
                    marginBottom: 10,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                    fontWeight: "800",
                    // fontFamily: 'KaiseiHarunoUmi',
                    // top: 10,
                    // flex: 1,
                    // justifyContent: 'center',
                  }}
                >
                  DATE of Schedule
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F5F5F5",
                    // colors.primary,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                  onPress={() => setOpen(true)}
                >
                  {/* {date !== null && date !== '' ? (
                    <Text>{moment(date).format('DD-MM-YYYY')}</Text>
                  ) : (
                    <Text> {datatime.timeget}</Text>
                  )} */}
                  <Text>{moment(date).format("DD-MM-YYYY")}</Text>
                  <DatePicker
                    modal
                    // minimumDate={new Date(moment(format).format('YYYY-MM-DD'))}
                    minimumDate={new Date(format)}
                    mode="date"
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                      setOpen(false);
                      setDate(date);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    color: "#3f3b38",
                    // color: '#CDB04A',
                    alignSelf: "flex-start",
                    fontSize: 14,
                    // fontSize: 16,
                    marginBottom: 10,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                    fontWeight: "800",
                    // fontFamily: 'KaiseiHarunoUmi',
                    // top: 10,
                    // flex: 1,
                    // justifyContent: 'center',
                  }}
                >
                  NAME of RESIDENT
                </Text>
                <ModalDropdown_debtor
                  // label="Debtor"
                  data={dataDebtor}
                  onChange={(index) =>
                    handleChangeModal({ data: dataDebtor, index })
                  }
                  value={textDebtor}
                  style={{ marginBottom: 0, paddingBottom: 0 }}
                />
              </View>

              {/* <Text
                style={{
                  // fontFamily: 'KaiseiHarunoUmi',
                  color: '#3f3b38',
                  fontWeight: '800',
                  fontSize: 14,
                  marginBottom: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}>
                Username
              </Text>
              <TextInput
                editable={false} //wajib true kalo mau di klik-klik / di isi manual
                value={textNameDebtor} //dari nama debtor
                onChangeText={text => settextNameDebtor(text)}
                style={{
                  marginBottom: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
              /> */}
              <View style={{ marginTop: 15 }}>
                <Text
                  style={{
                    // fontFamily: 'KaiseiHarunoUmi',
                    color: "#3f3b38",
                    fontWeight: "800",
                    fontSize: 14,
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                >
                  Unit No
                </Text>
                <ModalDropdown_lotno
                  data={dataLotno}
                  onChange={(option) =>
                    handleLotChange(
                      option.lot_no,
                      option.zone_cd,
                      option.slot,
                      option.type
                    )
                  }
                  value={textLot}
                />
              </View>
              {/* <View style={{marginTop: 0}}>
                <Text
                  style={{
                    color: '#3f3b38',
                    fontSize: 14,
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}>
                  Taken By
                </Text>
                <TextInput
                  placeholder="Reported By"
                  editable={true}
                  value={reportName}
                  onChangeText={text => setreportName(text)}
                />
              </View> */}
              <View style={{ marginTop: 15 }}>
                <Text
                  style={{
                    // fontFamily: 'KaiseiHarunoUmi',
                    color: "#3f3b38",
                    fontWeight: "800",
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
                />
              </View>
              {/* <View style={{marginTop: 15}}>
                <Text
                  style={{
                    color: '#3f3b38',
                    fontSize: 14,
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}>
                  Work Requested
                </Text>
                <TextInput
                  placeholder="Work Requested"
                  editable={true}
                  value={workRequested}
                  onChangeText={text => setworkRequested(text)}
                  required={requiredText}
                />
              </View> */}

              <Button
                style={{
                  width: 100,
                  height: 45,
                  alignSelf: "center",
                  marginTop: 20,
                }}
                onPress={() => handleNavigation()}
              >
                <Text style={{ color: "#FFF" }}>Next</Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
