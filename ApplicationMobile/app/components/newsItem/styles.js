import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
export default StyleSheet.create({
  //NewsItem
  newsItem: {
    margin : 5,
    padding : 5,
    minHeight : 85,
    flexDirection : 'row',
    borderWidth : 1,
    backgroundColor : "#d0d0d0",
  },

  newsItemL: {
    flex : 1,
    alignItems : "center",
    justifyContent : "center",
  },

  newsItemLImg: {
    height : 50,
    width : 50,
  },

  newsItemR: {
    flex : 4,
  },

  newsItemRT: {
    flexDirection : 'row',
    alignItems : "stretch",
    justifyContent : "space-between",
  },

  newsItemRB: {
    flexDirection : 'row',
  },

  newsItemRBL: {
    flex : 3,
  },

  newsItemRBR: {
    flex : 1,
    alignItems : "center",
    justifyContent : "center",
  },

  newsItemRImg: {
    height : 50,
    width : 50,
  },

  title: {
    fontWeight : "bold",
    color : "black",
  },

  content: {
    color : "black",
  },

  date: {


  },

});
