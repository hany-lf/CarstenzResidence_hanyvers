import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  Text,
  Header,
  Icon,
  colors,
} from "@components";
import { BaseStyle, useTheme } from "@config";
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from "@data";
import axios from "axios";
import moment from "moment";
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CardReport01, CardReport08 } from "../../components";
import List from "../../components/Product/List";
import styles from "./styles";
import { API_URL_LOKAL } from "@env";
import getUser from "../../selectors/UserSelectors";
import { useSelector } from "react-redux";

const Announce = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setErrors] = useState(false);
  const user = useSelector((state) => getUser(state));

  const getAnnounce = () => {
    const config = {
      method: "get",
      url: API_URL_LOKAL + "/home/announcement",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.Token}`,
      },
    };
    axios(config)
      .then(({ data }) => {
        console.log("defaultApp -> data", data.data);
        const peopleArray = Object.values(data);
        console.log("peopleArray", peopleArray);
        setData(data.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getAnnounce();
    }, 1000);
  }, [user]);

  const goPost = (item) => () => {
    navigation.navigate("Post", { item: item });
  };

  const goAnnouceDetail = (item) => {
    console.log("announce detail", item);
    navigation.navigate("AnnouceDetail", { item: item });
  };

  const goToCategory = () => {
    navigation.navigate("Category");
  };

  const renderContent = () => {
    const mainNews = PostListData[0];
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { flex: 1 }]}
        edges={["right", "top", "left"]}
      >
        <Header
          title={t("Announcement")}
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
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={styles.paddingFlatList}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <CardReport01
                loading={loading}
                subtitle={item.announce_descs}
                title={item.announce_title}
                // icon="bullhorn"

                images={require("../../assets/images/logoannounce.png")}
                date={moment(item.date_created).startOf("hour").fromNow()}
                style={{
                  marginBottom: index == data.length - 1 ? 0 : 15,
                }}
                onPress={() => goAnnouceDetail(item)}
              />
            )}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={["right", "top", "left"]}
      >
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Announce;
