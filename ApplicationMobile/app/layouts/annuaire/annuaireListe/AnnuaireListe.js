import React from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  SectionList,
  Console,
  TextInput,
  Alert,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import styles from "./styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";

import { ContainerHeader } from "../../../components/containerHeader";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";

// IMPORT DES LAYOUTS NAVIGABLES
import { AnnuaireDetail } from "../annuaireDetail";

class AnnuaireListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      title: "Annuaire",
      annuaire: []
    };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  //Renvoie l'item
  renderItemComponent = ({ item }) => (
    <TouchableHighlight onPress={() => this.afficherContact(item.id)}>
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <Image
            style={styles.itemPhoto}
            source={require("../../../images/imageProfilDefault.png")}
          />
          <Text style={styles.itemText}>
            {item.nom} {item.prenom}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  //Renvoie l'en-tete de la section
  renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  //Renvoie le séparateur des items
  renderItemSeparator = () => <View style={styles.separateur} />;

  //Permet d'afficher la page d'un contact
  afficherContact(cle) {
    this.props.navigation.navigate("AnnuaireDetail", { cle: cle });
  }

  //Fonction qui permet de filtrer la liste des noms
  filtreNom(text) {
    // Il faut modifier la variable sectionList du state afin de mettre à jour la liste
  }

  prepareSectionsData(annuaire){
    const result = [];
    if(!annuaire) {
      return result;
    }
    let previousLetter = null;
    annuaire.forEach((value) => {
      if(!value || !value.nom){
        return;
      }
      const contact = {...value, key: value.id};
      const currentLetter = contact.nom.charAt(0);
      let section = null;
      if(previousLetter === currentLetter) {
        section = result[result.length -1];
      } else {
        section = {
          key: result.length,
          title: currentLetter,
          data: []
        };
        result.push(section);
        previousLetter = currentLetter;
      }
      section.data.push(contact);
    });
    return result;
  }

  componentDidMount() {
    const idAgence = 1;
    const serverURL = 'http://185.57.13.103/rest';
    const requestURL = `${serverURL}/web/app_dev.php/annuaire/${idAgence}`;
    return fetch(requestURL)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({'annuaire': responseJson});
    })
    .catch((error) => { console.error(error); });
  }

  render() {
    const sections = this.prepareSectionsData(this.state.annuaire);
    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <ContainerFilters>
            <OptionFilter />
            <SearchFilter />
          </ContainerFilters>

          <View style={styles.container}>
            <SectionList
              style={styles.sectionContain}
              sections={sections}
              renderItem={this.renderItemComponent}
              renderSectionHeader={this.renderSectionHeader}
              ItemSeparatorComponent={this.renderItemSeparator}
            />
          </View>
        </ContainerAccueil>
      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  AnnuaireListe: {
    screen: AnnuaireListe,
    navigationOptions: { header: null },
  },
  AnnuaireDetail: {
    screen: AnnuaireDetail,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
