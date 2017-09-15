import React, {PropTypes} from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styles from './styles';

const Button = ({text, onPress}) => (
    <TouchableHighlight  style={styles.container} onPress={onPress}>
        <View style={styles.viewButton}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableHighlight >
);

Button.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default Button;