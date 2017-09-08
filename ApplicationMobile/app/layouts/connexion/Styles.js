import { StyleSheet,
  Dimensions, } from 'react-native';


var {height, width} = Dimensions.get('window');
const bleu1 = "#2298AA";
const bleu2 = "#2ABBDD";
const bleu3 = "#355A86";
export default   StyleSheet.create({
	scrollView:{ width:width,height:height,backgroundColor:'#355a86',},
	viewContainer:{marginTop:150, width:width, justifyContent:'center',alignItems: 'center',},
	viewChamps:{justifyContent:'center',alignItems: 'center',marginTop:120},
	viewSeConnecter:{marginTop:20, alignItems: 'center', },
	btnSeconnecter:{fontSize:30,},
	viewMdpOublie:{marginTop:20, alignItems: 'center', },
	touchMdpOublie:{width:200,height:50, justifyContent:'center',alignItems: 'center',},
	txtMdpOublie:{fontSize:15, color:"#2298AA", justifyContent:'center',alignItems: 'center',},
	inputContainer: {
		borderLeftWidth: 2,
		borderRightWidth: 2,
		borderTopWidth: 2,
		borderBottomWidth: 2,
		height: 50,
		marginTop:20,
	  },

	input: {
		height: 50,
		backgroundColor: '#ffffff',
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 0, 
		fontSize:19,
	  }
});

