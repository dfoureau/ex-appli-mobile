import { StyleSheet, Dimensions } from "react-native";

let { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  SearchFilter: {
    minWidth: width * 0.6,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    fontSize: 16,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    marginBottom: 10,
  },

  SearchIcon: {
    width: 24,
    height: 24,
    position: "absolute",
    top: 8,
    right: 8,
  },
});
