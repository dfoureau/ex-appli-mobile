import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },

  container1: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },

  containerPicker: {
    flexDirection: "row",
    borderWidth: 1,
    width: 110,
    height: 29,
    alignItems: "center",
    borderRadius: 5,
  },

  containerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  container2: {
    flex: 1,
    margin: 0,
    padding: 5,
  },

  containerList: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },

  containerPeriod: {
    flexDirection: "row",
  },

  containerIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  periodText: {
    color: "black",
    fontSize: 16,
  },

  amountText: {
    color: "gray",
    fontSize: 14,
  },

  statusText: {
    color: "gray",
    fontSize: 14,
  },

  listIcon: {
    height: 15,
    width: 15,
  },

  texteMessage: {
    marginBottom: 20,
  },
});
