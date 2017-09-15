import { StyleSheet,
    Dimensions, } from 'react-native';
  
  
  var {height, width} = Dimensions.get('window');
  const bleu1 = "#FFF";
  const bleu2 = "#FFF";
  const bleu3 = "#FFF";
  export default   StyleSheet.create({
    calendarContainer: {
      flex: 1,
      alignItems:'center',
      marginTop: 10,
    },
    calendarText: {
      flex: .15, 
      fontWeight: '600', 
      fontSize: 16,
     paddingLeft: 30,
    },
    calendarComponent: {
      flex: .20,
    },
    calendarFlexContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    marginTop40: {
      marginTop: 40,
    },
    marginBottom20: {
      marginBottom: 20,
    },
    btnChoixDetail: {
      alignItems: 'center',
      width: 65,
      paddingTop: 18,
      paddingBottom: 18,
      borderWidth: 1,
      borderColor: '#808081',
      borderRadius: 2,
      elevation: 5,
      backgroundColor: '#f9f9f9',
      marginLeft: 10
    },
    btnChoixClicked: {
      backgroundColor: '#99C6E7',
    },
    activitesText: {
      fontWeight: '400', 
      fontSize: 15.5,
    },
    //Bouton Valider
    containerButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems : 'center',
      marginRight:30,
      marginTop: 40,
    }
  });
