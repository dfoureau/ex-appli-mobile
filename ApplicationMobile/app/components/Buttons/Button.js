import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Button = ({textStyles, buttonStyles, text, onPress}) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.view, buttonStyles]}>
            <Text style={[styles.text, textStyles]}>{text}</Text>
        </View>
    </TouchableOpacity>
);

Button.propTypes = {
    textStyles: Text.propTypes.style,
    buttonStyles : View.propTypes.style,
    text: PropTypes.string,
    onPress: PropTypes.func
};

export default Button;