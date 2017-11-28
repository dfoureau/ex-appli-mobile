import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";

export default StyleSheet.create({
  mainView: {
    backgroundColor: "#355a86",
    flex: 1,
  },

  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },

  formContainer: {
    padding: 20,
  },

  logo: {
    width: 260,
    height: 77,
  },

  input: {
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFF",
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  checkbox: {
    marginBottom: 20,
  },

  viewContainer: {
    marginTop: 150,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },

  btnSeconnecter: {
    fontSize: 30,
    marginTop: 20,
    alignItems: "center",
  },

  viewMdpOublie: {
    alignItems: "center",
  },

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

  texte: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "#8b008b",
  },

  loader: {
    marginTop: 20,
    marginBottom: 20,
  },
});
