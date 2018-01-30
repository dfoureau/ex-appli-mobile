import React from "react";
import { View, Text, Linking, TouchableHighlight, ActivityIndicator } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ScrollingMessageView from "react-native-auto-scrolling-message";
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import configurationAppli from "../../../configuration/Configuration";

class APropos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "À Propos",
      appversion: configurationAppli.appversion,
      isReady: false,
      webServiceLien: configurationAppli.apiURL + "app/version",
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
    };
  }

  componentDidMount() {
    if (this.state.appversion != null) {
      this.setState({
        isReady: true,
      });
      return;
    } else {
      let that = this;
      fetch(this.state.webServiceLien, this.state.obj)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(function(foncapp) {
          that.setState({ appversion: foncapp, isReady: true });
          configurationAppli.appversion = foncapp;
        });
    }
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    let lienSupportJira = configurationAppli.lienSupportJira;

    if (!this.state.isReady) {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <ActivityIndicator
              color="#8b008b"
              size="large"
              style={StyleGeneral.loader}
            />
            <Text style={StyleGeneral.texteLoader}>
              Récupération des données. Veuillez patienter...
            </Text>
          </ContainerAccueil>
        </View>
      );
    } else {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <View style={{ paddingVertical: 20 }}>
              <Text style={Style.texte}>
                Dans le but de favoriser l'interaction en mobilité avec
                l'entreprise et entre les collaborateurs, CAT-AMANIA fourni a ses
                collaborateurs des smartphones dans le cadre du projet SMART
                CONNEXION.
                {"\n"}
                Avec cette application, le projet SMART CONNEXION fournit aux
                collaborateurs un accès à l'espace collaborateur directement
                depuis leur smartphones à travers d'une application mobile.
                {"\n"}
                Cette dernière a été développée par le programme INNOVA grâce à
                votre collaboration et vos travaux au sein d'INNOVA.
              </Text>

              <Text style={Style.texte}>
                Tous droits réservés &copy; 2017 Cat-Amania
              </Text>

              <Text style={Style.texte}>Version : 1.0.1</Text>
              <Text style={Style.texte}>Dernière version disponible : {this.state.appversion.appversion}</Text>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => Linking.openURL(lienSupportJira)}
              >
                <Text style={Style.texteLien}>
                  Envoyer un rapport de bug ou une demande d'aide
                </Text>
              </TouchableHighlight>

              <Text style={Style.texte}>
                Nous remercions, en particulier, toutes les personnes, par ordre
                alphabétique, qui ont participé au développement de l'application
                dans toutes ses phases (pilotage, spécifications, développement,
                recette, etc.) :
              </Text>

              <ScrollingMessageView
                height={120}
                childrenHeight={100}
                duration={2000}
                containerStyle={{ backgroundColor: "transparent" }}
                childrenStyle={{}}
              >
                <Text style={Style.texte}>
                  Zakaria AKLI
                  {"\n"}
                  Jonathan ALAMI
                  {"\n"}
                  Marie-Charlotte BARBOTIN
                  {"\n"}
                  Fabrice CADU
                </Text>
                <Text style={Style.texte}>
                  Maxime CHEVALLIER
                  {"\n"}
                  Stéphane DILET
                  {"\n"}
                  Moussa DIOMANDE
                  {"\n"}
                  Vianney DUBUS
                </Text>
                <Text style={Style.texte}>
                  Célia DUPRAT
                  {"\n"}
                  Axel GALVIER
                  {"\n"}
                  Laetitia GARRIGUES
                  {"\n"}
                  Franck GAULTIER
                </Text>
                <Text style={Style.texte}>
                  Enzo GHEDEBA
                  {"\n"}
                  Salah JAIBER
                  {"\n"}
                  Anne-Laure JOUHANNEAU
                  {"\n"}
                  Rhony LANDRY
                </Text>
                <Text style={Style.texte}>
                  Sandrine LAPLACE-TOULOUSE
                  {"\n"}
                  Sophie LIGAN
                  {"\n"}
                  Jessica MARMIGNON
                  {"\n"}
                  Ludovic MARMION
                </Text>
                <Text style={Style.texte}>
                  Alexis MARTIAL
                  {"\n"}
                  Kathie MARTIN
                  {"\n"}
                  Romain MARTINEZ
                  {"\n"}
                  Samuel MEYER
                </Text>
                <Text style={Style.texte}>
                  Etienne MICHEL
                  {"\n"}
                  Valérie MORO
                  {"\n"}
                  Adel NOUREDDINE
                  {"\n"}
                  Julien PEREZ
                </Text>
                <Text style={Style.texte}>
                  Sylvain PERNOT
                  {"\n"}
                  Julien PINEAU
                  {"\n"}
                  Yannick SERRA
                </Text>
              </ScrollingMessageView>
            </View>
          </ContainerAccueil>
        </View>
      );
    }
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  APropos: {
    screen: APropos,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
