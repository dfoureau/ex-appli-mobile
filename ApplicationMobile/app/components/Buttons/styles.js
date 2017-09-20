import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
    container:{
        alignItems:'center',
    },

    view:{
        flexDirection:'row',
        alignItems:'center',
        padding:5,
        marginLeft:5,
        backgroundColor:'#355A86',
    },

    viewValider: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    
    viewSupprimer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#cf2a27',
    },
    viewOk: {
        paddingLeft:20,
        paddingRight: 20,
    },

    text:{
        color:'white',
        fontSize:14,
        fontWeight:'bold'
    }
});