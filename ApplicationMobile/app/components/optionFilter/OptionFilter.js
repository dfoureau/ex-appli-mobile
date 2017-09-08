import React from 'react';
import { View, Text, Picker } from 'react-native';

import styles from './styles';

const OptionFilter = () => (

    <View style={styles.ContainerOptionFilter}>
        <Text style={styles.LabelOptionFilter} adjustsFontSizeToFitWidth='true'>Agence</Text>
        <Picker style={styles.OptionFilter}>
            <Picker.Item label="Nantes" value="java" />
            <Picker.Item label="Paris" value="js" />
            <Picker.Item label="Rennes" value="js" />
            <Picker.Item label="Niort" value="js" />
            <Picker.Item label="Toulouse" value="js" />
        </Picker>
    </View>

);

export default OptionFilter;