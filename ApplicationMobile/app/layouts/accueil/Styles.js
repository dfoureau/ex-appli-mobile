import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  text: {
    color: "#000000",
    fontSize: 14,
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

  container1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  },

  textConges: {
    color: "black",
    fontSize: 14,
    padding: 2,
    margin: 2,
  },
});
