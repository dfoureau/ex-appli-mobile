import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
    container:{
        alignItems:'center',
    },

    viewAddButton:{
        flexDirection:'row',
        alignItems:'center',
        padding:5,
        backgroundColor:'#355A86'
    },

    viewButton:{
        flexDirection:'row',
        alignItems:'center',
        padding:5,
        backgroundColor:'#2196F3' 
    },

    icon:{
        width:22,
        height:22,
        marginLeft:3
    },

    text:{
        color:'white',
        fontSize:14,
        fontWeight:'bold',
    }
});