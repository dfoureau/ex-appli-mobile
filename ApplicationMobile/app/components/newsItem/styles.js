import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  //NewsItem
  newsItem: {
    margin: 5,
    padding: 5,
    minHeight: 85,
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },

  newsItemL: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  newsItemLImg: {
    height: 55,
    width: 55,
  },

  newsItemR: {
    flex: 4,
  },

  newsItemRT: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  newsItemRB: {
    flexDirection: "row",
  },

  newsItemRBL: {
    flex: 3,
  },

  newsItemRBR: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  newsItemRImg: {
    height: 40,
    width: 40,
  },

  title: {
    fontWeight: "bold",
    color: "black",
    width: 175,
  },

  content: {
    color: "black",
  },

  date: {
    width: 80,
  },
});
