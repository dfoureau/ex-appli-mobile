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
  Picker,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import styles from "./styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerHeader } from "../../../components/containerHeader";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";

// IMPORT DES LAYOUTS NAVIGABLES
import { AnnuaireDetail } from "../annuaireDetail";

import configurationAppli from "../../../configuration/Configuration";

class AnnuaireListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      title: "Annuaire",
      annuaire: [],
      isReady: false,
      idAgence: 1,
      searchName: "",
      annuaireComplet: [],
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
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

  prepareSectionsData(annuaire) {
    const result = [];
    if (!annuaire) {
      return result;
    }
    let previousLetter = null;
    annuaire.forEach(value => {
      if (!value || !value.nom) {
        return;
      }
      const contact = { ...value, key: value.id };
      const currentLetter = contact.nom.charAt(0);
      let section = null;
      if (previousLetter === currentLetter) {
        section = result[result.length - 1];
      } else {
        section = {
          key: result.length,
          title: currentLetter,
          data: [],
        };
        result.push(section);
        previousLetter = currentLetter;
      }
      section.data.push(contact);
    });
    return result;
  }

  reloadAnnuaireByAgence(_idAgence) {
    this.state.idAgence = _idAgence;
    let requestURL = configurationAppli.apiURL + "annuaire/" + _idAgence;
    return fetch(requestURL, this.state.obj)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          annuaire: responseJson,
          isReady: true,
          annuaireComplet: responseJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  realoadAnnuaireByNameOnChange(_searchedName) {
    this.state.searchName = _searchedName;
    this.reloadAnnuaireByName(_searchedName);
  }

  reloadAnnuaireByName(_searchedName) {
    var annuaire2 = this.state.annuaireComplet;

    annuaire2 = annuaire2.filter(item => {
      return (
        item.nom.toLowerCase().match(_searchedName) ||
        item.prenom.toLowerCase().match(_searchedName)
      );
    });
    this.setState({
      annuaire: annuaire2,
      isReady: true,
    });
  }

  componentDidMount() {
    this.reloadAnnuaireByAgence(configurationAppli.idAgence);
  }

  render() {
    const sections = this.prepareSectionsData(this.state.annuaire);

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
              Récupération des données. Veuillez patienter.
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
            <ContainerFilters>
              <View style={styles.ContainerOptionFilter}>
                <Text
                  style={styles.LabelOptionFilter}
                  adjustsFontSizeToFitWidth="true"
                >
                  Agence
                </Text>
                <Picker
                  style={styles.OptionFilter}
                  selectedValue={this.state.idAgence}
                  onValueChange={(itemValue, itemIndex) =>
                    this.reloadAnnuaireByAgence(itemValue)}
                >
                  <Picker.Item label="Ile de France" value="1" />
                  <Picker.Item label="Atlantique" value="3" />
                  <Picker.Item label="Niort" value="4" />
                  <Picker.Item label="Tours" value="5" />
                  <Picker.Item label="Orléans" value="9" />
                  <Picker.Item label="Lille" value="11" />
                  <Picker.Item label="Bordeaux" value="12" />
                  <Picker.Item label="Rabat" value="13" />
                  <Picker.Item label="Lyon" value="14" />
                  <Picker.Item label="Luxembourg" value="15" />
                  <Picker.Item label="Toulouse" value="16" />
                  <Picker.Item label="Rennes" value="17" />
                </Picker>
              </View>

              <View>
                <TextInput
                  style={styles.SearchFilter}
                  placeholder="Rechercher"
                  placeholderTextColor="#000000"
                  underlineColorAndroid={"transparent"}
                  onChangeText={searchName =>
                    this.realoadAnnuaireByNameOnChange(searchName)}
                  onSubmitEditing={searchName =>
                    this.reloadAnnuaireByName(searchName)}
                />
                <TouchableHighlight
                  style={styles.touchableSearchIcon}
                  onPress={() =>
                    this.reloadAnnuaireByName(this.state.searchName)}
                >
                  <Image
                    style={styles.SearchIcon}
                    source={require("../../../images/icons/SearchIcon.png")}
                  />
                </TouchableHighlight>
              </View>
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
