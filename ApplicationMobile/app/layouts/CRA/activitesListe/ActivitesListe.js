import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StackNavigator, NavigationActions, Navigator } from "react-navigation";
import style from "./styles";
import StyleGeneral from "../../../styles/Styles";

import CRAItem from "../../../components/CRAItem/CRAItem";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { PickerRange } from "../../../components/PickerRange";
import Accueil from "../../accueil/Accueil";
import { Button } from "../../../components/Buttons";
import ActivitesDetail from "../activitesDetail/ActivitesDetail";
import AjoutCra from "../ajoutCRA/AjoutCra";
import ActivitesConfirmation from "../activitesConfirmation/ActivitesConfirmation";

import configurationAppli from "../../../configuration/Configuration";

import moment from "moment";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

class ActivitesListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Relevés d'Activités",
      data: [],
      isReady: false,
      isData: false,
      annee: moment().format("YYYY"),
      webServiceLien: configurationAppli.apiURL + "CRA/" + configurationAppli.userID + "/",
      fetchHeaders: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
    };
  }

/**
 * Remise à zéro des données dans le state
 */
resetData() {
  this.setState({
    data: [],
    isData:false,
    isReady: false
  })
}

  getDemandesByUserAndYear(_annee, reloadPage) {
    if (reloadPage) {
      showLoading("Récupération des données. Veuillez patienter...");
    }

    this.resetData();
    var that = this;
    fetch(this.state.webServiceLien + _annee, {
      method: 'GET',
      headers: this.state.fetchHeaders
    })
    .then(function(response) {
      return Promise.all([response.status, response.json()]);
    })
    .then(function(response) {
        let [status, cra] = response;
        if (status > 200) {
          that.setState({
            isReady: true,
            annee: _annee
          });
        }
        else {
          that.setState({
            data: that.parseCra(cra),
            isData: true,
            isReady: true,
            annee: _annee
          })
        }

        if (reloadPage) {
          hideLoading();
        }
      });
  }

  parseCra(cra) {
    // On commence par trier le tableau par ordre de date décroissant
    cra.sort((cra1, cra2) => {
      let date1 = moment(cra1.annee + '-' + cra1.mois, 'YYYY-M'),
          date2 = moment(cra2.annee + '-' + cra2.mois, 'YYYY-M');

    if (date1 > date2) {
      return -1;
    }
    else if (date1 < date2) {
      return 1;
    }
    else {
      // On trie les cra par ordre d'id croissant au sein d'un même mois/année
      return parseInt(cra1.Id) - parseInt(cra2.Id)
    }
  });


    let currentDate = "";
    let hideDate = false;
    let rows = [];

    cra.forEach((item) => {
      if (item.date !== currentDate)  {
        currentDate = item.date;
        hideDate = false;
      }
      else {
        hideDate = true;
      }

      item.hideDate = hideDate;
      rows.push(item);
    })

    return rows;
  }

  componentWillMount() {
    this.getDemandesByUserAndYear(this.state.annee, false);
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  /**
   * Navigation vers la page AjoutCra
   * @param {int} id    Id du CRA à modifier
   * @param {int} year  Année du CRA à modifier
   * @param {int} month Mois du CRA à modifier
   */
  SendDataCRA(id, year, month) {
    this.props.navigation.navigate("AjoutCra", {
      idCRA: id,
      month: month,
      year: year,
      parent: this
    });
  }

  AfficherAjoutCRa() {
    this.props.navigation.navigate("AjoutCra", {
      idCRA: null,
      year: moment().year(),
      month: moment().month() +1,
      newCra: true,
      parent: this,
    });
  }

  afficherCra(item) {
    return (
      <View>
        <Text style={style.periodTextTitre}>
          {!item.hideDate ? item.date : null}
        </Text>
        <TouchableOpacity
          key={item.key}
          onPress={() => this.SendDataCRA(item.Id, item.annee, item.mois)}
        >
          <CRAItem
            date={item.date}
            libelle={item.libelle}
            client={item.client}
            status={item.status}
            key={item.key}
            hideDate={item.hideDate}
            Id={item.Id}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <ActivityIndicator
              color={"#8b008b"}
              size={"large"}
              style={StyleGeneral.loader}
            />
            <Text style={StyleGeneral.texteLoader}>
              Récupération des données. Veuillez patienter...
            </Text>
          </ContainerAccueil>
        </View>
      );
    } else {
      let currentYear = moment().year();
      let oldestYear = 2008;

      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <View style={style.container}>
              <View style={style.container1}>
                <View style={style.containerPicker}>
                  <Picker
                    style={{
                      width: 110,
                    }}
                    selectedValue={this.state.annee}
                    onValueChange={(itemValue, itemIndex) =>
                      this.getDemandesByUserAndYear(itemValue, true)}
                  >
                    {PickerRange(currentYear, oldestYear)}
                  </Picker>
                </View>
                <View style={style.containerButton}>
                  <Button
                    text="AJOUTER"
                    onPress={() => this.AfficherAjoutCRa()}
                  />
                </View>
              </View>

              <View style={style.container2}>
                {this.state.data.length <= 0 && (
                  <Text style={StyleGeneral.texte}>
                    Aucunes données trouvées pour cette année.
                  </Text>
                )}

                {this.state.isData && (
                  <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => this.afficherCra(item) }
                  />
                )}
              </View>
            </View>
          </ContainerAccueil>
        </View>
      );
    }
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  ActivitesListe: {
    screen: ActivitesListe,
    navigationOptions: { header: null },
  },

  AjoutCra: {
    screen: AjoutCra,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
