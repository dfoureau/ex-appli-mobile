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

import Style from "../../styles/Styles";

export default class CRAItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      date: props.date,
      client: props.client,
      status: props.status,
      manyElt: props.manyElt,
      hideDate: props.hideDate,
    };
  }
  render() {
    return (
      <View
        style={
          !this.state.manyElt ? Style.firstViewCRA : Style.firstViewCRANoMargin
        }
      >
        <View style={Style.secondView}>
          <Text>Client : {this.state.client}</Text>
          <View style={Style.fourthView}>
            <View>
              <Image
                style={Style.craIcon}
                source={
                  this.state.status == 1
                    ? require("../../images/icons/check2.png")
                    : null
                }
              />
            </View>
          </View>
          <Text>
            Etat :{" "}
            {this.state.status == 1
              ? "Validé"
              : this.state.status == 2 ? "Brouillon" : "En cours de validation"}
          </Text>
        </View>
      </View>
    );
  }
}
