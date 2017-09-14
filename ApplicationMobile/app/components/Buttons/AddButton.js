import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const AddButton = ({text, onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <View>
            <Text></Text>
            <Image source={require('../../images/icons/add.png')}/>
        </View>
    </TouchableOpacity>
);

AddButton.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default AddButton;