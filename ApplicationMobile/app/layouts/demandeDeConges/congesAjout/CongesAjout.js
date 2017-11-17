import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
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
import service from "../../../realm/service";

import configurationAppli from "../../../configuration/Configuration";

const PERIOD_SCHEMA = "Period";

// SCREEN < DEMANDE DE CONGES
class CongesAjout extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  // Récupération des paramètres de navigation
  static navigationOptions = ({ navigation }) => ({
    numDemande: navigation.state.params.numDemande,
  });

  setInitialValues() {
    this.state = {
      title: "Demande de congés",
      statusId: 1,
      status: "nouveau",
      statusLabel: "Nouvelle DC",
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
      userId: configurationAppli.userID,
      objGET: {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
      obj: {
        method: "",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + configurationAppli.userToken,
        },
        body: "",
      },
      dateSolde: "",
      soldeRTT: "",
      soldeConges: "",
      dataSaved: false,
      numDemande: this.props.navigation.state.params.numDemande,
      isReady: false,
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params.numDemande);
    this.getSoldeCongesByUserId();
    if (this.props.navigation.state.params.numDemande !== null) {
      // Récupere les périodes
      this.getPeriodeCongesByUserIdNumDemande(
        this.props.navigation.state.params.numDemande
      );
    }
  }

  // Retourne toutes les périodes de congés de l'utilisateur et du numéro de demande en paramètre
  getPeriodeCongesByUserIdNumDemande(numDemande) {
    var that = this;

    fetch(this.state.WSLinkPeriode + numDemande, this.state.objGET)
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

    switch (that.state.status) {
      case 0:
        that.state.statusLabel = "Demande en brouillon";
        break;
      case 1:
        that.state.statusLabel = "En attente de validation";
        break;
      case 2:
        that.state.statusLabel = "Validée. Modifications interdites";
        break;
      case 3:
        that.state.statusLabel = "Demande à modifier";
        break;
      default:
        that.state.statusLabel = "Nouvelle demande";
        break;
    }

    that.state.statusLabel = "DC en brouillon";
  }

  // Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
  getSoldeCongesByUserId() {
    var that = this;

    fetch(this.state.WSLinkSolde, this.state.objGET)
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

  deleteConge() {
    this.props.navigation.navigate("CongesConfirmation");
  }

  saveDraft() {
    this.setState({
      statusId: 2,
      status: "brouillon",
      statusLabel: "DC en brouillon",
    });
    this.props.navigation.navigate("CongesConfirmation");
  }

  validateConge() {
    if (this.state.numDemande !== null) {
      this.sendDemandeConges("POST");
    } else {
      this.sendDemandeConges("PUT");
    }
  }

  // TODO finir le post
  sendDemandeConges(method) {
    showLoading("Enregistrement en cours. Veuillez patientier...");

    var arrPeriodes = [];
    this.state.periods.map(periodes => {
      arrPeriodes.push({
        numLigne: parseInt(periodes.numLigne),
        // TODO : les dates ne sont pas formatées comme il faut si elles proviennent d'une nouvelle période
        dateDebut: periodes.dateDu,
        dateFin: periodes.dateAu,
        nbJours: parseInt(periodes.nbJour),
        typeabs: parseInt(periodes.typeabs),
      });
    });

    this.state.obj.method = method;
    this.state.obj.body = JSON.stringify({
      userId: this.state.userId,
      etat: this.state.status,
      dateEtat: this.state.dateDemande,
      lignesDemandes: arrPeriodes,
    });
    var that = this;

    fetch(this.state.WSLinkCreate, this.state.obj)
      .then(function(response) {
        // console.warn(JSON.stringify({
        // 				userId: that.state.userId,
        // 				etat: that.state.status,
        // 				dateEtat: that.state.dateDemande,
        // 				lignesDemandes: arrPeriodes,
        // 			}));
        // console.warn(response.status);
        // console.warn(JSON.stringify(response.text()));
        if (response.status >= 400) {
          hideLoading();
          console.log("error : status >= 400");
          that.setState({
            dataSaved: false,
          });
          var id = showToast("Erreur : l'enregistrement s'est mal passé");
          throw new Error("Creation Error");
        }
        return response.json();
      })
      .then(function(demandeConge) {
        hideLoading();
        that.setState({
          dataSaved: true,
          statusId: 3,
          status: "validé",
          statusLabel: "Modifications interdites",
        });
        // Après sauvegarde en bdd, on reset le cache
        service.delete(PERIOD_SCHEMA);
        this.props.navigation.navigate("CongesConfirmation");
      })
      .catch(function(error) {
        hideLoading();
        console.log("error : " + error);
        var id = showToast(
          "Erreur : l'enregistrement s'est mal passé // " + error
        );
      });
  }

  getRows(tab, isNew) {
    return tab.map((row, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => this.modifyPeriod(row.numLigne, isNew)}
      >
        <Row
          style={[style.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[
            row.dateDuFormated,
            row.dateAuFormated,
            row.codeTypeAbs,
            row.nbJour,
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

  afficherNewRows() {
    // Périodes non encore enregistrées en base
    let newPeriods = service.get(PERIOD_SCHEMA);
    return this.getRows(newPeriods, true);
  }

  showDeleteButton() {
    // if(this.state.statusId == 2)
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

  showDraftButton() {
    // if(this.state.statusId == 1 || this.state.statusId == 2)
    return (
      <Button
        buttonStyles={style.draftButton}
        text="BROUILLON"
        onPress={() => this.saveDraft()}
      />
    );
  }

  showValidateButton() {
    // if(this.state.statusId == 1 || this.state.statusId == 2)
    return <Button text="VALIDER" onPress={() => this.validateConge()} />;
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
              <View style={style.containerStatus}>
                <Text style={style.text}>Etat : {this.state.status}</Text>
              </View>
              <View style={style.containerStatusLabel}>
                <Text style={style.statusLabel}>{this.state.statusLabel}</Text>
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
                  {this.afficherNewRows()}
                </Table>
              </View>
              <View>
                <Button
                  text="AJOUTER NOUVELLE PERIODE"
                  onPress={() => this.addNewPeriod()}
                />
              </View>
            </View>
            <View style={style.container4}>
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
