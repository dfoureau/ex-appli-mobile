import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  text: {
    color: "black",
    fontSize: 16,
    padding: 2,
    margin: 2,
  },

  textInputYear: {
    borderWidth: 1,
    color: "black",
    height: 25,
    width: 70,
    padding: 2,
    marginTop: 4,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 5,
  },

  textInputCounter: {
    borderWidth: 1,
    color: "black",
    height: 25,
    width: 40,
    padding: 2,
    marginTop: 4,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 5,
  },

  container: {
    display: "flex",
    flexDirection: "column",
  },

  container1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  containerInfoElement: {
    flexDirection: "row",
  },

  container2: {
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
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 5,
  },

  container3: {
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

  dayNumberText: {
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

  btnAjouter: {
    backgroundColor: "#000000",
  },
});
