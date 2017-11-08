import React from "react";
import { View, Text, Linking, TouchableHighlight } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import Accueil from "../../accueil/Accueil";

class APropos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "À Propos",
    };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    lienSupportJira: "http://jira.svc.cat-amania.com/"

    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={Style.texte}>
              Dans le but de favoriser l'interaction en mobilité avec l'entreprise et entre les collaborateurs, CAT-AMANIA fourni a ses collaborateurs des smartphones
              dans le cadre du projet SMART CONNEXION.
              {"\n"}
              Avec cette application, le projet SMART CONNEXION fournit aux collaborateurs un accès à l'espace collaborateur directement depuis leur smartphones
              à travers d'une application mobile.
              {"\n"}
              Cette dernière a été développée par le programme INNOVA grâce à votre collaboration et vos travaux au sein d'INNOVA.
            </Text>

            <Text style={Style.texte}>
              Tous droits réservés &copy; 2017 Cat-Amania
            </Text>

            <Text style={Style.texte}>
              Version : 1.0.0{" "}
            </Text>


            <TouchableHighlight 
              underlayColor = "white"
              onPress={() => Linking.openURL(lienSupportJira)}>
              <Text style={Style.texteLien}>
                Envoyer un rapport de bug ou une demande d'aide
              </Text>
            </TouchableHighlight>
          </View>
        </ContainerAccueil>
      </View>
    );
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
