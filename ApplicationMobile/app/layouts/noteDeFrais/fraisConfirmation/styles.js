import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        alignItems : 'center',
    },
    containerButton:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems : 'center',
        alignSelf: 'flex-end',
        marginRight:30,
        marginTop:30,
    },
    containerText: {
        width: width-50,
        flex: 1,
        marginTop: 25,
    },
    confirmationText: {
        color: 'black',
        fontSize: 16,
    },
    OkButton: {
        paddingLeft:20,
        paddingRight: 20,
    }
});