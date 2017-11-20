import React from "react";
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
import { StackNavigator, NavigationActions } from "react-navigation";
import style from "./styles";
import styleButton from "../../../components/Buttons/styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import CongesAjout from "../congesAjout/CongesAjout";
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
class CongesListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Demande de congés",
      data: [],
      year: moment().format("YYYY"),
      dateSolde: "",
      soldeRTT: "",
      soldeConges: "",
      WSLinkSolde:
        configurationAppli.apiURL + "conges/solde/" + configurationAppli.userID,
      WSLinkList:
        configurationAppli.apiURL + "conges/" + configurationAppli.userID + "/",
      dataLoaded: false,
      noData: false,
      isReady: false,
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
    };
  }

  componentDidMount() {
    var today = new Date();
    var year = today.getFullYear();
    this.getDemandesByUserAndYear(year);
    this.getDemandeCongesByUserId();
  }

  // Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  addNewConge() {
    this.props.navigation.navigate("CongesAjout", { idConge: null });
  }

  getConge(num, dateDem, dateD, dateA, nbj, etat, libEtat) {
    this.props.navigation.navigate("CongesAjout", {
      numDemande: num,
      dateDemande: dateDem,
      dateDu: dateD,
      dateAu: dateA,
      nbJour: nbj,
      etat: etat,
      libelleEtat: libEtat,
    });
  }

  reloadDemandesConges(_year) {
    this.setState({ year: _year });
    this.setState({ dataLoaded: false, noData: false });
    this.getDemandesByUserAndYear(_year);
  }

  // Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
  getDemandeCongesByUserId() {
    try {
      var that = this;
      fetch(this.state.WSLinkSolde, this.state.obj)
        .then(function(response) {
          if (response.status >= 400) {
            that.setState({
              dateSolde: "",
              soldeRTT: "",
              soldeConges: "",
            });
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(function(solde) {
          that.setState({
            dateSolde: solde[0]["datesolde"],
            soldeRTT: solde[0]["rtt"],
            soldeConges: solde[0]["cp"],
          });
        });
    } catch (error) {}
  }

  // Retourne toutes les demandes de congés de l'utilisateur en paramètre pour l'année en paramètre
  getDemandesByUserAndYear(year) {
    showLoading("Récupération des données. Veuillez patienter...");
    try {
      var that = this;
      fetch(this.state.WSLinkList + year, this.state.obj)
        .then(function(response) {
          if (response.status == 400) {
            that.setState({ data: [], isReady: true });
            //throw new Error("Bad response from server");
          } else if (response.status == 404) {
            that.setState({
              data: [],
              noData: true,
              isReady: true,
            });
            //throw new Error("No data found");
          }
          hideLoading();
          return response.json();
        })
        .then(conges =>
          this.setState({
            data: conges,
            dataLoaded: true,
            isReady: true,
          })
        );
    } catch (error) {}
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
      let oldestYear = "2008";

      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <View style={style.container}>
              {/* Container avec compteurs des congés*/}
              <View style={style.container1}>
                <View style={style.containerInfoElement}>
                  <Text style={style.text}>Solde au :</Text>
                  <TextInput
                    style={style.textInputYear}
                    value={this.state.dateSolde}
                    editable={false}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={style.containerInfoElement}>
                  <Text style={style.text}>RTT :</Text>
                  <TextInput
                    style={style.textInputCounter}
                    value={this.state.soldeRTT}
                    editable={false}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={style.containerInfoElement}>
                  <Text style={style.text}>CP :</Text>
                  <TextInput
                    style={style.textInputCounter}
                    value={this.state.soldeConges}
                    editable={false}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              {/* Container filtre et ajout de congés*/}
              <View style={style.container2}>
                <View style={style.containerPicker}>
                  <Picker
                    style={{ width: 110 }}
                    selectedValue={this.state.year}
                    onValueChange={(itemValue, itemIndex) =>
                      this.reloadDemandesConges(itemValue)}
                  >
                    {PickerRange(currentYear, oldestYear)}
                  </Picker>
                </View>
                <View style={style.containerButton}>
                  <Button text="AJOUTER" onPress={() => this.addNewConge()} />
                </View>
              </View>
              {/* Container liste des congés */}
              <View style={style.container3}>
                {this.state.noData && (
                  <Text style={style.texte}>
                    Aucunes données trouvées pour cette année.
                  </Text>
                )}
                {!this.state.noData && (
                  <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        key={item.numDemande}
                        onPress={() =>
                          this.getConge(
                            item.numDemande,
                            item.dateDemande,
                            item.dateDu,
                            item.dateAu,
                            item.nbJour,
                            item.etat,
                            item.libelleEtat
                          )}
                      >
                        <View style={style.containerList}>
                          <View style={style.containerPeriod}>
                            <Text style={style.periodText}>
                              {item.dateDuMin} au {item.dateAuMax}
                            </Text>
                            <View style={style.containerIcon}>
                              <Image
                                style={style.listIcon}
                                source={
                                  item.etat == 1
                                    ? require("../../../images/icons/check2.png")
                                    : null
                                }
                              />
                            </View>
                          </View>
                          <View>
                            <Text style={style.dayNumberText}>
                              Nb jours : {item.nbJour}
                            </Text>
                            <Text style={style.statusText}>
                              Etat : {item.libelleEtat}
                              {item.etat == 1 ? (
                                <Text>
                                  {" "}
                                  par {item.valid} le {item.dateValidation}
                                </Text>
                              ) : null}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
  CongesListe: {
    screen: CongesListe,
    navigationOptions: { header: null },
  },
  CongesAjout: {
    screen: CongesAjout,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
