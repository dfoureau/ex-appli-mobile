import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#FFF";
const bleu2 = "#FFF";
const bleu3 = "#FFF";
export default StyleSheet.create({
  text: {
    color: "black",
    fontSize: 15,
  },
  calendarContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  containerCalendar: {
    margin: 10,
    flex: 1,
    height: 380,
  },
  calendarText: {
    flex: 0.15,
    fontWeight: "600",
    fontSize: 16,
  },
  calendarComponent: {
    flex: 0.2,
  },
  calendarFlexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  marginTop40: {
    marginTop: 40,
  },
  marginBottom20: {
    marginBottom: 20,
  },
  btnChoixDetail: {
    alignItems: "center",
    width: 65,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#808081",
    borderRadius: 2,
    elevation: 5,
    backgroundColor: "#f9f9f9",
    marginLeft: 10,
  },
  btnChoixClicked: {
    backgroundColor: "#99C6E7",
  },
  activitesText: {
    fontWeight: "400",
    fontSize: 15.5,
  },
  detailActivite: {
    height: 20,
    margin: 20,
    marginLeft: 40,
    marginBottom: 0,
  },
  //Bouton Valider
  containerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 30,
    marginTop: 40,
  },
});
