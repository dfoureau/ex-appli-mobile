import { StyleSheet, Dimensions } from 'react-native';
  
var {height, width} = Dimensions.get('window');

  export default   StyleSheet.create({
      container1: {
        flexDirection: 'column'
      },

      containerUser: {
        flex: 0.25,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingHorizontal:5,
        paddingVertical: 5,
        borderWidth:0.5,
        borderColor: "#808080",
        borderRadius:5
      },

      containerVacation: {
        flex: 0.25,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingHorizontal:5,
        paddingVertical: 5,
        borderWidth:0.5,
        borderColor: "#808080",
        borderRadius:5,
        alignItems: 'stretch'
      },

      containerNews: {
        flex: 0.5,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingHorizontal:5,
        paddingVertical: 5,
        borderWidth:0.5,
        borderColor: "#808080",
        borderRadius:5,
        alignItems: 'stretch'
      },

      text: {
        color: '#000000',
        fontSize: 12
      },

      text2: {
        paddingHorizontal:25
      },

      titleContainer: {
        paddingTop: 10,
        paddingHorizontal:15,
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
      },

      containerList: {
        marginBottom: 20
      },

      titleNews: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
        paddingBottom: 5
      }
  });