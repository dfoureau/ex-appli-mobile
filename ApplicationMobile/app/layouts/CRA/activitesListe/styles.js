import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  titreHeader: {
    marginLeft: 15,
    alignSelf: "center",
  },

  fondHeader: {
    backgroundColor: "#2224AA",
  },

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
    marginBottom: 30,
    marginLeft: 15,
  },
  firstViewCRANoMargin: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 15,
  },
  /*Stye de liste, avec des containers pour séparer la partie droite et gache de l'ecran */

  //boutton ajouter
  addBtn: { height: 20, width: 20, marginTop: 15 },
  //checkmark cra
  craIcon: { height: 15, width: 15, marginTop: 35 },
  //text boutton ajouter
  addText: {
    flex: 1,
    alignSelf: "flex-end",
    height: 70,
    marginTop: -35,
    marginBottom: -30,
    color: "black",
  },

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
    margin: 4,
    textAlign: "center",
    textAlignVertical: "center",
  },

  textInputCounter: {
    borderWidth: 1,
    color: "black",
    height: 25,
    width: 40,
    padding: 2,
    margin: 4,
    textAlign: "center",
    textAlignVertical: "center",
  },

  container: {
    display: "flex",
    flexDirection: "column",
  },

  container1: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },

  containerInfoElement: {
    flexDirection: "row",
  },

  container2: {
    flex: 1,
    margin: 0,
    padding: 5,
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

  periodTextTitre: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },

  ajoutButton: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});
