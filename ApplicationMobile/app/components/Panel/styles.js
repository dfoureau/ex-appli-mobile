import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        marginTop:10,
        //marginHorizontal:10,
        borderWidth:0.5,
        borderColor: "#808080",
        borderRadius:5,
        overflow:'hidden'
    },

    titleContainer: {
       // flexDirection:'row',
        paddingVertical: 5,
        //alignItems: 'center'
    },

    title: {
        flex:1,
        paddingHorizontal:10,
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
    },

    buttonContainer: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
    },
    button:{
        height: 30
    },

    buttonImage: {
        marginRight:10,
        width: 15,
        height: 15,
        backgroundColor: 'transparent'
    },

    body:{
        padding: 10,
        paddingTop: 0
    }
});