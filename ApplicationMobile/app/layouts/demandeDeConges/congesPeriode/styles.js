import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  marginTop40: {
    marginTop: 40,
  },
  //Calendrier
  calendarText: {
    flex: 0.25,
    fontWeight: "600",
    fontSize: 16,
    marginRight: 10,
    marginLeft: 5,
  },
  calendarComponent: {
    flex: 0.4,
  },
  //Boutons
  containerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 30,
    marginTop: 40,
  },
  button: {
    marginLeft: 15,
  },
  //Pickers
  pickerContainer: {
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
    borderColor: "#b0b0b0",
    marginLeft: 13,
  },
  picker: {
    width: 120,
    height: 36,
    color: "grey",
  },
  pickerAbsences: {
    width: 230,
  },

  deleteButton: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#cf2a27",
  },

  validateButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
