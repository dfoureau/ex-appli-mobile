import React from "react";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";
import {
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import styles from "./styles";
import StyleGeneral from "../../../styles/Styles";
import moment from "moment";
import { momentConfig } from '../../../configuration/MomentConfig';


import {
  showToast,
  showNotification,
  hide,
} from "react-native-notifyer";

// IMPORT DES COMPOSANTS EXOTIQUE
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import FraisDetail from "../fraisDetail/FraisDetail";
import FraisConfirmation from "../fraisConfirmation/FraisConfirmation";

import FraisJour from "../utils/FraisJour";

import configurationAppli from "../../../configuration/Configuration";

class FraisAjout extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  //Récupération des paramètres de navigation
  static navigationOptions = ({ navigation }) => ({
    idUser: navigation.state.params.idUser,
    month: navigation.state.params.month,
    year: navigation.state.params.year,
  });

  setInitialValues() {
    // var initListAndTotals = this.initListAndTotals();

    // Initialisation du mois et de l'année sélectionnés.
    // S'ils sont vides, on prend le mois et l'année courants
    const { params } = this.props.navigation.state;
    let now = moment();
    monthSelected = now.month();
    yearSelected = now.year();

    if (params.month != null) {
      monthSelected = params.month;
    }

    if (params.year != null) {
      yearSelected = params.year;
    }

    this.state = {
      title: "Note de frais",
      isReady: false,
      statusId: null,
      status: "Nouveau",
      header: ["Jour", "Client", "Montant €"],
      rowsFlexArr: [1, 2 ,1],
      monthsWithNDF: params.monthsWithNDF,
      monthSelected: parseInt(monthSelected),
      yearSelected: parseInt(yearSelected),
      listFrais: [],
      totalMontant: 0,
      totalClient: 0,
      webServiceLien: configurationAppli.apiURL + "ndf/",
      fetchOptions: {
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        }
      }
    };
  }

  /**
   * Renvoie un tableau contenant des frais vides
   * pour chaque jour du mois/année donnés
   * @param  {int}  year  Année
   * @param  {month}  month mois
   * @return {Array}       Le tableau de tous les frais initialisés à 0
   */
  initFraisVides(year, month) {
    //Initialisation de la date au 1er jour correspondant au mois et à l'année
    // fournis en paramètre
    let dateSelected = moment(year+'-'+month+'-01', 'YYYY-M,DD');
    let nbJours = dateSelected.daysInMonth(); // Nombre de jours dans le mois

    let tableauFrais = [];

    for (i=1; i<= nbJours; i++) {
      dateSelected.set('date', i);
      tableauFrais.push(new FraisJour(dateSelected.format('YYYY-MM-DD')));
    }

    return tableauFrais;
  }


  /**
   * Récupère les informations d'une NDF pour une année et un mois donnés
   * Une fois les données récupérées, la fonction met également à jour
   * le state de la page pour reconstruire le tableau des jours
   *
   * @param  {int} year  année
   * @param  {int} month mois
   * @return {[type]}       [description]
   */
  getNDF(year, month){
    var that = this;
    let listFrais = this.initFraisVides(year, month);

    // éléments du state représentant un mois vide
    let ndfEmptyState = {
        isReady: true,
        listFrais: listFrais,
        totalMontant: 0,
        totalClient: 0,
        status: "Nouveau",
        statusId: null
    }

    // On vérifie que le mois à chercher est bien dans le tableau des mois contenant une NDF
    // Sinon, on affiche directement une table vide
    if (!this.state.monthsWithNDF.includes(month)) {
      that.setState(ndfEmptyState)
    }
    else {
      fetch(this.state.webServiceLien + configurationAppli.userID + '/' + year + '/' + month, {
        method: 'GET',
        headers: this.state.fetchOptions.headers
      })
      .then(function(response) {
        if (response.status >= 400) {
          //Réinitialisation des valeurs
          that.setState(ndfEmptyState);
          return {isEmpty: true};
        }
        else {
          return response.json();
        }
      })
      .then(function(ndf) {
        if (ndf.isEmpty !== true) {
          //Construction du tableau de la note de frais
          var frais = ndf["notesDeFrais"];

          // intialisation des totaux globaux
          var totalAReglerAllFrais = 0;
          var totalClientAllFrais = 0;

          if (frais != null) {
            frais.forEach(function(item) {
              let jour = moment({
                y: item["annee"],
                M: item["mois"] -1, // Décalage du mois dû au fait que les mois en JS sont indexés de 0 à 11
                d: item["jour"],
              });

              let fraisJour = new FraisJour(jour.format('YYYY-MM-DD'));
              fraisJour.mapperDonnees(item); // Mapping des donnees et update du montant

              totalAReglerAllFrais += fraisJour.totalAReglerFrais;
              totalClientAllFrais  += fraisJour.totalClientFrais;

              listFrais[item["jour"] -1] = fraisJour;
            });

           that.setState({
              listFrais: listFrais,
              totalMontant: totalAReglerAllFrais,
              totalClient: totalClientAllFrais,
              status: ndf["libelleEtat"],
              statusId: ndf["etat"],
              isReady: true
            });
        }
      }
    });
  }
}

  reloadNDFByYear(_month){
    this.setState({
      monthSelected: _month,
      isReady: false
      }, () => {
      this.getNDF(this.state.yearSelected, this.state.monthSelected);
    });
  }

  componentWillMount() {
    var that = this;

    // var initListAndTotals = this.initListAndTotals();
    this.getNDF(this.state.yearSelected, this.state.monthSelected);

  }

  //Affiche les lignes du tableau à partir de listFrais
  afficherRow() {
    return this.state.listFrais.map((fraisJour, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyNDF(fraisJour.date, this.state.statusId)}>
        <Row
          style={[styles.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={styles.rowText}
          data={[moment(fraisJour.date).format('ddd DD'), fraisJour.detail.client, fraisJour.totalAReglerFrais.toFixed(2)]}
          flexArr= {this.state.rowsFlexArr}
        />
      </TouchableOpacity>
    ));
  }

  //Affiche le contenu du menu des mois/années
  loadPickerItems() {
    return moment.months().map((item, i) => (
      <Picker.Item label={item + ' ' + this.state.yearSelected} value={i+1} key={i} />
    ));
  }

  /**
   * Modification de la NDF pour un jour donné
   */
  modifyNDF(idFrais, statusId) {
    //Indique le numéro de la ligne a modifier
    this.props.navigation.navigate("FraisDetail", {
      forfait: false,
      idFrais: idFrais,
      parent: this
    });
  }

  /**
   * Création d'un forfait (template)
   * Pour le mois sélectionné
   */
  addNDF(monthSelected, statusId) {
    this.props.navigation.navigate("FraisDetail", {
      forfait: true,
      parent: this
    });
  }
  deleteNDF() {
    this.props.navigation.navigate("FraisConfirmation");
  }
  saveDraft() {
    this.setState({
      statusId: 0,
      status: "Brouillon",
    });
    this.props.navigation.navigate("FraisConfirmation");
  }
  validateNDF() {
    this.setState({
      statusId: 2,
      status: "Validé",
    });
    this.props.navigation.navigate("FraisConfirmation");
  }

  /*
  checketat(etat) {
    // Renvoie true si l'id correspond à l'état validé ou en attente de validation
    return (etat == 1 || etat == 2);
  }
  */

  showDeleteButton() {
    if (this.state.statusId == 0)
      return (
        <Button
          buttonStyles={styles.deleteButton}
          text="SUPPRIMER"
          onPress={() =>
            Alert.alert(
              "Suppression",
              "Etes-vous sûr de vouloir supprimer la note de frais ?",
              [
                { text: "Non", onPress: () => console.log("Cancel!") },
                { text: "Oui", onPress: () => this.deleteNDF() },
              ]
            )}
        />
      );
  }

  showDraftButton() {
    if (this.state.statusId == null || this.state.statusId == 0)
      return (
        <Button
          buttonStyles={styles.draftButton}
          text="BROUILLON"
          onPress={() => this.saveDraft()}
        />
      );
  }

  showValidateButton() {
    if (this.state.statusId == null || this.state.statusId == 0) {
      return <Button text="VALIDER" onPress={() => this.validateNDF()} />;
    }
  }

  render() {
    const { params } = this.props.navigation.state;

    if (!this.state.isReady) {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}

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
      return (
        <View style={styles.mainContainer}>
          <ContainerTitre
            title={this.state.title}
            navigation={this.props.navigation}
          >
            <View style={styles.container}>
              <View style={styles.container1}>
                <View style={styles.containerStatus}>
                  <Text style={styles.text}>Etat : {this.state.status}</Text>
                </View>
              </View>
              <View style={styles.container2}>
                <View style={styles.containerColumn}>
                  <View style={styles.containerInfoElement}>
                    <Text style={styles.text}>
                      Total à régler : {this.state.totalMontant.toFixed(2)} €
                    </Text>
                    <Text style={styles.text}>
                      Total client : {this.state.totalClient.toFixed(2)} €
                    </Text>
                  </View>
                  <View style={styles.containerButton}>
                    <Button
                      text="AJOUTER FORFAIT"
                      onPress={() => this.addNDF(this.state.monthSelected, this.state.statusId)}
                      buttonStyles={Style.addButton}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.container3}>
                <View style={styles.containerTable}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}>
                    <Row
                      data={this.state.header}
                      style={styles.header}
                      textStyle={styles.headerText}
                      flexArr={this.state.rowsFlexArr}
                    />
                    {this.afficherRow()}
                  </Table>
                </View>
              </View>
              <View style={styles.containerButtons}>
                {this.showDeleteButton()}
                {this.showDraftButton()}
                {this.showValidateButton()}
              </View>
            </View>
          </ContainerTitre>
        </View>
      );
    }
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  FraisAjout: {
    screen: FraisAjout,
    navigationOptions: { header: null },
  },
  FraisDetail: {
    screen: FraisDetail,
    navigationOptions: { header: null },
  },
  FraisConfirmation: {
    screen: FraisConfirmation,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
