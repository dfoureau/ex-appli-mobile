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
  KeyboardAvoidingView,
  StatusBar,
  Linking,
  Keyboard,
  BackHandler,
} from "react-native";
import CheckBox from "react-native-check-box";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./Styles";
import Accueil from "../accueil/Accueil";
import service from "../../realm/service";

import configurationAppli from "../../configuration/Configuration";
import configAccueil from "../../configuration/ConfigAccueil";
import configNews from "../../configuration/ConfigNews";
import configAnnuaire from "../../configuration/ConfigAnnuaire";
import moment from "moment";
import jwt_decode from "jwt-decode";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

const CONNEXION_PARAMS_SCHEMA = "ConnexionParams";

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  setInitialValues() {
    configurationAppli.clean();
    configNews.clean();
    configAccueil.clean();
    configAnnuaire.clean();

    // on vérifie si des paramètres de connexion existent pour l'utilisateur
    let connexionParams =
      service.get(CONNEXION_PARAMS_SCHEMA).length > 0
        ? service.get(CONNEXION_PARAMS_SCHEMA)[0]
        : null;

    //On définit les différentes variables
    this.state = {
      login: connexionParams != null ? connexionParams.login : "",
      mdp: connexionParams != null ? connexionParams.mdp : "",
      saveIdChecked: connexionParams != null ? true : false,
      token: "",
      data: [],
      isReady: false,
      webServiceLien1: configurationAppli.apiURL + "login",
      obj: {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "",
      },
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPress);
  }

  backPress() {
    return true;
  }

  async seConnecter() {
    Keyboard.dismiss();
    showLoading("Connexion en cours. Veuillez patientier...");

    try {
      // Récupérer login/mdp
      this.state.obj.body =
        "login=" + this.state.login + "&password=" + this.state.mdp;

      // On se connecte
      let response = await fetch(this.state.webServiceLien1, this.state.obj);
      let res = await response.json();
      if (response.status >= 200 && response.status < 300) {
        this.setState({
          error: "",
          isReady: true,
          data: res,
        });
      } else if (response.status == 400) {
        let error = "Erreur : Login et/ou mot de passe incorrect";
        throw error;
      } else {
        let error =
          "Erreur de connexion aux services de l'espace collaborateur";
        throw error;
      }
    } catch (error) {
      hideLoading();
      let id = showToast(error);
    }
	
	
    // On supprime automatiquement les paramètres de connexion en cache
    service.delete(CONNEXION_PARAMS_SCHEMA);

    if (this.state.saveIdChecked) {
      let connexionParams = {
        login: this.state.login != null ? this.state.login : "",
        mdp: this.state.mdp != null ? this.state.mdp : "",
        // TODO récupérer le token après appel au service REST
        tokenREST: "",
      };
      // on insére les nouveaux paramètres de connexion en cache
      service.insert(CONNEXION_PARAMS_SCHEMA, connexionParams);
    }

    if (this.state.isReady === true) {
      // Décocer le token JWT
      let tokenDecode = jwt_decode(this.state.data.token);
      // Expiration - 30 secondes pour éviter les effets de bords
      let tokenDecodeExpiration = tokenDecode.exp - 30;

      // Enregistrer les données dans l'application, puis naviguer vers la page d'accueil
      configurationAppli.userID = this.state.data.id;
      configurationAppli.userToken = this.state.data.token;
      configurationAppli.idAgence = this.state.data.idAgence;
      configurationAppli.indemKM = this.state.data.indemKM;
      configAnnuaire.idAgenceDefaut = this.state.data.idAgence;
      configurationAppli.expirationToken = tokenDecodeExpiration;
      hideLoading();
      BackHandler.removeEventListener("hardwareBackPress", this.backPress);
      this.props.navigation.navigate("Accueil", { mess_info: this.state.data.mess_info } );
    }
  }

  // Modification checkbox de sauvgarde des ids
  handleChecked() {
    this.setState(prevState => ({
      saveIdChecked: !prevState.saveIdChecked,
    }));
  }

  render() {
    let lienMdpOublie = configurationAppli.lienMdpOublie;

    return (
      <KeyboardAvoidingView behavior="padding" style={Style.mainView}>
        <StatusBar backgroundColor="#355a86" barStyle="light-content" />
        <View style={Style.logoContainer}>
          <Image style={Style.logo} source={require("../../images/logo.png")} />
        </View>

        <View style={Style.formContainer}>
          <TextInput
            placeholder="Login"
            value={this.state.login}
            style={Style.input}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            onSubmitEditing={() => this.passwordInput.focus()}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            onChangeText={text => this.setState({ login: text })}
          />
          <TextInput
            placeholder="Mot de passe"
            value={this.state.mdp}
            secureTextEntry={true}
            style={Style.input}
            returnKeyType="go"
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            ref={input => (this.passwordInput = input)}
            onChangeText={text => this.setState({ mdp: text })}
            onSubmitEditing={() => this.seConnecter()}
          />
          <CheckBox
            onClick={() => this.handleChecked()}
            isChecked={this.state.saveIdChecked}
            rightText="Se souvenir de moi"
            rightTextStyle={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 16 }}
            style={Style.checkbox}
            checkBoxColor="rgba(255, 255, 255, 0.7)"
          />
          <Button
            title="Se connecter"
            onPress={() => this.seConnecter()}
            style={Style.btnSeconnecter}
          />
          <View style={Style.viewMdpOublie}>
            <TouchableHighlight
              underlayColor="rgba(255, 255, 255, 0.2)"
              onPress={() => Linking.openURL(lienMdpOublie)}
              style={Style.touchMdpOublie}
            >
              <Text style={Style.txtMdpOublie}>Mot de passe oublié</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAvoidingView>
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
