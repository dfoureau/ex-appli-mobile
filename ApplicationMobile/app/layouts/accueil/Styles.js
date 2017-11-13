import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  text: {
    color: "#000000",
    fontSize: 12,
  },

  text2: {
    paddingHorizontal: 25,
  },

  text3: {
    paddingBottom: 15,
  },

  titleNews: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 5,
  },

});
