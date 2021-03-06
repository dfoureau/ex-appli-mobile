import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Image,
  Picker,
  TouchableHighlight,
} from "react-native";

import Style from "./styles";

export default class CRAItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      date: props.date,
      client: props.client,
      status: props.status,
      libelle: props.libelle,
      hideDate: props.hideDate,
      Id: props.Id,
    };
  }
  render() {
    return (
      <View style={Style.containerList}>
        <View style={Style.containerPeriod}>
          <Text>Client : {this.state.client}</Text>
          <View style={Style.containerIcon}>
            {this.state.status == 3 && (
              <Icon name="check" size={20} color="#2268d8" />
            )}
          </View>
        </View>
        <View>
          <Text>État : {this.state.libelle}</Text>
        </View>
      </View>
    );
  }
}
