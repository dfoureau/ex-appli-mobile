import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const Button = ({textStyles, buttonStyles, text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.view, buttonStyles]}>
            <Text style={[styles.text, textStyles]}>{text}</Text>
        </View>
    </TouchableOpacity>
);

Button.PropTypes = {
    textStyles: PropTypes.shape(),
    buttonStyles : PropTypes.shape(),
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default Button;