import React, { Component } from "react";
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
            <Image
              style={Style.listIcon}
              source={
                this.state.status == 3
                  ? require("../../images/icons/check2.png")
                  : null
              }
            />
          </View>
        </View>
        <View>
          <Text>Etat : {this.state.libelle}</Text>
        </View>
      </View>
    );
  }
}
