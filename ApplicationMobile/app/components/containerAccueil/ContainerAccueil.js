import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import styles from "./styles";

import Menu from "../menu/Menu";

import moment from "moment";

import configurationAppli from "../../configuration/Configuration";
import configAccueil from "../../configuration/ConfigAccueil";
import configNews from "../../configuration/ConfigNews";
import configAnnuaire from "../../configuration/ConfigAnnuaire";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

var { height, width } = Dimensions.get("window");

export default class ContainerAccueil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({ x: -width, y: 0 }),
      isOpen: false,
      navigationParent: null,
    };
  }

  componentWillMount() {
    if (moment().unix() > configurationAppli.expirationToken) {
      this.deconnexion();
    }
  }

  afficherCloseMenu() {
    if (this.state.isOpen) {
      this.closeView();
    } else {
      this.openView();
    }
    this.state.isOpen = !this.state.isOpen;
  }

  closeView() {
    Animated.timing(this.state.pan, {
      toValue: { x: -width, y: 0 },
      //easing: Easing.back,
      duration: 600,
    }).start();
  }
  openView() {
    Animated.timing(this.state.pan, {
      toValue: { x: 0, y: 0 },
      //easing: Easing.back,
      duration: 600,
    }).start();
  }

  afficherEcranContainer(ecran) {
    this.props.afficherEcran(ecran);
  }

  deconnexion() {
    showToast("Token expiré. Veuillez vous reconnecter.");
    configurationAppli.clean();
    configNews.clean();
    configAccueil.clean();
    configAnnuaire.clean();
    this.afficherEcranContainer("Connexion");
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.ContainerHeader}>
            <TouchableOpacity
              style={styles.MenuIconLink}
              onPress={() => this.afficherCloseMenu()}
            >
              <Image
                style={styles.MenuIcon}
                source={require("../../images/icons/MenuIcon.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.LogoTitreCat}
              source={require("../../images/logo.png")}
            />
            <Text style={styles.TextHeader}>{this.props.title}</Text>
          </View>

          {/* On indique qu'on affiche les donnée de l'enfant */}
          {this.props.children}
        </ScrollView>

        <Animated.View
          style={{
            //...this.props.style,
            position: "absolute",
            width: width,
            height: height,
            transform: this.state.pan.getTranslateTransform(), // Bind opacity to animated value
          }}
        >
          <Menu
            afficherEcran={this.afficherEcranContainer.bind(this)}
            fermerMenu={this.afficherCloseMenu.bind(this)}
          />
        </Animated.View>
      </View>
    );
  }
}
