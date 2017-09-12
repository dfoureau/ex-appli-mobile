import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({

    ContainerHeader: {
        backgroundColor: '#355a86',
        height: 56, 
        width: width,
    },

    MenuIcon: {
        height: 40, 
        width: 40,
    },

    MenuIconLink: {
        height: 40, 
        width: 40,
        position: 'absolute', 
        top: 8, 
        left: 10, 
    },

    TextHeader: {
        color: '#FFFFFF', 
        fontSize: 24,
        position: 'absolute', 
        left: 60, 
        top: 11,

    },

});