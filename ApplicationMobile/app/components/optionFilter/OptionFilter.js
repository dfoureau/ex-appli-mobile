import React from 'react';
import { View, Text, Picker } from 'react-native';

import styles from './styles';

class OptionFilter extends React.Component{
    constructor (props) {
        super(props)
        this.state = {  }
	}
    render(){
        
            return(
                <View style={styles.ContainerOptionFilter}>
                <Text style={styles.LabelOptionFilter} adjustsFontSizeToFitWidth='true'>Agence</Text>
                <Picker style={styles.OptionFilter} 
                        selectedValue={this.state.city}
                        onValueChange={(itemValue, itemIndex) => this.setState({city: itemValue})}>
                    <Picker.Item label="Nantes" value="0" />
                    <Picker.Item label="Paris" value="1" />
                    <Picker.Item label="Rennes" value="2" />
                    <Picker.Item label="Niort" value="3" />
                    <Picker.Item label="Toulouse" value="4" />
                </Picker>
            </View>
            );       
    }

}


export default OptionFilter;