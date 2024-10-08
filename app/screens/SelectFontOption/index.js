import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { BaseStyle, useTheme, FontSupport, DefaultFont } from "@config";
import { SafeAreaView, Icon, Text } from "@components";
import { ApplicationActions } from "@actions";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function SelectFontOption({ navigation }) {
  const storageFont = useSelector((state) => state.application.font);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [font, setFont] = useState(storageFont);
  const onChange = (font) => {
    dispatch(ApplicationActions.onChangeFont(font));
    navigation.goBack();
  };

  useEffect(() => {
    setFont(storageFont ?? DefaultFont);
  }, []);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={["right", "top", "left"]}
    >
      <View style={styles.contain}>
        <View style={[styles.contentModal, { backgroundColor: colors.card }]}>
          <View style={{ padding: 8 }}>
            {FontSupport.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.item,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth:
                        index == FontSupport.length - 1 ? 0 : 1,
                    },
                  ]}
                  onPress={() => setFont(item)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text body1 style={{ marginHorizontal: 8 }}>
                      {item}
                    </Text>
                  </View>
                  {item == font && (
                    <Icon name="check" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.contentAction}>
            <TouchableOpacity
              style={{ padding: 8, marginHorizontal: 24 }}
              onPress={() => navigation.goBack()}
            >
              <Text body1 grayColor>
                {t("cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => onChange(font)}
            >
              <Text body1 primaryColor>
                {t("apply")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
