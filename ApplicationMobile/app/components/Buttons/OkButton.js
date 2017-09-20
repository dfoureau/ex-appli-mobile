import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const OkButton = ({text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.view, styles.viewOk]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableOpacity>
);

OkButton.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default OkButton;