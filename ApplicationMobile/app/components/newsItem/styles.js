import { StyleSheet, Dimensions } from "react-native";

var { height, width } = Dimensions.get("window");
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
export default StyleSheet.create({
  //NewsItem
  newsItem: {
    margin : 5,
    padding : 10,
    height : 85,
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
    flexDirection : 'row',
  },

  title: {

  },
  content: {

  },
  date: {
    justifyContent : "flex-end",
  },
});
