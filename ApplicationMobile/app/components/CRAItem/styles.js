import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
export default StyleSheet.create({
  containerList: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },

  containerIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'flex-end',
  },

  containerPeriod: {
    flexDirection: "row",
  },

  listIcon: {
    height: 15,
    width: 15,
  },

});