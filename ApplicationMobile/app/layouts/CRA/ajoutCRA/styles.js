import { StyleSheet,
  Dimensions, } from 'react-native';


var {height, width} = Dimensions.get('window');
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
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


  containerButton:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems : 'center',
    marginRight:10,
    height:30
  },



  containerList: {
    marginBottom: 20,
  },

  containerPeriod: {
    flexDirection: 'row'
  },

  containerIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  periodText: {
    color: 'black',
    fontSize: 16
  },

  dayNumberText: {
    color: 'gray',
    fontSize: 14
  },

  statusText: {
    color: 'gray',
    fontSize: 14
  },

  listIcon: {
    height: 15,
    width: 15
  },

  text: {
       color: 'black',
       fontSize: 16,
       padding: 2,
       margin: 2
     },

  textCRA: {
         color: 'mediumorchid',
         fontSize: 16,
         padding: 2,
         margin: 2,
         marginRight : 45
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
         marginTop :30,

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


   table: { width: 335, marginTop:18 , marginLeft:15},
   headTable: {backgroundColor: '#f1f8ff' },
   rowTable: { height: 40},
   textHead: {fontSize: 15, color: 'black', textAlign: 'center' },
   textRow :{textAlign: 'center' },
})

