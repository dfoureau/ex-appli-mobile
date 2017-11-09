import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  text: {
    color: "#000000",
    fontSize: 12,
  },

  text2: {
    paddingHorizontal: 25,
  },

  text3: {
    paddingBottom: 15,
  },

  titleNews: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 5,
  },

  texte: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    color: "#8b008b",
},

loader: {
    marginTop : 20,
    marginBottom : 20,
}

});
