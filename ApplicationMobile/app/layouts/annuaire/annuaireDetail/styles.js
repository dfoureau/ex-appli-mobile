import { StyleSheet, Dimensions } from "react-native";

let { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  container: {
    padding: 10,
    paddingTop: 20,
    width: width,
  },
  firstSection: {
    paddingTop: 27,
  },
  secondSection: {
    paddingTop: 5,
  },
  containerRow: {
    flex: 1,
    paddingLeft: 10,
    width: width,
  },
  text: {
    fontSize: 16,
    color: "#000000",
  },
  containerIcon: {
    marginRight: 10,
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center",
  },
  iconProfile: {
    height: 55,
    width: 55,
    borderRadius: 50,
    marginTop: 20,
  },
  icon: {
    height: 45,
    width: 45,
    //borderRadius:50,
    marginTop: 5,
  },

  textGrand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 5,
  },

  bienvenueView: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
});
