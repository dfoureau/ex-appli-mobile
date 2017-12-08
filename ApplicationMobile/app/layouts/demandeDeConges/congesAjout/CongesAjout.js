import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Linking,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
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
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";
import "whatwg-fetch";

import style from "./styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import CongesPeriode from "../congesPeriode/CongesPeriode";
import CongesConfirmation from "../congesConfirmation/CongesConfirmation";

import configurationAppli from "../../../configuration/Configuration";
import moment from "moment";

// SCREEN < DEMANDE DE CONGES
class CongesAjout extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  // Récupération des paramètres de navigation
  static navigationOptions = ({ navigation }) => ({
    numDemande: navigation.state.params.numDemande,
    parent: navigation.state.params.parent,
  });

  setInitialValues() {
    const { params } = this.props.navigation.state;

    this.state = {
      title: "Demande de congés",
      statusId: 0,
      status: "En attente de validation",
      header: ["Date du", "Date au", "Type d'abs", "Nb. jours"],
      periods: [],
      WSLinkSolde:
        configurationAppli.apiURL + "conges/solde/" + configurationAppli.userID,
      WSLinkPeriode:
        configurationAppli.apiURL +
        "conges/periodes/" +
        configurationAppli.userID +
        "/",
      WSLinkCreate: configurationAppli.apiURL + "conges",
      WSLinkDelete: configurationAppli.apiURL + "conges/supprimer",
      userId: configurationAppli.userID,
      fetchHeaders: {
        Authorization: "Bearer " + configurationAppli.userToken,
      },
      dateSolde: params.parent.state.dateSolde,
      soldeRTT: params.parent.state.soldeRTT,
      soldeConges: params.parent.state.soldeConges,
      dataSaved: false,
      numDemande: params.numDemande,
      isReady: false,
      //  WSLinkTypeAbs: "http://localhost:8000/conges/typesabsences",
      WSLinkTypeAbs: configurationAppli.apiURL + "conges/typesabsences",
      arrTypeAbs: [],
    };
  }

  // Retourne les types absences congés
  getTypesAbsences() {
    fetch(this.state.WSLinkTypeAbs)
      .then(function(response) {
        if (response.status >= 400) {
          console.log("TypesAbsences : Bad response from server");
          return Promise.resolve([]);
        } else {
          return response.json();
        }
      })
      .then(res => {
        this.setState({
          arrTypeAbs: res,
        });
      });
  }

  componentWillMount() {
    var that = this;
    //Récupération des paramètres de navigation
    const { params } = this.props.navigation.state;

    this.getTypesAbsences();

    if (params.numDemande != null) {
      // Récupere les périodes
      this.getPeriodeCongesByUserIdNumDemande(params.numDemande);
    } else {
      that.setState({
        periods: [],
        isReady: true,
      });
    }
  }

  // Retourne toutes les périodes de congés de l'utilisateur et du numéro de demande en paramètre
  getPeriodeCongesByUserIdNumDemande(numDemande) {
    var that = this;

    fetch(this.state.WSLinkPeriode + numDemande, {
      method: "GET",
      headers: this.state.fetchHeaders,
    })
      .then(function(response) {
        if (response.status >= 400) {
          that.setState({
            periods: [],
            idReady: true,
          });
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(p) {
        that.setState({
          isReady: true,
          periods: p,
        });
      });

    // Congé existant en base
    that.state.numDemande = that.props.navigation.state.params.numDemande;
    that.state.statusId = that.props.navigation.state.params.etat;
    that.state.status = that.props.navigation.state.params.libelleEtat;
    that.state.dateDemande = that.props.navigation.state.params.dateDemande;
  }

  // Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  addNewPeriod() {
    this.props.navigation.navigate("CongesPeriode", {
      numDemande: this.props.navigation.state.numDemande,
      idPeriod: null,
      parent: this,
    });
  }

  modifyPeriod(id, isNew) {
    this.props.navigation.navigate("CongesPeriode", {
      numDemande: this.props.navigation.state.numDemande,
      idPeriod: id,
      isNew: isNew,
      parent: this,
    });
  }

  /**
   * Supprime la demande de conges
   * @return {[type]} [description]
   */
  deleteConge() {
    const navigation = this.props.navigation;

    const numDemande = navigation.state.params.numDemande,
      idUser = configurationAppli.userID;
    showLoading();
    fetch(this.state.WSLinkDelete + "/" + idUser + "/" + numDemande, {
      method: "DELETE",
      headers: this.state.fetchHeaders,
    })
      .then(response => {
        return Promise.all([response.status, response.json()]);
      })
      .then(res => {
        hideLoading();
        let [status, body] = res;

        let success = status == 200;
        showToast((success ? "Succès" : "Erreur") + "\n" + body.message);

        // On redirige vers la page précédente uniquement en cas de succès
        if (success) {
          navigation.state.params.parent.reloadDemandesConges();
          navigation.dispatch(NavigationActions.back());
        }
      })
      .catch(err => console.log(err));
  }

  /**
 * Vérifie qu'un tableau de périodes est valide :
 * - Pas d'inclusions de périodes
 * - Pas de chevauchement de jours ouvrés sur la période
 * - Pas de trous correspondant à un jour ouvré sur la période
 * @param  {Array} periodes  Le tableau des périodes à vérifier
 * @return {[Boolean, String]}    Tableau à 2 éléments : Un Boolean (true si les périodes sont valides, false sinon), et une String pour donner la raison de la
 */
  checkPeriodes(periodes) {
    let isValid = true,
      reason = "";

    // On parcourt le tableau des périodes, et on compare les périodes 2 à 2
    let index = 0;
    while (isValid && index < periodes.length - 1) {
      // for(let i = 0; i<periodes.length -1; i++) {
      let periode1 = periodes[index],
        periode2 = periodes[index + 1];

      let debut1 = moment(periode1.dateDu, "YYYY-MM-DD HH:mm:ss"),
        debut2 = moment(periode2.dateDu, "YYYY-MM-DD HH:mm:ss"),
        fin1 = moment(periode1.dateAu, "YYYY-MM-DD HH:mm:ss"),
        fin2 = moment(periode2.dateAu, "YYYY-MM-DD HH:mm:ss");

      // Détection du tri et des inclusions
      if (debut2.isSameOrBefore(debut1) || fin2.isSameOrBefore(fin1)) {
        isValid = false;
        reason =
          "Le tableau des périodes n'est pas trié ou contient des inclusions";
      } else if (debut2.isBefore(fin1)) {
        // Détection des chevauchements
        // possibilité de chevauchement. On prend tous les jours compris entre debut2 et fin1, et on regarde s'il y a des jours ouvrés entre les 2 dates
        let iterationDate = debut2.clone();

        while (isValid && iterationDate.isSameOrBefore(fin1)) {
          if (
            iterationDate.day() > 0 &&
            iterationDate.day() < 6 &&
            !iterationDate.isFerie()
          ) {
            isValid = false;
            reason = "Le tableau des périodes contient des chevauchements";
          } else {
            iterationDate.add(1, "days");
          }
        }
      } else if (debut2.diff(fin1, "hours") > 1) {
        // Détection des trous.
        // On fait une différence en heures pour éviter de traiter le cas normal
        // où la date de fin est à 23:59:59 et la date de début le jour suivant à 00:00:00
        let iterationDate = fin1.clone().add(1, 'seconds');

        while (isValid && iterationDate.isBefore(debut2)) {
          if (
            iterationDate.day() > 0 &&
            iterationDate.day() < 6 &&
            !iterationDate.isFerie()
          ) {
            isValid = false;
            reason =
              "Les demandes de congés doivent être consécutives ou séparées par le week end ou un jour férié";
          } else {
            iterationDate.add(12, "hours");
          }
        }
      }
      index++;
    }

    return [isValid, reason];
  }

  /**
 * Sauvegarde une demande de conges, en fonction du statusId :
 * - 0 : BROUILLON
 * - 1 : Demande de validation
 * @param  {[type]} $statusId [description]
 * @return {[type]}           [description]
 */
  saveConge($statusId) {
    if ($statusId != 0 && $statusId != 1) {
      showToast("Une erreur s'est produite");
      return;
    }

    let [isValid, reason] = this.checkPeriodes(this.state.periods);

    if (isValid) {
      showLoading("Sauvegarde de la demande en cours...");
      const navigation = this.props.navigation;
      const method = this.state.numDemande == null ? "POST" : "PUT";
      const url =
        this.state.WSLinkCreate +
        (method == "POST"
          ? ""
          : "/" + configurationAppli.userID + "/" + this.state.numDemande);

      let arrPeriodes = [];
      this.state.periods.map((periode, index) => {
        arrPeriodes.push({
          numLigne: index + 1,
          dateDebut: periode.dateDu,
          dateFin: periode.dateAu,
          nbJours: parseFloat(periode.nbJour).toFixed(1),
          typeabs: parseInt(periode.typeabs),
        });
      });

      const body = {
        etat: $statusId,
        idUser: configurationAppli.userID,
        dateEtat: moment().format("YYYY-MM-DD HH:mm:ss"),
        lignesDemandes: arrPeriodes,
      };

      if (this.state.numDemande != null) {
        body.numDemande = this.state.numDemande;
      }

      fetch(url, {
        method: method,
        headers: this.state.fetchHeaders,
        body: JSON.stringify(body),
      })
        .then(response => {
          return Promise.all([
            Promise.resolve(response.status),
            response.json(),
          ]);
        })
        .then(res => {
          hideLoading();
          const [status, body] = res;
          const success = status == 200;

          showToast((success ? "Succès" : "Erreur") + "\n" + body.message);

          if (success) {
            navigation.state.params.parent.reloadDemandesConges();
            navigation.dispatch(NavigationActions.back());
          }
        })
        .catch(err => {
          hideLoading();
          showToast("Une erreur est survenue.");
          console.log(err);
        });
    } else {
      showToast("Erreur\n" + reason);
    }
  }

  getRows(tab) {
    return tab.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyPeriod(i, false)}>
        <Row
          style={[style.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[
            row.dateDuFormated,
            row.dateAuFormated,
            row.codeTypeAbs,
            // row.nbJour,
            parseFloat(row.nbJour).toFixed(1),
          ]}
        />
      </TouchableOpacity>
    ));
  }

  afficherRows() {
    // Périodes existants en base
    let periods = this.state.periods;
    return this.getRows(periods, false);
  }

  showDeleteButton() {
    if (this.state.statusId == 0 || this.state.statusId == 1) {
      return (
        <Button
          buttonStyles={style.deleteButton}
          text="SUPPRIMER"
          onPress={() =>
            Alert.alert(
              "Suppression",
              "Etes-vous sûr de vouloir supprimer le congé ?",
              [
                { text: "Non", onPress: () => console.log("Cancel!") },
                { text: "Oui", onPress: () => this.deleteConge() },
              ]
            )}
        />
      );
    }
  }

  showDraftButton() {
    if (this.state.statusId == null || this.state.statusId == 0 || this.state.statusId == 1) {
      return (
        <Button
          buttonStyles={style.draftButton}
          text="BROUILLON"
          onPress={() => this.saveConge(0)}
        />
      );
    }
  }

  showValidateButton() {
    if (this.state.statusId == null || this.state.statusId == 0 || this.state.statusId == 1) {
      return <Button text="VALIDER" onPress={() => this.saveConge(1)} />;
    }
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View>
          <ContainerTitre
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
          </ContainerTitre>
        </View>
      );
    } else {
      return (
        <ContainerTitre
          title={this.state.title}
          navigation={this.props.navigation}
        >
          <View style={style.container}>

            <View style={style.container1}>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => Linking.openURL(configurationAppli.lienAideConges)}
              >
                <View>
                  <View style={style.containerHelpLine}>
                    <Text style={StyleGeneral.texteLien}>
                      Récapitulatif des congés
                    </Text>
                    <Icon style={{marginLeft:4}}name="question-circle-o" size={20} />
                  </View>
                </View>
              </TouchableHighlight>
            </View>

            <View style={style.container1}>
              <View style={style.containerStatus}>
                <Text style={style.text}>Etat : {this.state.status}</Text>
              </View>
            </View>
            <View style={style.container2}>
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
            <View style={style.container3}>
              <View style={style.containerTable}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}>
                  <Row
                    data={this.state.header}
                    style={style.header}
                    textStyle={style.headerText}
                  />
                  {this.afficherRows()}
                </Table>
              </View>
              <View>
                <Button
                  text="AJOUTER NOUVELLE PERIODE"
                  onPress={() => this.addNewPeriod()}
                />
              </View>
            </View>
            <View style={style.containerButtons}>
              {this.showDeleteButton()}
              {this.showDraftButton()}
              {this.showValidateButton()}
            </View>
          </View>
        </ContainerTitre>
      );
    }
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  CongesAjout: {
    screen: CongesAjout,
    navigationOptions: { header: null },
  },

  CongesPeriode: {
    screen: CongesPeriode,
    navigationOptions: { header: null },
  },

  CongesConfirmation: {
    screen: CongesConfirmation,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
