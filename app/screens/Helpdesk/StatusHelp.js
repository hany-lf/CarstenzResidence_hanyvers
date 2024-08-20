import {
  Text,
  TextInput,
  // CheckBox,
  PlaceholderLine,
  Placeholder,
  Button,
  SafeAreaView,
  RefreshControl,
  Header,
  Icon,
  CategoryIconSoft,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { CheckBox, Badge } from "react-native-elements";
import { Image } from "react-native";
import { parseHexTransparency } from "@utils";
import { useNavigation } from "@react-navigation/native";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  TouchableOpacity,
  View,
  Platform,
  TouchableHighlight,
} from "react-native";

import { useSelector } from "react-redux";
import getUser from "../../selectors/UserSelectors";
import getProject from "../../selectors/ProjectSelector";
import axios from "axios";
import client from "../../controllers/HttpClient";
import styles from "./styles";

import { RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL_LOKAL } from "@env";

import { Dropdown } from "react-native-element-dropdown";

export default function StatusHelp({ route }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const users = useSelector((state) => getUser(state));
  const [email, setEmail] = useState("");
  const [urlApi, seturlApi] = useState(client);
  const [entity_cd, setEntity] = useState("");
  const [project_no, setProjectNo] = useState("");
  const [db_profile, setDb_Profile] = useState("");
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [dataStatus, setDataStatus] = useState([]);
  const [show, setShow] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  const [defaulTower, setDefaultTower] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState(false);

  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const project = useSelector((state) => getProject(state));

    //  getTicketStatus(params);
    //       setShow(true);
  //   console.log('passprop kategori help', passProp);
  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };
  
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

        getTicketStatus(project);
        setShow(true);
      }
       
    }, 3000);
  }, [project]);

    // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(users != null && users.userData != null ? users.userData.email : "");
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
          // setShow(true);
          getTicketStatus(items); // ini dikasih get apapun setelah pilih project
        }
      });
    }
  };

  const getTicketStatus = async (data) => {
    console.log("data for status", data);


    const formData = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      email: email,
    };

    console.log("formdata", formData);
    const config = {
      method: "get",
      url: API_URL_LOKAL + "/modules/cs/ticket-status-count",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    };

    await axios(config)
      .then((res) => {
        const datas = res.data;

        console.log("data kategori", datas.success);
        if (datas.success === true) {
          const datastatus = datas.data;
          console.log("datastatus", datastatus);

          if (datastatus.length > 1) {
            setDefaultStatus(false);
          } else {
            setDefaultStatus(true);
            setSpinner(false);
          }

          setDataStatus(datastatus);
        } else {
          setDisabled(false);
        }

        // setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log("error get status api", error.response);
        // alert('error get');
      });
  };

  const handleNavigation = (data, ticketStatus) => {
    console.log("data where tiket statuss", data);
    console.log("tikett status", ticketStatus);
    setDisabled(true);
    getTicketWhereStatus(data, ticketStatus);
  };
  const getTicketWhereStatus = async (data, ticketStatus) => {
    console.log("data where", data);
    console.log("tiket state where", ticketStatus);

    const formData = {
        email: email,
        status: ticketStatus,
      };
    const config = {
      method: "get",
      url: API_URL_LOKAL + "/modules/cs/ticket-by-status",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${users.Token}`,
      },
      params: formData,
    }
    await axios(config)
      .then((res) => {
        const datas = res.data;

        // console.log('data datastatuswhere', datas);
        const datastatuswhere = datas.data;
        // navigation.navigate('ViewHistoryStatus', {datastatuswhere}); //sementara krn data 0
        if (datas.success === true) {
          const datastatuswhere = datas.data;
          // setDataStatus(datastatus);
          navigation.navigate("ViewHistoryStatus", datastatuswhere);
          console.log("datastatuswhere", datastatuswhere);
        } else {
          setDisabled(false);
        }

        // setSpinner(false);
        // return res.data;
      })
      .catch((error) => {
        console.log("error get where status api", error.response);
        alert("error get");
      });
  };

  //    const onCategoryPress = cat => {
  //        this.setState({isDisabled: true}, () => {
  //          this.goToScreen('screen.SelectCategory', cat);
  //        });
  //      };
  const ds = dataStatus;
  // console.log("ds", ds);
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={["right", "top", "left"]}
    >
      <Header
        title={t("status")} //belum dibuat lang
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
        <Text title2>Ticket</Text>
        <Text headline style={{ fontWeight: "normal" }}>
          Status Help
        </Text>

        <View style={[styles.subWrap, { paddingBottom: 0, marginBottom: 10 }]}>
         

          {show && checkedEntity === true ? (
            <View style={{ marginTop: 30, marginHorizontal: 10 }}>
              <TouchableOpacity
                onPress={() => handleNavigation(dataTowerUser, "'R'")}
                disabled={ds.cntopen == 0 ? true : false}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#555",
                  //   paddingTop: 1,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",

                    // alignSelf: 'center',
                  }}
                >
                  {/* <CategoryIconSoft
                    isRound
                    size={25}
                    name="angle-left"
                    // style={{marginTop: 10}}
                  /> */}
                  <View
                    style={{
                      borderRadius: 20,
                      // width: 50,
                      // height: 50,
                      width: 60,
                      height: 60,
                      // borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                      backgroundColor: parseHexTransparency(
                        colors.primary,
                        100
                      ),
                    }}
                  >
                    <Icon
                      name={"tasks"}
                      size={25}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>

                  {/* <Image
                    source={require('@assets/images/icon-helpdesk/newtiket.png')}
                    style={styles.img}></Image> */}
                  <Text
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                  >
                    Open
                  </Text>

                  <Badge
                    badgeStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#42B649",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                    value={
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        {ds.cntopen}
                      </Text>
                    }
                  ></Badge>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleNavigation(dataTowerUser, "'A','P','M','F','Y','Z'")
                }
                disabled={ds.cntprocces == 0 ? true : false}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#555",
                  //   marginBottom: 10,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    // alignSelf: 'center',
                  }}
                >
                  {/* <CategoryIconSoft
                    isRound
                    size={25}
                    icon={'hourglass-half'}
                    style={{marginTop: 10}}
                  /> */}
                  <View
                    style={{
                      borderRadius: 20,
                      // width: 50,
                      // height: 50,
                      width: 60,
                      height: 60,
                      // borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                      marginBottom: 10,
                      backgroundColor: parseHexTransparency(
                        colors.primary,
                        100
                      ),
                    }}
                  >
                    <Icon
                      name={"tasks"}
                      size={25}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>
                  {/* <Image
                    source={require('@assets/images/icon-helpdesk/newtiket.png')}
                    style={styles.img}></Image> */}
                  <Text
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                  >
                    Process
                  </Text>

                  <Badge
                    badgeStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#42B649",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                    value={
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        {ds.cntprocces}
                      </Text>
                    }
                  ></Badge>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigation(dataTowerUser, "'V'")}
                disabled={ds.cntcancel == 0 ? true : false}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#555",
                  //   marginBottom: 10,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    // alignSelf: 'center',
                  }}
                >
                  {/* <CategoryIconSoft
                    isRound
                    size={25}
                    icon={'times'}
                    style={{marginTop: 10}}
                  /> */}

                  <View
                    style={{
                      borderRadius: 20,
                      // width: 50,
                      // height: 50,
                      width: 60,
                      height: 60,
                      // borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                      marginBottom: 10,
                      backgroundColor: parseHexTransparency(
                        colors.primary,
                        100
                      ),
                    }}
                  >
                    <Icon
                      name={"tasks"}
                      size={25}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>

                  {/* <Image
                    source={require('@assets/images/icon-helpdesk/newtiket.png')}
                    style={styles.img}></Image> */}
                  <Text
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                  >
                    Cancel
                  </Text>

                  <Badge
                    badgeStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#42B649",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                    value={
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        {ds.cntcancel}
                      </Text>
                    }
                  ></Badge>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigation(dataTowerUser, "'C'")}
                disabled={ds.cntclose == 0 ? true : false}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#555",
                  //   marginBottom: 10,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    // alignSelf: 'center',
                  }}
                >
                  {/* <CategoryIconSoft
                    isRound
                    size={25}
                    icon={'check-double'}
                    style={{marginTop: 10}}
                  /> */}
                  <View
                    style={{
                      borderRadius: 20,
                      // width: 50,
                      // height: 50,
                      width: 60,
                      height: 60,
                      // borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                      marginBottom: 10,
                      backgroundColor: parseHexTransparency(
                        colors.primary,
                        100
                      ),
                    }}
                  >
                    <Icon
                      name={"tasks"}
                      size={25}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>
                  {/* <Image
                    source={require('@assets/images/icon-helpdesk/newtiket.png')}
                    style={styles.img}></Image> */}
                  <Text
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                  >
                    Close
                  </Text>

                  <Badge
                    badgeStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#42B649",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                    value={
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        {ds.cntclose}
                      </Text>
                    }
                  ></Badge>
                </View>
              </TouchableOpacity>
            </View>
          ) : // <Text>Choose Project First</Text>
          null}
        </View>
      </View>
    </SafeAreaView>
  );
}
