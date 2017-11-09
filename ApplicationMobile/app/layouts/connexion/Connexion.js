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
  Modal,
  ActivityIndicator,
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
      modalVisible: false,
    };
  }

  mdpOublie(text) {}

  seConnecter() {

    /*
    Alert.alert(
      "Veuillez patienter",
      "Connexion au service en cours...",
      [],
      { cancelable: false }
    );*/

    this.setModalVisible(true);

    this.props.navigation.navigate("Accueil");

    this.setModalVisible(false);

    /*
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
    }*/
  }

  // Modification checkbox de sauvgarde des ids
  handleChecked() {
    this.setState(prevState => ({
      saveIdChecked: !prevState.saveIdChecked,
    }));
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={Style.mainView}>
        <StatusBar backgroundColor="#355a86" barStyle="light-content" />

        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {}}
          >
          <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#00000080',
          alignItems: 'center'}}>
          <View style={{
            width: 250,
            height: 200,
            backgroundColor: '#fff',
            padding: 20,}}>

              <ActivityIndicator
                color="#8b008b"
                size="large"
                style={Style.loader}
                />
              <Text style={Style.texte}>
                Connexion en cours, veuillez patienter.
              </Text>
              </View>
          </View>
        </Modal>

        <View style={Style.logoContainer}>
          <Image
            style={Style.logo}
            source={require("../../images/logo.png")}
            />
       </View>

        <View style={Style.formContainer}>
          <TextInput
            placeholder="Login"
            value={this.state.login}
            style={Style.input}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus={true}
            underlineColorAndroid='transparent'
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
            underlineColorAndroid='transparent'
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            ref={(input) => this.passwordInput = input}
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
              underlayColor = "rgba(255, 255, 255, 0.2)"
              onPress={() => this.mdpOublie()}
              style={Style.touchMdpOublie}
            >
              <Text style={Style.txtMdpOublie}>
                Mot de passe oublié
              </Text>
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
