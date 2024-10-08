import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderBottomColor: BaseColor.dividerColor,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
