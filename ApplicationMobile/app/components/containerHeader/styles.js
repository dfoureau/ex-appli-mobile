import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  ContainerHeader: {
    backgroundColor: "#355a86",
    height: 56,
    width: width,
  },

  MenuIcon: {
    height: 40,
    width: 40,
  },

  MenuIconLink: {
    height: 40,
    width: 40,
    position: "absolute",
    top: 8,
    left: 10,
  },

  TextHeader: {
    color: "#FFFFFF",
    fontSize: 24,
    position: "absolute",
    left: 60,
    top: 11,
  },

  ContainerMenu: {
    width: width * 0.6,
    height: height,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    paddingTop: 10,
    zIndex: 1000,
  },

  ItemMenu: {
    paddingLeft: 10,
  },

  IconItemMenu: {
    width: 36,
    height: 36,
  },

  TextItemMenu: {
    color: "#000000",
    fontSize: 16,
    position: "relative",
    left: 44,
    bottom: 28,
  },

  ContainerOpaque: {
    width: width,
    height: height,
    backgroundColor: "#000",
    opacity: 0.5,
    position: "absolute",
    zIndex: 500,
  },
});
