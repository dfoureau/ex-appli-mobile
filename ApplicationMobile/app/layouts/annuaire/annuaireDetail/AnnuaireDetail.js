"use strict";
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
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import styles from "./styles";

import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { ContainerHeader } from "../../../components/containerHeader";

import Communications from "react-native-communications";

var { height, width } = Dimensions.get("window");

class AnnuaireDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titre: "Alain AFFLELOU",
      //On définit les différentes variables
      id: this.props.navigation.state.params.cle,
      list: {
        key: "3",
        nom: "AFFELOU",
        prenom: "Alain",
        entite: "CAT-AMANIA",
        fonction: "Directeur d'agence",
        agence: "Nantes",
        telMobile: "06.06.06.06.06",
        telFixe: "02.02.02.02.02",
        email1: "a.afflelou@email.cat.client.com",
        email2: "a.afflelou@email.cat.com",
      },
    };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  /**Retour vers la page précédente */
  retour() {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  handleSmsDisplay(tel) {
    let arr = tel.split(".");
    console.log(arr[0]);
    if (arr[0] == "06" || arr[0] == "07") {
      return (
        <TouchableOpacity onPress={() => Communications.text(tel)}>
          <View>
            <Image
              style={styles.icon}
              source={require("../../../images/icons/bulles.png")}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View>
        <ContainerTitre
          title={this.state.titre}
          navigation={this.props.navigation}
        >
          <View style={styles.scrollView}>
            {/*DESCRIPTION PROFILE*/}
            <View style={Style.firstView}>
              <View style={Style.secondView}>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.text}>
                      Entité: {this.state.list.entite}
                    </Text>
                    <Text style={styles.text}>
                      Fonction: {this.state.list.fonction}
                    </Text>
                    <Text style={styles.text}>
                      Agence: {this.state.list.agence}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerIcon}>
                <Image
                  style={styles.iconProfile}
                  source={require("../../../images/imageProfilDefault.png")}
                />
              </View>
            </View>

            {/*TELEPHONE 1*/}
            <View style={[Style.firstView, styles.firstSection]}>
              <View style={Style.secondView}>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.text}>{this.state.list.telMobile}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerIcon}>
                {this.handleSmsDisplay(this.state.list.telMobile)}
              </View>
              <View style={styles.containerIcon}>
                <TouchableOpacity
                  onPress={() =>
                    Communications.phonecall(this.state.list.telMobile, true)}
                >
                  <View>
                    <Image
                      style={styles.icon}
                      source={require("../../../images/icons/tel.png")}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/*TELEPHONE 2*/}
            <View style={[Style.firstView, styles.secondSection]}>
              <View style={Style.secondView}>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.text}>{this.state.list.telFixe}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerIcon}>
                {this.handleSmsDisplay(this.state.list.telFixe)}
              </View>
              <View style={styles.containerIcon}>
                <TouchableOpacity
                  onPress={() =>
                    Communications.phonecall(this.state.list.telFixe, true)}
                >
                  <View>
                    <Image
                      style={styles.icon}
                      source={require("../../../images/icons/tel.png")}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/*EMAIL 1 */}
            <View style={[Style.firstView, styles.firstSection]}>
              <View style={Style.secondView}>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.text}>{this.state.list.email1}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerIcon}>
                <TouchableOpacity
                  onPress={() =>
                    Communications.email(
                      [this.state.list.email1],
                      null,
                      null,
                      null,
                      null
                    )}
                >
                  <View>
                    <Image
                      style={styles.icon}
                      source={require("../../../images/icons/email.png")}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/*EMAIL 2*/}
            <View style={[Style.firstView, styles.secondSection]}>
              <View style={Style.secondView}>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.text}>{this.state.list.email2}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerIcon}>
                <TouchableOpacity
                  onPress={() =>
                    Communications.email(
                      [this.state.list.email2],
                      null,
                      null,
                      null,
                      null
                    )}
                >
                  <View>
                    <Image
                      style={styles.icon}
                      source={require("../../../images/icons/email.png")}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ContainerTitre>
      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  AnnuaireDetail: {
    screen: AnnuaireDetail,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
