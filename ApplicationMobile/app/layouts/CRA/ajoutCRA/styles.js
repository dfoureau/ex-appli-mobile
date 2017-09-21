import { StyleSheet,
  Dimensions, } from 'react-native';


var {height, width} = Dimensions.get('window');

export default  StyleSheet.create({

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
         marginTop:3
  },

  containerPicker:{
      flexDirection: 'row',
      borderWidth:1,
      width:140,
      height:29,
      alignItems : 'center',
      padding: 2,
      marginTop: -27,
      marginLeft : -145
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
         marginTop :-3,
         marginLeft: 30,

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
            marginRight : -30
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

   textInformation: {
      color: 'black',
      fontSize: 14,
      padding: 2,
      marginLeft: 24,
      marginTop :4

     },


   containerInformation: {
       flexDirection: 'row',
       flex:1,
       borderWidth: 1,
       marginLeft: 4,
       marginRight: 5,
       marginTop: 5,
       height:210,

   },

   containerInfoClt: {
        flexDirection: 'row',
        marginTop:30,
        marginLeft:-70,
        height:35,
     },

   containerInfoResp :{
           flexDirection: 'row',
           display: 'flex',
            marginTop:95,
            marginLeft:-300,
            height:35,
   },

   containerInfoPrj :{
        flexDirection: 'row',
        display: 'flex',
        marginTop:160,
        marginLeft:-300,
        height:35,
      },

   containerInfoComment :{

   },

   textResponsable : {
         color: 'black',
         fontSize: 16,
         marginLeft:-310,
         marginTop:70,
   },

   textProjet : {
          color: 'black',
          fontSize: 16,
          marginLeft:-310,
          marginTop:135,
   },


   textInputProjet:{

          borderWidth: 1,
          color: 'black',
          height: 35,
          width: 300,
   },

   textInputInfos: {
       borderWidth: 1,
       borderColor: '#2abbdd',
       color: 'black',
       height: 35,
       width: 300,
   },

   textInputComment :{
          marginLeft: 4,
          marginRight: 5,
          borderWidth: 1,


   },

   textCommentaire: {
        color: 'black',
        fontSize: 14,
        marginLeft: 24,
        marginTop:10

   },

   btnDelete :{

     color: '#cf2a27',

   },

   vueButtonValidate : {
       flexDirection: 'row',
       display: 'flex',
       marginTop  : 35,
       marginLeft: 280,

   },

   vueButtonBr : {
        flexDirection: 'row',
        display: 'flex',
        marginTop  : -29,
        marginLeft: 180,
   },

   vueButtonDelete : {
           flexDirection: 'row',
           display: 'flex',
           marginTop  : -29,
           marginLeft: 70,

      },

   alert :{

    borderRadius: 5,
    marginBottom: 5,

   },

});

