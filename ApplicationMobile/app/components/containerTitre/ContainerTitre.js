import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Button,
  Image,
  TouchableHighlight,
  Text,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import styles from "./styles";

import Connexion from "../../layouts/connexion/Connexion";

import moment from "moment";
import Menu from "../menu/Menu";
import configurationAppli from "../../configuration/Configuration";

var { height, width } = Dimensions.get("window");

export default class ContainerTitre extends React.Component {
  /**Parametres */
  static propTypes = {
    title: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    console.log("Constructeur Container Titre : " + this.props.title);
    if (moment().unix() > configurationAppli.expirationToken) {
      this.deconnexion();
    }
    else {
      this.state = {
        pan: new Animated.ValueXY({ x: -width, y: 0 }),
        isOpen: false,
        navigationParent: null,
      };
    }

  }

  /**Retour vers la page précédente */
  retour() {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  deconnexion() {
    configurationAppli.clean();
    // configNews.clean();
    // configAccueil.clean();
    // configAnnuaire.clean();
    this.afficherEcran("Connexion");
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.ContainerHeader}>
            <TouchableHighlight
              style={styles.MenuIconLink}
              onPress={() => this.retour()}
            >
              <Image
                style={styles.MenuIcon}
                source={require("../../images/icons/retour.png")}
              />
            </TouchableHighlight>
            <Image
              style={styles.LogoTitreCat}
              source={require("../../images/logo.png")}
            />
            <Text style={styles.TextHeader}>{this.props.title}</Text>
          </View>

          {/* On indique qu'on affiche les donnée de l'enfant */}
          {this.props.children}
        </ScrollView>
      </View>
    );
  }
}

//Il faut exporteer la na vigation ou bien la classe
//export default ContainerAccueil;
