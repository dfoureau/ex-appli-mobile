import { StyleSheet, Dimensions } from "react-native";

let { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  text: {
    color: "black",
    fontSize: 16,
    padding: 2,
    margin: 2,
  },

  statusLabel: {
    color: "purple",
    fontSize: 16,
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
    flexDirection: "column",
    height: height,
    width: width,
  },

  container1: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 10,
  },

  containerStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  containerStatusLabel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },

  containerInfoElement: {
    flexDirection: "row",
  },

  container3: {
    flex: 0.75,
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "column",
  },

  containerTable: {
    marginBottom: 20,
  },

  container4: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 10,
  },

  header: {
    height: 25,
    backgroundColor: "#CCCCCC",
  },

  headerText: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
  },

  row: {
    height: 30,
    backgroundColor: "#EEEEEE",
  },

  rowText: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
  },

  //Boutons
  containerButtons: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 30,
    marginBottom: 5,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },
  draftButton: {
    backgroundColor: "#808080",
  },
  addButton: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },

  containerHelpLine: {
    flexDirection: "row",
    width: width,
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: 'rgba(53,90,134,0.7)',
  },
});
