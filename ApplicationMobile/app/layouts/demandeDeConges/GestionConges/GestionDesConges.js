import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";

import { StackNavigator, NavigationActions } from "react-navigation";
import style from "./styles";
import styleButton from "../../../components/Buttons/styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import CongesListe from "../congesListe/CongesListe";
import { PickerRange } from "../../../components/PickerRange";

import configurationAppli from "../../../configuration/Configuration";

import moment from "moment";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

// SCREEN = DEMANDE DE CONGES
class GestionDesConges extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  // Récupération des paramètres de navigation
  static navigationOptions = ({ navigation }) => ({
    numDemande: navigation.state.params.numDemande,
    parent: navigation.state.params.parent,
  });

  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  setInitialValues() {
    const { params } = this.props.navigation.state;


    this.state = {
      title: "Historique (DDC)",
      statusId: null,
     
   
    };
  }





  render() {
    return (
      <ContainerTitre
        title={this.state.title}
      >
        <ActivityIndicator
          color={"#8b008b"}
          size={"large"}
          style={StyleGeneral.loader}
        />
      </ContainerTitre>

    );
  }
};
const navigation = StackNavigator({
  GestionDesConges: {
    screen: GestionDesConges,
    navigationOptions: { header: null },
  },
});



// EXPORT DE LA NAVIGATION
export default navigation;
