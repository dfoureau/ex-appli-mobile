import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const Button = ({text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.view}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableOpacity>
);

Button.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default Button;