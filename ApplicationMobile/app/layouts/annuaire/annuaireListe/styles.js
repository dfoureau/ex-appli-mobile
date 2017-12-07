import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#FFF";
const bleu2 = "#FFF";
const bleu3 = "#FFF";
export default StyleSheet.create({
  scrollView: { width: width, height: height },
  viewContainer: {
    marginTop: 150,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  viewChamps: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  viewSeConnecter: { marginTop: 20, alignItems: "center" },
  btnSeconnecter: { fontSize: 30 },
  viewMdpOublie: { marginTop: 20, alignItems: "center" },
  touchMdpOublie: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  txtMdpOublie: {
    fontSize: 15,
    color: "#2298AA",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    height: 50,
    marginTop: 20,
  },

  input: {
    height: 50,
    backgroundColor: "#ffffff",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0,
    fontSize: 19,
  },

  container: {
    width: width,
    minHeight: height,
  },
  sectionContain: {
    paddingBottom: 300,
  },
  sectionHeader: {
    paddingTop: 15,
    paddingLeft: 25,
    height: 50,
    width: width,
    backgroundColor: "#ffffff",
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    //height: 44,
    width: width,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    color: "#000000",
  },
  itemRow: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 10,
    height: 44,
    width: width,
    alignItems: "center",
  },
  itemPhoto: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },

  ContainerOptionFilter: {
    width: width * 0.4 - 30,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    position: "absolute",
    left: 10,
    top: 10,
  },

  LabelOptionFilter: {
    color: "#000",
    fontSize: 16,
    paddingTop: 9,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    display: "none",
  },

  OptionFilter: {
    width: width * 0.4 - 30,
    height: 40,
    color: "#000",
    //fontSize:16,
  },

  SearchFilter: {
    minWidth: width * 0.6,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    fontSize: 16,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    marginBottom: 10,
  },

  SearchIcon: {
    width: 32,
    height: 32,
    position: "absolute",
    top: 3,
    right: 2,
  },

  touchableSearchIcon: {
    width: 64,
    height: 32,
    position: "absolute",
    top: 3,
    right: 2,
  },
});
