import React from "react";
import { View, Text, Linking, TouchableHighlight } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";

import configurationAppli from "../../../configuration/Configuration";

class BugReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Rapporter une anomalie",
    };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    let lienSupportJira = configurationAppli.lienSupportJira;

    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={Style.texte}>
              Nous vous remercions de votre temps et efforts pour testesr
              notre, votre, application Cat-Amania.
              {"\n"}
              Si vous rencontrer une anomalie (fonctionelle, IHM, etc.),
              merci de nous la rapporter avec le plus d'éléments de détails
              possible sur notre Service Desk.
              {"\n"}
              Vous pouvez nous suggérer des améliorations sur le même lien 
              du Service Desk ci-dessous.
            </Text>

            <TouchableHighlight
              underlayColor="white"
              onPress={() => Linking.openURL(lienSupportJira)}
            >
              <Text style={Style.texteLien}>
                Envoyer un rapport de bug ou une suggestion d'amélioration
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
  BugReport: {
    screen: BugReport,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
