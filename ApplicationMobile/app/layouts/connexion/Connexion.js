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
} from "react-native";
import CheckBox from "react-native-check-box";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./Styles";
import Accueil from "../accueil/Accueil";
import service from "../../realm/service";

const CONNEXION_PARAMS_SCHEMA = "ConnexionParams";

var { height, width } = Dimensions.get("window");

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  setInitialValues() {
    // on vérifie si des paramètres de connexion existent pour l'utilisateur
    var connexionParams =
      service.get(CONNEXION_PARAMS_SCHEMA).length > 0
        ? service.get(CONNEXION_PARAMS_SCHEMA)[0]
        : null;

    //On définit les différentes variables
    this.state = {
      login: connexionParams != null ? connexionParams.login : "",
      mdp: connexionParams != null ? connexionParams.mdp : "",
      saveIdChecked: connexionParams != null ? true : false,
    };
  }

  mdpOublie(text) {}

  seConnecter() {
    // On supprime automatiquement les paramètres de connexion en cache
    service.delete(CONNEXION_PARAMS_SCHEMA);

    if (this.state.saveIdChecked) {
      var connexionParams = {
        login: this.state.login != null ? this.state.login : "",
        mdp: this.state.mdp != null ? this.state.mdp : "",
        // TODO récupérer le token après appel au service REST
        tokenREST: "",
      };
      // on insére les nouveaux paramètres de connexion en cache
      service.insert(CONNEXION_PARAMS_SCHEMA, connexionParams);
    }

    this.props.navigation.navigate("Accueil");
    if (this.state.mdp == "admin") {
      this.props.navigation.navigate("Accueil");
    }
  }

  // Modification checkbox de sauvgarde des ids
  handleChecked() {
    this.setState(prevState => ({
      saveIdChecked: !prevState.saveIdChecked,
    }));
  }

  render() {
    return (
      <ScrollView style={Style.scrollView}>
        <View style={{ flex: 1 }}>
          <View style={Style.viewContainer}>
            <Image source={require("../../images/logo.png")} />
          </View>
          <View style={Style.viewChamps}>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 320 }}>
                <View style={Style.inputContainer}>
                  <TextInput
                    placeholder="Login"
                    value={this.state.login}
                    style={Style.input}
                    onChangeText={text => this.setState({ login: text })}
                  />
                </View>
                <View style={Style.inputContainer}>
                  <TextInput
                    placeholder="Mot de passe"
                    value={this.state.mdp}
                    secureTextEntry={true}
                    style={Style.input}
                    onChangeText={text => this.setState({ mdp: text })}
                  />
                </View>

                <CheckBox
                  onClick={() => this.handleChecked()}
                  isChecked={this.state.saveIdChecked}
                  rightText="Se souvenir de moi"
                  rightTextStyle={{ color: "white", fontSize: 16 }}
                  style={Style.checkbox}
                  checkBoxColor="white"
                />
              </View>
              <View style={Style.viewSeConnecter}>
                <Button
                  title="Se connecter"
                  onPress={() => this.seConnecter()}
                  style={Style.btnSeconnecter}
                />
              </View>
              <View style={Style.viewMdpOublie}>
                <TouchableHighlight
                  onPress={() => this.mdpOublie()}
                  style={Style.touchMdpOublie}
                >
                  <Text style={Style.txtMdpOublie}>Mot de passe oublié</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  Connexion: {
    screen: Connexion,
    navigationOptions: { header: null },
  },
  Accueil: {
    screen: Accueil,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
AppRegistry.registerComponent("CatAmania", () => navigation);
