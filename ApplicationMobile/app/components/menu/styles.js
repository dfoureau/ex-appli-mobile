import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({

    ContainerMenu: {      
        width: width*0.6, 
        height: height-24, 
        backgroundColor: '#FFF', 
        position: 'absolute',
        paddingTop: 60,
        zIndex: 1000, 
    },

    CloseMenuButton: {
        width: 20,
        height: 20,             
        position: 'absolute', 
        right: 15, 
        top: 15,
        backgroundColor: 'transparent',
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

    LastItemMenu: {             
        position: 'absolute', 
        bottom: 0,
        left: 6,
        width: width*0.6,
        zIndex: 5000, 
    },

    LastItemMenuIcon: {             
        position: 'absolute', 
        right: 18,
        bottom: -3,
        width: 24,
        height: 24,
    },

    IconItemMenu: {               
        width: 36, 
        height: 36,
    },

    TextItemMenu: {                      
        color: '#000000', 
        fontSize: 16,
        position: 'relative', 
        left: 44, 
        bottom: 28, 
    },

    ContainerOpaque: {
        width: width, 
        height: height, 
        backgroundColor: '#000', 
        opacity: 0.5,
        position: 'absolute', 
        zIndex: 500,
    }

});