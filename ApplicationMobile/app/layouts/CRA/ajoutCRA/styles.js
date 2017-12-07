import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  container1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  text: {
    color: "black",
    fontSize: 16,
    padding: 2,
    margin: 2,
  },

  textCRA: {
    color: "purple",
    fontSize: 16,
    padding: 2,
    margin: 2,
    marginRight: 45,
    marginTop: 3,
  },

  // containerPicker: {
  //   flexDirection: "row",
  //   width: 162,
  //   height: 29,
  //   alignItems: "center",
  //   padding: 2,
  //   marginTop: -27,
  //   marginLeft: -160,
  //   borderWidth: 1,
  //   backgroundColor: "#f4f4f4",
  // },

  containerPicker: {
    flexDirection: "row",
    borderWidth: 1,
    width: 160,
    height: 29,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 2,
  },

  containerHelpLine: {
    flexDirection: "row",
    width: width,
    justifyContent: "center",
  },

  containerFirstLine: {
    flexDirection: "row",
    marginTop: -3,
    marginLeft: 9,
  },

  containerSecondLine: {
    flexDirection: "row",
    marginTop: -3,
    marginLeft: 9,
  },

  containerThirdLine: {
    flexDirection: "row",
    marginTop: -10,
    marginLeft: 9,
  },

  containerFourthLine: {
    flexDirection: "row",
    marginTop: -3,
    marginLeft: 30,
  },

  container3: {
    flex: 0.75,
    marginHorizontal: 10,
    flexDirection: "column",
  },

  statusLabel: {
    color: "purple",
    fontSize: 16,
  },

  textAbsences: {
    color: "black",
    fontSize: 16,
    padding: 2,
    margin: 2,
    marginRight: -30,
  },

  textMois: {
    color: "black",
    fontSize: 16,
    padding: 2,
    marginTop: 2,
    marginLeft: -90,
  },

  btnModifier: {
    backgroundColor: "#cf2a27",
    width: 100,
  },

  table: { width: 335, marginTop: 18, marginLeft: 5 },
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

  textInformation: {
    fontSize: 14,
    padding: 2,
    marginTop: 4,
    paddingTop: 10,
    paddingHorizontal: 15,
    color: "#000000",
    fontWeight: "bold",
  },

  containerInformation: {
    flexDirection: "row",
    height: 210,
    flex: 0.25,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: "#808080",
    borderRadius: 5,
  },

  containerCommentaire: {
    flexDirection: "row",
    flex: 0.25,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: "#808080",
    borderRadius: 5,
  },

  containerInfoClt: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: -70,
    height: 35,
  },

  containerInfoResp: {
    flexDirection: "row",
    display: "flex",
    marginTop: 95,
    marginLeft: -310,
    height: 35,
  },

  containerInfoPrj: {
    flexDirection: "row",
    display: "flex",
    marginTop: 160,
    marginLeft: -310,
    height: 35,
  },

  textResponsable: {
    color: "black",
    fontSize: 16,
    marginLeft: -310,
    marginTop: 70,
  },

  textProjet: {
    color: "black",
    fontSize: 16,
    marginLeft: -310,
    marginTop: 135,
  },

  textInputProjet: {
    borderWidth: 1,
    color: "black",
    height: 35,
    width: 300,
  },

  textInputInfos: {
    width: 300,
    height: 35,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    fontSize: 15,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    marginBottom: 10,
  },

  textInputComment: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    fontSize: 15,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    marginBottom: 10,
    textAlignVertical: "top",
  },

  textCommentaire: {
    fontSize: 14,
    padding: 2,
    marginTop: 4,
    paddingTop: 10,
    paddingHorizontal: 15,
    color: "#000000",
    fontWeight: "bold",
  },

  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },

  containerButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 10,
    marginTop: 35,
  },

  containerButtonPeriod: {
    alignItems: "center",
    margin: 5,
  },

  deleteButton: {
    backgroundColor: "#FF0000",
  },

  draftButton: {
    backgroundColor: "#808080",
  },
});
