import React, {PropTypes} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const SupprimerButton = ({text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.view, styles.viewSupprimer]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableOpacity>
);

SupprimerButton.PropTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default SupprimerButton;