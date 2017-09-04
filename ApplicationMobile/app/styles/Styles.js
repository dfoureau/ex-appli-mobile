import { StyleSheet,
  Dimensions, } from 'react-native';


var {height, width} = Dimensions.get('window');
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
export default  StyleSheet.create({

  titreHeader:{
    marginLeft:15,
    alignSelf: 'center', 
  },

  fondHeader:{
    backgroundColor:'#2224AA',
  },

  /**Style header */
  headerView:{flexDirection:'row',backgroundColor:'#2224AA',},
  headerRetourView:{width:70,} ,
  headerBtnRetourStyle:{
    height:50, width:50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20,},
  headerBtnRetourImage:{height:30, width:30},
  headerViewTitle:{flex:1,paddingTop:20, height:70,justifyContent: 'center',},
  headerTitle:{fontSize:30,color:"#fff",marginLeft:15,},
  /**Fin de style pour le header */
})

