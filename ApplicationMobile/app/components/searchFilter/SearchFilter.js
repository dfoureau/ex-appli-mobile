import React, { Component } from "react";
import { View, TextInput, Image } from "react-native";

import styles from "./styles";

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View>
        <TextInput
          style={styles.SearchFilter}
          placeholder="Rechercher"
          placeholderTextColor="#000000"
          underlineColorAndroid={"transparent"}
          onChangeText={text => this.setState({ text: text })}
        />
        <Image
          style={styles.SearchIcon}
          source={require("../../images/icons/SearchIcon.png")}
        />
      </View>
    );
  }
}

export default SearchFilter;
