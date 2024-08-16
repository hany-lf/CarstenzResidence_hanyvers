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
} from "@components";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  View,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BaseStyle, useTheme, BaseColor } from "@config";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import getUser from "../../selectors/UserSelectors";
import getProject from "../../selectors/ProjectSelector";
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");
import moment from "moment";
import Style from "./styles";
import { API_URL_LOKAL } from "@env";
import axios from "axios";

const MeterInfoX = (params) => {
  const [dataMember, setDataMember] = useState(params.params);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [projectDesc, setProjectDesc] = useState("");
  const toMonth = moment(new Date()).format("MM");
  console.log('tomount', toMonth)
  const [chooseMonths, setChooseMonths] = useState(toMonth);
  const toYears = moment(new Date()).format("YYYY");
  const [getYears, setGetYears] = useState(toYears);

  // const projectSelector = useSelector((state) => getProject(state));
  const user = useSelector((state) => getUser(state));
  const [email, setEmail] = useState(user != null ? user.user : "");
  // const [dataProject, setDataProject] = useState([]);
  const [dataMeter, setDataMeter] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setError] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [showChooseProject, setShowChooseProject] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [valueProject, setValueProject] = useState([]);
  const [valueProjectSelected, setValueProjectSelected] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [entity_cd, setEntity] = useState("");
  const [project_no, setProjectNo] = useState("");
  const project = useSelector((state) => getProject(state));
  const [loading, setLoading] = useState(true);

  console.log("params >", dataMember);
  console.log("email >", email);
  console.log("user >", user);
  // console.log('projectSelector >', projectSelector);

  console.log("getMeterLoad", dataMeter);

  console.log("chooseMonths", chooseMonths);

  // const toMonth = moment(new Date()).format("MM");
  // const toYears = moment(new Date()).format("YYYY");
  const toMonthName = moment(new Date()) .format("MMMM");

  const customStyleIndex = 0;

  const meterType = (type) => {
    if (type == "E") {
      return "KWH";
    } else {
      return "M3";
    }
  };
  const defaultMonths = [
    { value: "01", descs: "January" },
    { value: "02", descs: "February" },
    { value: "03", descs: "March" },
    { value: "04", descs: "April" },
    { value: "05", descs: "May" },
    { value: "06", descs: "June" },
    { value: "07", descs: "July" },
    { value: "08", descs: "August" },
    { value: "09", descs: "September" },
    { value: "10", descs: "October" },
    { value: "11", descs: "November" },
    { value: "12", descs: "December" },
  ];

  const defaultYears = moment(new Date()).format("YYYY");

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
      // getDataStorage();
      // defaultLocation();
    }, 3000);
  }, [project]);

    // --- useeffect untuk update email/name
  useEffect(() => {
    setEmail(user != null && user.userData != null ? user.userData.email : "");
  }, [email]);
  // --- useeffect untuk update email/name

  // const getMeterLoad = data => {
  //   const entitycds = data[0].entity_cd;
  //   const projectnos = data[0].project_no;
  //   const emails = data[0].email;

  //   console.log('entity_cd', entitycds);
  //   console.log('project_no', projectnos);
  //   console.log('emails', emails);
  //   console.log(
  //     'dataFilter',
  //     'http://apps.pakubuwono-residence.com/apiwebpbi/api/modules/meter/data-filter/IFCAPB/' +
  //       entitycds +
  //       '/' +
  //       projectnos +
  //       '/' +
  //       emails +
  //       '/' +
  //       toMonth +
  //       '/' +
  //       toYears,
  //   );

  //   fetch(
  //     'http://apps.pakubuwono-residence.com/apiwebpbi/api/modules/meter/data-filter/IFCAPB/' +
  //       entitycds +
  //       '/' +
  //       projectnos +
  //       '/' +
  //       emails +
  //       '/' +
  //       toMonth +
  //       '/' +
  //       toYears,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     },
  //   )
  //     // .then(response => response.json())
  //     .then(res => {
  //       if (!res.Error) {
  //         let resData = res.Data;
  //         setDataMeter(resData);
  //         setSpinner(false);
  //       } else {
  //         // alert(res.Pesan);
  //       }
  //       // console.log('getDuedate2', res);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const onRetrieve = () => {
    if (getYears == '' || chooseMonths == '' || toMonth == '') {
      console.log('cek getYears', getYears);
      console.log('cek chooseMonths', chooseMonths);
      console.log('cek toMonth', toMonth);
      alert("Please fill in Years");
    } else {
      // console.log('get years ada isinya', getYears)
      //    console.log('ada isinya chooseMonths', chooseMonths);
      // console.log('ada isinya toMonth', toMonth);
      setSpinner(true);

      const toEmail = email;
      const Entitycdz = entity_cd;
      const Projectnoz = project_no;
      const Monthz = chooseMonths || toMonth;
      const Yearz = getYears;

      console.log("Entitycdz", Entitycdz);
      console.log("Projectnoz", Projectnoz);
      console.log("Monthz", Monthz);
      console.log("getYears", getYears);
      console.log("toEmail", toEmail);

      const config = {
        method: "get",
        url: API_URL_LOKAL + "/modules/meter/data-filter/" + Entitycdz + "/" + Projectnoz + "/" + toEmail + "/" + Monthz + "/" + Yearz,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.Token}`,
        },
      };

      axios(config)
        .then((res) => {
          console.log("cek isi RES", res);
           let resData = res.data.data;
            let resPesan = res.data.message;
            let resError = res.data.success;
          if (res.data.success) {
            // let resData = res.data.data;
            // let resPesan = res.data.message;
            // let resError = res.data.success;
            setDataMeter(resData);
            setMessage(resPesan);
            setError(resError);

            setSpinner(false);
            // console.log('getMeterLoad', this);
          } else {
            console.log('res.message', res.data.data)
             setDataMeter(resData);
            setMessage(resPesan);
            setError(resError);
            // alert(res.message);
            setSpinner(false);
          }
        })
        .catch((error) => {
          console.log('error retrieve,', error.response);
        });
    }
  };

  return (
    <SafeAreaView>
      <Header
        title={t("Meter Info")}
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
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        //  contentContainerStyle={{ paddingHorizontal: 20 }}
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          backgroundColor: colors.backgroundColor, //BaseColor.whiteColor,
          //backgroundColor: BaseColor.whiteColor,
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={[
              Style.subTitle2,
              {
                color: colors.background == "white" ? "#4E4E4E" : "white",
              },
            ]}
          >
            Project
          </Text>
          <Picker
            style={[
              styles.Dropdown1,
              {
                backgroundColor:
                  colors.background == "white" ? "#f0f0f0" : "#323232",
                color: colors.background == "white" ? "#777777" : "white",
              },
            ]}
            mode={"dropdown"}
            selectedValue={projectDesc}
            onValueChange={(val) => setProjectDesc(val)}
          >
            {/* <Picker.Item label="Java" value="java" /> */}
            {projectData.map((data, key) => {
              return (
                <Picker.Item
                  key={key}
                  label={data.descs}
                  value={data.project_no}
                />
              );
            })}
          </Picker>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat-SemiBold",
              color: colors.background == "white" ? "#4E4E4E" : "white",
              marginTop: 15,
            }}
          >
            Month
          </Text>
          <Picker
            style={[
              styles.Dropdown2,
              {
                backgroundColor:
                  colors.background == "white" ? "#f0f0f0" : "#323232",
                color: colors.background == "white" ? "#777777" : "white",
              },
            ]}
            mode={"dropdown"}
            selectedValue={chooseMonths}
            onValueChange={(val) => setChooseMonths(val)}
          >
            {defaultMonths.map((data, key) => (
              <Picker.Item key={key} label={data.descs} value={data.value} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat-SemiBold",
              color: colors.background == "white" ? "#4E4E4E" : "white",
              marginTop: 10,
            }}
          >
            Years
          </Text>
          <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
            <TextInput
            style={{
              height: 55,
              backgroundColor:
                colors.background == "white" ? "#f5f5f5" : "#323232",
              color: colors.background == "white" ? "black" : "white",
              paddingHorizontal: 10,
              marginBottom: 10,
              marginLeft: 20,
              width: 250,
              // borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            // placeholder={defaultYears}
            placeholder="YYYY"
            placeholderTextColor="#a9a9a9"
            // defaultValue={this.state.defaultYears}
            value={getYears}
            onChangeText={(val) => setGetYears(val)}
          />
            {getYears == null ? 
              <Text style={{color: 'red', fontSize:11, paddingHorizontal: 20}}>
                If you don't fill in the Year field, it will fill in the current year.
              </Text> : 
            null}
          </View>
        </View>
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={Style.title}></Text>
          <TouchableOpacity
            style={{
              width: 100,
              height: 45,
              alignSelf: "center",
              marginTop: 20,
              backgroundColor: "#58D68D",
              color: "black",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
            }}
            onPress={() => onRetrieve()}
          >
            <Text
              style={{
                fontSize: 18,
              }}
            >
              Retrieve
            </Text>
          </TouchableOpacity>
        </View>

        {customStyleIndex === 0 && (
          <ScrollView style={styles.listview}>
            {spinner ? (
              <ActivityIndicator size="large" color="#37BEB7" />
            ) : errorMsg == false ? (
              <Text style={{textAlign: 'center'}}>{message}</Text>
            ) : dataMeter != null || dataMeter.length > 0 ? (
              dataMeter.map((data, key) => {
                return (
                  <View key={key} style={styles.card}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          {data.lot_no}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            textAlign: "right",
                            color: "#9B9B9B",
                          }}
                        >
                          {data.descs}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            textAlign: "left",
                            color: "#F99B23",
                          }}
                        >
                          {data.name}
                        </Text>
                        <View>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "500",
                              textAlign: "right",
                              color: "#9B9B9B",
                            }}
                          >
                            {data.meter_id}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#F3F3F3",
                          marginTop: 5,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {/* <Icon name="event" size={13} color="#9B9B9B"/> */}
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "500",
                              textAlign: "left",
                              color: "#9B9B9B",
                            }}
                          >
                            {moment(data.doc_date).format("DD MMM YYYY")}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {/* <Icon name="attach-money" size={13} color="#F99B23"/> */}
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "500",
                              textAlign: "left",
                              color: "#333",
                            }}
                          >
                            {/* {numFormat(data.trx_amt)} */}
                            {data.trx_amt}
                          </Text>
                        </View>
                      </View>

                      {/* Title */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          Current
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          Last
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          Total x {parseInt(data.multiplier)}
                        </Text>
                      </View>

                      {/* Value */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          {data.curr_read + meterType(data.meter_type)}
                        </Text>
                        <Text>|</Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          {data.last_read + meterType(data.meter_type)}
                        </Text>
                        <Text>|</Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          {data.usage + meterType(data.meter_type)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              alert("Data not found")
            )}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MeterInfoX;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#fff",
    shadowOpacity: 0.5,
    // elevation:5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 10,
  },
  listview: {
    marginTop: "1%",
    height: "100%",
  },
  listitemm: {
    height: 100,
  },
  input: {
    height: 40,
    backgroundColor: "#f5f5f5",
    color: "black",
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 20,
    width: null,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  inputTime: {
    height: 40,
    backgroundColor: "#f5f5f5",
    color: "black",
    paddingHorizontal: 10,
    marginBottom: 16,
    width: deviceWidth * 0.4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  inputUsage: {
    height: 40,
    color: "black",
    marginBottom: 16,
    // borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  inputDate: {
    height: 40,
    backgroundColor: "#f5f5f5",
    color: "black",
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
  },
  btnMin: {
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#f1f1f1",
    width: deviceWidth * 0.08,
  },
  btnPlus: {
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#f1f1f1",
    width: deviceWidth * 0.08,
  },
  textBlack: {
    color: "#3f3b38",
    //fontFamily: 'Montserrat-Regular',
  },
  Dropdown1: {
    // fontFamily: Fonts.type.sfuiDisplaySemibold,
    borderBottomWidth: 0,
    borderColor: "#DDD",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    width: 250,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    color: "#777777",
    // paddingLeft: Fonts.moderateScale(10),
  },
  Dropdown2: {
    // fontFamily: Fonts.type.sfuiDisplaySemibold,
    borderBottomWidth: 0,
    borderColor: "#DDD",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    width: 250,
    marginBottom: 10,
    marginLeft: 15,
    borderRadius: 5,
    textAlignVertical: "top",
    color: "#777777",
    // paddingLeft: Fonts.moderateScale(10),
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  showPickerBtn: {
    height: 44,
    backgroundColor: "#973BC2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  yearMonthText: {
    fontSize: 20,
    marginTop: 12,
  },
});
