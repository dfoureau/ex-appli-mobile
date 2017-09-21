import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        margin:10,
        overflow:'hidden'
    },

    titleContainer: {
        flexDirection:'row'
    },

    title: {
        flex: 1,
        padding: 10,
        color:'#2a2f43',
        fontWeight:'bold'
    },

    buttonImage: {
        width: 15,
        height: 15,
        backgroundColor: 'transparent'
    },

    body:{
        padding: 10,
        paddingTop: 0
    }
});