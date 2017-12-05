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
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 30,
    marginBottom: 5,
    marginTop: 5,
  },

  stickyFooter: {
    flex: 0.1,
    borderColor: "#355A86",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollViewBody: {
    flex: 0.9,
  },

  ContainerHeader: {
    backgroundColor: "#355a86",
    height: 56,
    width: width,
  },

  MenuIcon: {
    height: 40,
    width: 40,
  },

  MenuIconLink: {
    height: 40,
    width: 40,
    position: "absolute",
    top: 8,
    left: 10,
  },

  LogoTitreCat: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    height: 51,
    width: 173,
    position: "absolute",
    right: 10,
    opacity: 0.3,
  },

  TextHeader: {
    color: "#FFFFFF",
    fontSize: 24,
    position: "absolute",
    left: 60,
    top: 11,
  },

  textFooter: {
    color: "black",
    fontSize: 16,
    paddingRight: 30,
  },

  mainContainer: {
    flex: 1,
  },

  texteLabel: {
    color: "black",
    fontSize: 16,
  },

  texteDate: {
    color: "black",
    fontSize: 22,
  },
});
