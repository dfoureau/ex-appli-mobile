import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  titreHeader: {
    marginLeft: 15,
    alignSelf: "center",
  },

  fondHeader: {
    backgroundColor: "#2224AA",
  },

  /**Style header */
  headerView: { flexDirection: "row", backgroundColor: "#2224AA" },
  headerRetourView: { width: 70 },
  headerBtnRetourStyle: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  headerBtnRetourImage: { height: 30, width: 30 },
  listIcon: { height: 15, width: 15, marginLeft: 25 },
  headerViewTitle: {
    flex: 1,
    paddingTop: 20,
    height: 70,
    justifyContent: "center",
  },
  headerTitle: { fontSize: 30, color: "#fff", marginLeft: 15 },
  /**Fin de style pour le header */

  /*Stye de liste, avec des containers pour séparer la partie droite et gache de l'ecran */
  listFirstEltText: {
    marginLeft: 5,
    fontSize: 18,
    flex: 2,
    color: "black",
    fontStyle: "italic",
  },
  listText: {
    fontSize: 14,
    marginBottom: 25,
    marginLeft: 5,
  },
  listDate: {
    fontSize: 14,
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    color: "black",
    fontStyle: "italic",
  },
  firstView: {
    display: "flex",
    flexDirection: "row",
  },
  secondView: {
    flex: 1,
  },
  thirdView: {
    flex: 0.5,
  },
  fourthView: {
    flex: 0.15,
  },
  firstViewCRA: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 15,
  },
  firstViewCRANoMargin: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 15,
  },

  periodText: {
    color: "black",
    fontSize: 16,
  },

  /*Stye de liste, avec des containers pour séparer la partie droite et gache de l'ecran */

  //boutton ajouter
  addBtn: { height: 20, width: 20, marginTop: 15 },
  //checkmark cra
  craIcon: { height: 15, width: 15, marginTop: -19, marginLeft: 315 },
  //text boutton ajouter
  addText: {
    flex: 1,
    alignSelf: "flex-end",
    height: 70,
    marginTop: -35,
    marginBottom: -30,
    color: "black",
  },

  texteLoader: {
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

  iconeAide: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});
