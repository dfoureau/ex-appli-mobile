import { StyleSheet,
  Dimensions, } from 'react-native';


var {height, width} = Dimensions.get('window');

export default  StyleSheet.create({


/*Stye de liste, avec des containers pour séparer la partie droite et gache de l'ecran */


  container1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },

  text: {
       color: 'black',
       fontSize: 16,
       padding: 2,
       margin: 2
  },

  textCRA: {
         color: 'purple',
         fontSize: 16,
         padding: 2,
         margin: 2,
         marginRight : 45,
         marginTop:4
  },

  containerPicker:{
      flexDirection: 'row',
      borderWidth:1,
      width:85,
      height:29,
      alignItems : 'center',
      padding: 2,
      marginTop: -2,
      marginLeft : -90
  },

  containerFirstLine: {
     flexDirection: 'row'
  },

  containerSecondLine:{
      flexDirection: 'row',
      marginTop : -3,
      marginLeft :9

    },

  containerThirdLine: {
           flexDirection: 'row',
           marginTop : -10,
  },

  containerFourthLine: {
         flexDirection: 'row',
         marginTop :20,
         marginLeft: 100,



  },

  container3: {
         flex:0.75,
         marginTop:10,
         marginHorizontal: 10,
         flexDirection: 'column'
  },

  statusLabel: {
          color: 'purple',
          fontSize: 16
  },

  textAbsences: {
            color: 'black',
            fontSize: 16,
            padding: 2,
            margin: 2,
            marginRight : 90
  },

   textMois: {
               color: 'black',
               fontSize: 16,
               padding: 2,
               marginTop: 2,
               marginLeft : -90

   },

   btnModifier: {
         backgroundColor: '#cf2a27',
          width:100,
   },

   table: { width: 335, marginTop:18 , marginLeft:5},
   header: {
           height: 25,
           backgroundColor: '#CCCCCC'
         },

         headerText: {
           fontSize: 14,
           color:'#000000',
           textAlign: 'center'
         },

         row: {
           height: 30,
           backgroundColor: '#EEEEEE'
         },

         rowText: {
           fontSize: 12,
           color:'#000000',
           textAlign: 'center'
         },



});

