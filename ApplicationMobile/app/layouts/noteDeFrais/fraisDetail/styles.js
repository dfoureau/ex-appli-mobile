import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    marginRight: 15,
    marginLeft: 15,
    flex: 1,
  },
  containerEtat: {
    marginTop: 5,
  },
  containerCalendar: {
    marginTop: 10,
    flex: 1,
    height: 380,
  },
  containerDetails: {
    flex: 1,
    flexDirection: "column",
  },
  containerInput: {
    //marginTop: 10,
    //borderWidth: 1,
    //borderColor: 'gray',
  },
  inputView: {
    marginLeft: 7,
  },
  checkbox: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputComponent: {
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
    marginTop: 5,
  },
  inputComponentRow: {
    width: 174,
  },
  inputComponentSmall: {
    width: 152,
  },
  inputGroup: {
    flex: 1,
    flexDirection: "row",
  },
  inputText: {
    width: 125,
    marginRight: 5,
    paddingTop: 10,
  },
  inputTextSmall: {
    width: 145,
  },
  text: {
    color: "black",
    fontSize: 16,
  },
  containerDate: {
    alignItems: "center",
    flex: 1,
    marginTop: 10,
  },
  containerButton: {
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

  stickyFooter: {
    flex: 0.1,
    alignItems: "center",
    borderColor: "#355A86",
    borderWidth: 1,
    alignItems:'center',
    justifyContent:'center'
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

});
