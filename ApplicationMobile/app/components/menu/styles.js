import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({

    ContainerMenu: {      
        width: width*0.6, 
        height: height-24, 
        backgroundColor: '#FFF', 
        paddingTop: 5,
        zIndex: 1000
    },

    ContainerTop: {
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10
    },

    Logo: {
        width:150,
        height:45,
        backgroundColor: 'transparent'
    },

    CloseMenuButton: {
        width: 20,
        height: 20,             
        right: 15, 
        top: 15,
        position: 'absolute',
        backgroundColor: 'transparent',
        alignSelf:'flex-end'
    },

    CloseIcon: {
        width: 20,
        height: 20,             
    },

    ItemMenu: {             
        paddingLeft: 10,
        paddingTop: 5,
        height: 50,
    },
    
    ItemMenuView: {
        flexDirection:'row', 
        alignItems:'center',
    },

    LastItemMenuLeft: {             
        position: 'absolute', 
        bottom: 0,
        left: 8,
        width: width*0.6*0.5,
    },

    LastItemMenuRight: {             
        position: 'absolute', 
        bottom: 0,
        right: 12,
        width: 35,
    },

    LastItemMenuIcon: {             
        width: 24,
        height: 24,
    },

    IconItemMenu: {               
        width: 36, 
        height: 36,
    },

    IconItemRight: {
        width:16, 
        height:16, 
        right:50,
        bottom: 7,
    },

    TextItemMenu: {                      
        flex:1, 
        color: '#000000', 
        fontSize: 16,
        marginLeft: 8,
    },

    ContainerOpaque: {
        width: width, 
        height: height, 
        backgroundColor: '#000', 
        opacity: 0.5,
        position: 'absolute', 
        zIndex: 500,
    },

    
    buttonOpaque: {
        width: width,
        height: height,             
        position: 'absolute', 
        right: 15, 
        top: 15,
        backgroundColor: 'transparent',
    },

});