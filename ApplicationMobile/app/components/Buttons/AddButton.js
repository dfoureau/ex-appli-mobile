import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const AddButton = ({text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.viewAddButton}>
            <Text style={styles.text}>{text}</Text>
            <Image style={styles.icon} source={require('../../images/icons/add.png')}/>
        </View>
    </TouchableOpacity>
);

AddButton.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default AddButton;