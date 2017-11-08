import React from "react";
import { View, Text, Linking, TouchableHighlight } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import Accueil from "../../accueil/Accueil";

class APropos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "À Propos" };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={Style.texte}>
              2017 &copy; Cat-Amania
            </Text>
            <Text style={Style.texte}>
              Version : 1.0.0{" "}
            </Text>


            <TouchableHighlight 
              underlayColor = "white"
              onPress={() => Linking.openURL("http://jira.svc.cat-amania.com/")}>
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
