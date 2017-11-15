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
  ActivityIndicator,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import styles from "./styles";

import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { ContainerHeader } from "../../../components/containerHeader";

import Communications from "react-native-communications";

import configurationAppli from "../../../configuration/Configuration";

var { height, width } = Dimensions.get("window");

class AnnuaireDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titre: "",
      //On définit les différentes variables
      id: this.props.navigation.state.params.cle,
      idReady: false,
      list: [],
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
    if (null != tel) {
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
  }

  componentDidMount() {
    requestURL = configurationAppli.apiURL + 'annuaire/user/' + this.state.id;
    return fetch(requestURL)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        'list': responseJson,
        isReady: true,
        titre: responseJson[0]['prenom'] + " " + responseJson[0]['nom'],
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (!this.state.isReady) {
      return (   
      <View>
      <ContainerTitre
        title={this.state.title}
        navigation={this.props.navigation}
      >
        <ActivityIndicator
        color="#8b008b"
        size="large"
        style={Style.loader}
         />
        <Text style={Style.texteLoader}>
          Récupération des données. Veuillez patienter.
        </Text>

        </ContainerTitre>
      </View>
      )
    } else {
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
                        Entité : {this.state.list[0]['nomEntite']}
                      </Text>
                      <Text style={styles.text}>
                        Fonction : {this.state.list[0]['libelle']}
                      </Text>
                      <Text style={styles.text}>
                        Agence : {this.state.list[0]['agence']}
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
              {this.state.list[0]['telmobile'] != "" && 
              <View style={[Style.firstView, styles.firstSection]}>
                <View style={Style.secondView}>
                  <View style={styles.container}>
                    <View style={styles.containerRow}>
                      <Text style={styles.text}>{this.state.list[0]['telmobile']}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.containerIcon}>
                  {this.handleSmsDisplay(this.state.list[0]['telmobile'])}
                </View>
                <View style={styles.containerIcon}>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.phonecall(this.state.list[0]['telmobile'], true)}
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
              }

              {/*TELEPHONE 2*/}
              {this.state.list[0]['telclient'] != "" && 
              <View style={[Style.firstView, styles.secondSection]}>
                <View style={Style.secondView}>
                  <View style={styles.container}>
                    <View style={styles.containerRow}>
                      <Text style={styles.text}>{this.state.list[0]['telclient']}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.containerIcon}>
                  {this.handleSmsDisplay(this.state.list[0]['telclient'])}
                </View>
                <View style={styles.containerIcon}>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.phonecall(this.state.list[0]['telclient'], true)}
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
              }

              {/*EMAIL 1 */}
              {this.state.list[0]['mail'] != "" && 
              <View style={[Style.firstView, styles.firstSection]}>
                <View style={Style.secondView}>
                  <View style={styles.container}>
                    <View style={styles.containerRow}>
                      <Text style={styles.text}>{this.state.list[0]['mail']}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.containerIcon}>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.email(
                        [this.state.list[0]['mail']],
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
              }

              {/*EMAIL 2*/}
              {this.state.list[0]['mailclient'] != "" && 
              <View style={[Style.firstView, styles.secondSection]}>
                <View style={Style.secondView}>
                  <View style={styles.container}>
                    <View style={styles.containerRow}>
                      <Text style={styles.text}>{this.state.list[0]['mailclient']}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.containerIcon}>
                  <TouchableOpacity
                    onPress={() =>
                      Communications.email(
                        [this.state.list[0]['mailclient']],
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
              }

            </View>
          </ContainerTitre>
        </View>
      );
    }
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
