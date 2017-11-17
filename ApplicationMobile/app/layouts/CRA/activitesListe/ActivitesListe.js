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
      webServiceLien:
        configurationAppli.apiURL + "CRA/" + configurationAppli.userID + "/",
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
    };
  }

  getDemandesByUserAndYear(_annee) {
    showLoading("Récupération des données. Veuillez patienter...");
    var that = this;
    this.state.annee = _annee;
    fetch(this.state.webServiceLien + _annee, this.state.obj)
      .then(function(response) {
        if (response.status == 400) {
          that.setState({
            data: [],
            isReady: true,
            isData: false,
          });
        } else if (response.status == 404) {
          that.setState({
            data: [],
            isData: false,
            isReady: true,
          });
        }
        hideLoading();
        return response.json();
      })
      .then(cra =>
        this.setState({
          data: cra,
          isData: true,
          isReady: true,
        })
      );
  }

  componentDidMount() {
    this.getDemandesByUserAndYear(this.state.annee);
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  // afficher plusieures CRA

  afficherCRAs(item) {
    var rows = [];
    var manyElt = true;
    var hideDate = false;
    for (var i = 0; i < item.content.length; i++) {
      rows.push(
        <CRAItem
          status={item.content[i].status}
          client={item.content[i].client}
          date={item.date}
          manyElt={manyElt}
          hideDate={hideDate}
          key={item.content[i].Id}
        />
      );
      manyElt = false;
      hideDate = true;
    }
    return rows;
  }

  //Transfert du paramétre vers la page AjoutCRa
  //Params : date
  SendDataCRA(id, ItemDate) {
    this.props.navigation.navigate("AjoutCra", {
      idCRA: id,
      date: ItemDate,
      isServiceCalled: true,
    });
  }

  AfficherAjoutCRa() {
    this.props.navigation.navigate("AjoutCra", {
      date: "Octobre 2017",
      isServiceCalled: true,
    });
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
              <View style={style.container2}>
                <View style={style.containerPicker}>
                  <Picker
                    style={{
                      width: 110,
                    }}
                    selectedValue={this.state.annee}
                    onValueChange={(itemValue, itemIndex) =>
                      this.getDemandesByUserAndYear(itemValue)}
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

              <View style={style.container3}>
                {this.state.data.length <= 0 && (
                  <Text style={StyleGeneral.texte}>
                    Aucunes données trouvées pour cette année.
                  </Text>
                )}

                {this.state.isData && (
                  <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) =>
                      !item.moreThanOne ? (
                        <View>
                          <Text style={style.periodTextTitre}>
                            {!item.hideDate ? item.date : null}
                          </Text>
                          <TouchableOpacity
                            key={item.numDemande}
                            onPress={() => this.SendDataCRA(item.Id, item.date)}
                          >
                            <View style={style.containerList}>
                              <CRAItem
                                date={item.date}
                                client={item.client}
                                status={item.status}
                                key={item.Id}
                                manyElt={item.manyElt}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View>
                          <Text style={style.periodTextTitre}>
                            {!item.hideDate ? item.date : null}
                          </Text>
                          <TouchableOpacity
                            key={item.numDemande}
                            onPress={() => this.SendDataCRA(item.Id, item.date)}
                          >
                            <View style={style.containerList}>
                              <CRAItem
                                date={item.date}
                                client={item.client}
                                status={item.status}
                                key={item.Id}
                                hideDate={item.hideDate}
                                manyElt={item.manyElt}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
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
