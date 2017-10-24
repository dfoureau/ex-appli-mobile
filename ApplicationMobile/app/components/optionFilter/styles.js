import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  ContainerOptionFilter: {
    width: width * 0.4 - 30,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    position: "absolute",
    left: 10,
    top: 10,
  },

  LabelOptionFilter: {
    color: "#000",
    fontSize: 16,
    paddingTop: 9,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    display: "none",
  },

  OptionFilter: {
    width: width * 0.4 - 30,
    height: 40,
    color: "#000",
    //fontSize:16,
  },
});
