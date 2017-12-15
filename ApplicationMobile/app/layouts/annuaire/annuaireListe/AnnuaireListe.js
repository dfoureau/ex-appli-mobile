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

import Icon from "react-native-vector-icons/FontAwesome";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerHeader } from "../../../components/containerHeader";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";

// IMPORT DES LAYOUTS NAVIGABLES
import { AnnuaireDetail } from "../annuaireDetail";

import configurationAppli from "../../../configuration/Configuration";
import configAnnuaire from "../../../configuration/ConfigAnnuaire";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

class AnnuaireListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      title: "Annuaire",
      annuaire: configAnnuaire.annuaireAgenceDefaut,
      isReady: false,
      idAgence: configAnnuaire.idAgenceDefaut,
      searchName: "",
      annuaireComplet: configAnnuaire.annuaireAgenceDefaut,
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
          <Icon name="user" size={30} color="#000" />
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

  getAnnuaireFromAgence(agenceId) {
    if (
      agenceId == configAnnuaire.idAgenceDefaut &&
      configAnnuaire.annuaireAgenceDefaut != null
    ) {
      return Promise.resolve(configAnnuaire.annuaireAgenceDefaut);
    } else {
      let requestURL = configurationAppli.apiURL + "annuaire/" + agenceId;
      let that = this;
      return fetch(requestURL, this.state.obj).then(response =>
        response.json().then(responseJson => {
          if (agenceId == configAnnuaire.idAgenceDefaut) {
            configAnnuaire.annuaireAgenceDefaut = responseJson;
          }
          return responseJson;
        })
      );
    }
  }

  reloadAnnuaireByAgence(_idAgence, reloadPage) {
    if (reloadPage) {
      showLoading("Récupération des données. Veuillez patienter...");
    }

    this.getAnnuaireFromAgence(_idAgence)
      .then(responseJson => {
        this.setState({
          annuaire: responseJson,
          annuaireComplet: responseJson,
          isReady: true,
        });
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        if (reloadPage) {
          hideLoading();
        }
      });
  }

  realoadAnnuaireByNameOnChange(_searchedName) {
    this.state.searchName = _searchedName;
    this.reloadAnnuaireByName(_searchedName);
  }

  reloadAnnuaireByName(_searchedName) {
    let annuaire2 = this.state.annuaireComplet;

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
    if (this.state.annuaire != null) {
      this.setState({
        isReady: true,
      });
      return;
    } else {
      this.reloadAnnuaireByAgence(configurationAppli.idAgence, false);
    }
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
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ idAgence: itemValue });
                    this.reloadAnnuaireByAgence(itemValue, true);
                  }}
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
