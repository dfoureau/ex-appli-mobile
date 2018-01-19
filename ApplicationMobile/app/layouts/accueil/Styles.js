import { StyleSheet, Dimensions } from "react-native";

let { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  text: {
    color: "#000000",
    fontSize: 14,
  },

  textGrand: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },

  textBold: {
    color: "#000000",
    fontWeight: "bold",
  },

  bienvenueView: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  textCPRTT: {
    color: "#000000",
    fontSize: 14,
    margin: 2,
    padding: 2,
  },

  text2: {
    paddingHorizontal: 25,
  },

  text3: {
    paddingBottom: 15,
  },

  titleNews: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 5,
  },

  containerGeneral: {
    margin: 10,
  },

  container1: {
    display: "flex",
    width: width / 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  containerInfoElement: {
    flexDirection: "row",
  },

  textInputYear: {
    borderWidth: 1,
    color: "black",
    height: 22,
    width: 70,
    padding: 2,
    marginTop: 4,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    borderRadius: 5,
  },

  textInputCounter: {
    borderWidth: 1,
    color: "black",
    height: 22,
    width: 40,
    padding: 2,
    marginTop: 4,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    borderRadius: 5,
    fontWeight: "bold",
  },

  textConges: {
    color: "black",
    fontSize: 14,
    padding: 2,
    margin: 2,
  },

  blocConges: {
    marginTop: 10,
  },
});
