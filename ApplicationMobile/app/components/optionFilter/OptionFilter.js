import React from "react";
import { View, Text, Picker } from "react-native";
import styles from "./styles";

class OptionFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.ContainerOptionFilter}>
        <Text style={styles.LabelOptionFilter} adjustsFontSizeToFitWidth="true">
          Agence
        </Text>
        <Picker
          style={styles.OptionFilter}
          selectedValue={this.state.city}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ idAgence: itemValue })}
        >
          <Picker.Item label="Ile de France" value="1" />
          <Picker.Item label="Atlantique" value="3" />
          <Picker.Item label="Niort" value="4" />
          <Picker.Item label="Tours" value="5" />
          <Picker.Item label="Orléans" value="9" />
          <Picker.Item label="Lille" value="11" />
          <Picker.Item label="Bordeaux" value="12" />
          <Picker.Item label="Rabat" value="13" />
          <Picker.Item label="Lyon" value="14" />
          <Picker.Item label="Luxembourg" value="15" />
          <Picker.Item label="Toulouse" value="16" />
          <Picker.Item label="Rennes" value="17" />
        </Picker>
      </View>
    );
  }
}

export default OptionFilter;
