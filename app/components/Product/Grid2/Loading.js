import React from "react";
import { View } from "react-native";
import { PlaceholderLine, Placeholder } from "@components";
import styles from "./styles";

const Loading = (props) => {
  const { style } = props;
  return (
    <Placeholder style={[style]}>
      <PlaceholderLine style={[styles.imageBackgroundGrid2]} />
      <PlaceholderLine width={100} />
      <View style={{ flexDirection: "row" }}>
        <PlaceholderLine width={20} style={{ marginRight: 5 }} />
        <PlaceholderLine width={20} style={{ marginLeft: 5 }} />
      </View>
    </Placeholder>
  );
};

export default Loading;
