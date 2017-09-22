import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
      
    mainContainer: {
        flex: 1
      },
    container: {
        marginRight: 15,
        marginLeft: 15,
    },
    scrollView: {
        flex: 1
    },
    containerEtat: {
        marginTop: 5,
    },
    containerCalendar: {
        marginTop: 10,
        flex: 1,
        height: 380,
    },
    containerDetails: {
        flex: 1,
        flexDirection: 'column',
    },
    containerInput: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    inputView: {
        marginLeft: 15
    },
    checkbox: {
        marginTop: 10,
        marginBottom: 10
    },
    inputComponent: {
        width: 300,
        height:35,
        backgroundColor:'#FFFFFF',
        borderRadius:3,
        fontSize:15,
        padding:0,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:2,
        marginBottom: 10,
        marginTop: 5, 
    },
    inputComponentRow: {
        width: 174,
    },
    inputComponentSmall: {
        width: 152
    },
    inputGroup: {
        flex:1, 
        flexDirection: 'row',
    }, 
    inputText: {
        width: 125,
        marginRight: 5,
        paddingTop: 10,
    },
    inputTextSmall: {
        width: 145,
    },
    text: {
        color: 'black',
        fontSize: 16,
      },
    containerButton:{
        alignItems : 'center',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight:30,
        marginBottom: 5,
        marginTop: 5
    },
    deleteButton: {
        backgroundColor: '#FF0000'
    },
  
});
