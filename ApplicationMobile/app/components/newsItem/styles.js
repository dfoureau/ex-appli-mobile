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
    height : 185,
    flexDirection : 'row',
    backgroundColor :"red",
  },

  newsItemL: {
    flex : 1,
    backgroundColor :"yellow",
    alignItems : "center",
    justifyContent : "center",
  },

  newsItemLImg: {
    height : 50,
    width : 50,
  },

  newsItemR: {
    backgroundColor : "blue",
    flex : 4,
    flexDirection : 'row',
  },

  newsItemRL: {
    backgroundColor :"blue",
    flex : 3,
  },

  newsItemRR: {
    backgroundColor :"green",
    flex : 1,
    alignItems : "center",
    justifyContent : "center",
  },

  newsItemRImg: {
    height : 50,
    width : 50,
  },

  title: {

  },

  content: {

  },

  date: {
    
  },

});
