import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const ValiderButton = ({text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.view, styles.viewValider]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableOpacity>
);

ValiderButton.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default ValiderButton;