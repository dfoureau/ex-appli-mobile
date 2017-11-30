import React from "react";
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

import moment from "moment";
import feries from "moment-ferie-fr";
import "whatwg-fetch";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import ActivitesDetail from "../activitesDetail/ActivitesDetail";
import CraConfirmation from "../craConfirmation/CraConfirmation";
import StyleGeneral from "../../../styles/Styles";
import style from "./styles";
import Panel from "../../../components/Panel/Panel";

import configurationAppli from "../../../configuration/Configuration";

class AjoutCra extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  static navigationOptions = ({ navigation }) => ({
    idCRA: navigation.state.params.idCRA,
    parent: navigation.state.params.parent
    // date: navigation.state.params.date,
  });

  setInitialValues() {
    const { params } = this.props.navigation.state;

    let now = moment();
    let monthSelected = now.month() + 1; // On prend le mois +1 à case de l'indexation des mois en javascript (0 -> 11)
    let yearSelected = now.year();

    if (params.month != null) {
      monthSelected = params.month;
    }
    if (params.year != null) {
      yearSelected = params.year;
    }

    this.state = {
      yearSelected: parseInt(yearSelected),
      monthSelected: parseInt(monthSelected),
      title: "",
      statusId: null,
      TextClient: " ",
      TextResponsable: " ",
      TextProjet: " ",
      TextComment: " ",
      status: "Nouveau",
      header: ["Date", "Activité"],
      newCra: params.newCra != undefined && params.newCra,
      listItemsCRA : [],
      modifiedLines: [], //liste des lignes à modifier si validation
      activitesListe: [],
      userId: configurationAppli.userID,
      fetchHeaders: {
        Authorization: "Bearer " + configurationAppli.userToken,
      },
      WSLinkCRA: configurationAppli.apiURL + "CRA/RA",
      isReady: false,
      data: [],
    };

  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

/**
 * Calcule le nombre de jours travaillés du mois
 * @return {[type]} [description]
 */
getNbJoursTravailles() {
  return this.state.listItemsCRA.reduce((result, element) => {
    return result + this.getValeurJour(element.actType);
  }, 0);
}

/**
 * Calcule le nombre de jours d'absence du mois
 * @return {[type]} [description]
 */
getNbJoursAbsence() {
  return this.state.data.NbJOuvres - this.getNbJoursTravailles();
}


  /**
   * Retrouve la quantité travaillée et la quantité d'absence pour un code donné
   * @param  {[type]} code [description]
   * @return {[type]}      [description]
   */
  getValeurJour(code) {
    let travaille = 0;
    // On cherche le jour dans jourouvre, puis dans jourwe
    let typeAct = this.state.activitesListe.jourouvre.find((element) => {return element.code == code});
    if (typeAct == undefined) {
      typeAct = this.state.activitesListe.jourwe.find((element) => {return element.code == code});
    }
    if (typeAct == undefined) {
      console.log("CODE introuvable : " + code);
    }
    else {
      travaille = typeAct.valeur;;
    }

    return parseFloat(travaille);
  }

  /**
   * On appelle le service pour récuéprer les éléments suivants :
   *  - liste des Types Action et leurs libellés
   *  - Liste des jours de CP posés dans le mois
   * @return {Promise} On renvoie un tableau Promise.all, où chaque élément correspond à un retour de webservice
   */
  getServiceGeneralData(year, month) {
    let fetchObj = {
      method: 'GET',
      headers: this.state.fetchHeaders
    };

    let webServiceTypesActivites = configurationAppli.apiURL + "CRA/typesactivites",
        webServiceDemandeConges = configurationAppli.apiURL + "conges" + '/' + configurationAppli.userID + '/' + year + '/' + month;

    return Promise.all([
      // Liste des typesAction
      fetch(webServiceTypesActivites, fetchObj)
        .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        else {
          return Promise.resolve({
            jourouvre: [],
            jourwe: []
          });
        }
      })
      ,
      // Liste des conges
      fetch(webServiceDemandeConges, fetchObj)
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
          else {
            return Promise.resolve([]);
          }
        })
    ])
    .catch((reason) =>  {
      console.log("Une erreur est survenue : " + reason);
      showToast("Une erreur est survenue.");
      this.props.navigation.dispatch(NavigationActions.back());
    });
  }


  componentWillMount() {
    var that = this;
    //Récupération des paramètres de navigation
    const { params } = this.props.navigation.state;

    // Récupération des infos générales
    Promise.resolve(this.getServiceGeneralData(this.state.yearSelected, this.state.monthSelected))
      .then((result) => {
        let [ typesActions, conges] = result;

        if (params.idCRA != null) {
          // Récupération du CRA
            this.getCRAInfosByID(params.idCRA, typesActions, conges);
        }
        else if (this.state.newCra) {
            // Initialisation des jours avec les valeurs par défaut
            this.initDefaultCra(this.state.yearSelected, this.state.monthSelected, typesActions, conges);
        }
        else {
          that.setState({
            data: [],
            isReady: true,
            activitesListe: typesAction
          });
        }
      });
    }


/**
 * Initialise un CRA avec les valeurs par défaut
 * Jours ouvrés : "1.0"
 * WE et jours fériés : "0.0"
 * On tient également compte des congés
 * @param  {int} year     Année du CRA
 * @param  {int} month    Mois du CRA
 * @return {[type]}       [description]
 */
initDefaultCra(year, month, typesActions, conges) {
  let data = {
    idRA: null,
    mois: month,
    annee: year,
    libelle: "Nouveau",
    NbJOuvres: 0,
    nbJourTravailles: 0,
    nbJourAbs: 0,
    client: "",
    responsable: "",
    projet: "",
    commentaire: "",
    valeursSaisies: []
  }; // Objet à peupler pour créer un nouveau CRA

  let date = moment(year + '-' + month, 'YYYY-M');
  let nbJours = date.daysInMonth();

  var valeurSaisie = null;
  for (let i=1; i<= nbJours; i++) {
    date.set('date', i);

    valeurSaisie = {
      startDate: date.format('DD/MM/YYYY'),
      disabled: false,
      actType: "1.0"
    };

    // On verifie si le jour est férié
    if (date.isFerie()) {
      valeurSaisie.isFerie = true;
      valeurSaisie.actType = "0.0";
      valeurSaisie.disabled = true;
    }
    // On vérifie si le jour est un samedi ou un dimanche
    else if (date.day() == 0 || date.day() == 6) {
      valeurSaisie.isWE = true;
      valeurSaisie.actType = "0.0";
    }
    // On vérifie si le jour correspond à une demande de congé
    else {
      data.NbJOuvres ++;
        let congeData = conges.find((item) => item.jour == i);
        if (congeData != undefined && congeData != null) {
            if (congeData.code != "1,0" && congeData.code != "1.0") {
              valeurSaisie.actType = congeData.code
              valeurSaisie.disabled = true; // ??? à vérifier.
            }
        }
    }

    data.valeursSaisies.push(valeurSaisie);
  }

  data.NbJOuvres = data.NbJOuvres.toFixed(1);
  this.setState({
    isReady: true,
    data: data,
    statusId: null,
    listItemsCRA : data.valeursSaisies,
    TextClient : "",
    TextResponsable : "",
    TextProjet : "",
    TextComment : "",
    activitesListe: typesActions
  });
}

  getCRAInfosByID(idCRA, typesActions, conges) {
    var that = this;
    fetch(this.state.WSLinkCRA + '/' + idCRA,  {
      method: 'GET',
      headers: this.state.fetchHeaders
    })
    .then(function(response) {
      if (response.status >= 400) {
        that.setState({
          data: [],
          idReady: true,
        }, () => {throw new Error("Bad response from server");} );
      }
      else {
        return response.json();
      }
    })
    .then(function(cra) {
      cra.NbJOuvres = parseFloat(cra.NbJOuvres);
      // cra.nbJourTravailles = parseFloat(cra.nbJourTravailles);
      // cra.nbJourAbs = parseFloat(cra.nbJourAbs);

      that.setState({
        isReady: true,
        data: cra,
        statusId: cra.etat,
        listItemsCRA : that.getItemsCRA(cra.valeursSaisies,conges),
        TextClient : cra.client,
        TextResponsable : cra.responsable,
        TextProjet : cra.projet,
        TextComment : cra.commentaires,
        activitesListe: typesActions
      });
    });
  }

  getItemsCRA(valeursSaisies, conges) {
    return valeursSaisies.map((item) => {
      let actType = item.activité;
      let disabled = false;
      let date = moment(item.date, 'DD/MM/YYYY');
      if (date.isFerie()) {
        disabled = true;
        actType = "0.0";
      }
      else {
        if (date.day() > 0 && date.day() < 6) { // On vérifie qu'on est un jour en semaine
          let congeData = conges.find((item) => item.jour == date.date()); // On récupère la ligne de congé pour vérifier si un CP a été posé ou pas
          if (congeData != null && congeData != undefined && congeData.code != "1,0" && congeData.code != "1.0") {
            disabled = true;
            actType = congeData.code;
          }
        }
      }

      return {
        startDate: item.date,
        actType: actType,
        disabled: disabled
        // valeur: item.valeur
      };
    });
  }

  /**
   * Supprime le CRA via un appel au service
   * @return {[type]} [description]
   */
  deleteCra() {
    let idCra = this.props.navigation.state.params.idCRA,
        parent = this.props.navigation.state.params.parent,
        annee = this.state.yearSelected;

    let that = this;

    fetch(this.state.WSLinkCRA + '/' + idCra, {
      method: 'DELETE',
      headers: this.state.fetchHeaders
    })
    .then((response) => {
      return Promise.all([response.status, response.json()]);
    })
    .then((res) => {
      let [status, body] = res;

      let success = status == 200;
      showToast( (success ? "Succès" : "Erreur") + "\n" +  body.message );

      // On redirige vers la page précédente uniquement en cas de succès
      if (success) {
        parent.getDemandesByUserAndYear(annee);
        that.props.navigation.dispatch(NavigationActions.back());
      }
    })
    .catch(err => console.log(err));
  }

  /**
 * Enregistre un CRA en fonction du statusId choisi :
 *   - 1 : Enregistre un brouillon
 *   - 2 : Enregistre en demande de validation
 *
 * @param  {int} statusId [description]
 * @return {void}      La méthode affiche une notification, et redirige vers la page de liste en cas de succès
 */
saveCra(statusId) {
  if (statusId != 1 && statusId != 2) {
    showToast("Une erreur est survenue.");
    return;
  }

  let errMsg = "";
  // Vérification des champs obligatoires client et responsable :
  if (this.state.TextClient.trim() == "") {
      errMsg += "Veuillez renseigner le nom du client.";
  }
  if (this.state.TextResponsable.trim() == "") {
    errMsg += (errMsg != "" ? "\n" : "") + "Veuillez renseigner le nom du responsable.";
  }

  if (errMsg != "") {
    showToast(errMsg);
    return;
  }


  showLoading("sauvegarde en cours...");
  let that = this;

  let method = (this.state.newCra ? 'POST' : 'PUT'), // La méthode varie selon qu'on crée ou qu'on modifie un CRA
      url = (this.state.newCra ? this.state.WSLinkCRA : this.state.WSLinkCRA + "/" + this.props.navigation.state.params.idCRA);
      annee = this.state.yearSelected,
      parent = this.props.navigation.state.params.parent;

  let body = {
    idUser: configurationAppli.userID,
    mois: this.state.monthSelected,
    annee: annee,
    etat: statusId,
    nbJourTravailles: this.getNbJoursTravailles().toFixed(1),
    nbJourAbs: this.getNbJoursAbsence().toFixed(1),
    client: this.state.TextClient,
    responsable: this.state.TextResponsable,
    projet: this.state.TextProjet,
    commentaires: this.state.TextComment,
    valeursSaisies: this.state.listItemsCRA.map((item) => { return {date: item.startDate, activité: item.actType}; })
  };

  fetch(url, {
    method: method,
    headers: this.state.fetchHeaders,
    body: JSON.stringify(body)
  })
  .then((response) => {
    hideLoading();
    return Promise.all([Promise.resolve(response.status), response.json()])
  })
  .then((res) => {
    let [status, body] = res;

    let success = status == 200;
    showToast( (success ? "Succès" : "Erreur") + "\n" +  body.message );

    // On redirige vers la page précédente uniquement en cas de succès
    if (success) {
      parent.getDemandesByUserAndYear(annee);
      that.props.navigation.dispatch(NavigationActions.back());
    }
  })
  .catch((err) => {
    console.log("ERREUR : \n" + err);
  })
}

  modifyItemCRA(l, startDate, actType, labelAct, valeur) {
    this.props.navigation.navigate("ActivitesDetail", {
      line: l,
      date: startDate,
      activite: actType,
      activiteLabel: labelAct,
      activiteValeur : valeur,
      parent: this,
    });
  }

  modifyPeriodeCRA() {
    this.props.navigation.navigate("ActivitesDetail", {
      line: -1,
      parent: this,
    });
  }

  showDeleteButton() {
    if(this.state.statusId == 1)
    return (
      <Button
        text="SUPPRIMER"
        buttonStyles={style.deleteButton}
        onPress={() =>
          Alert.alert(
            "Suppression",
            "Etes-vous sûr de vouloir supprimer le relevé d'activité ?",
            [
            { text: "Non", onPress: () => console.log("Cancel Pressed!") },
            { text: "Oui", onPress: () => this.deleteCra() },
            ]
          )}
      />
    );
  }

  showDraftButton() {
    if(this.state.statusId == 1 || this.state.statusId == null)
    return (
      <Button
        buttonStyles={style.draftButton}
        text="BROUILLON"
        onPress={() => this.saveCra(1)}
      />
    );
  }

  showValidateButton() {
    if(this.state.statusId == 1 || this.state.statusId == null)
      return <Button text="VALIDER" onPress={() => this.saveCra(2) } />;
  }

  afficherRows() {
    return this.state.listItemsCRA.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyItemCRA(i, row.startDate, row.actType, row.valeur)} disabled={row.disabled}>
        <Row
          style={[style.row, i % 2 && { backgroundColor: "#FFFFFF" }, (moment(row.startDate, "DD/MM/YYYY").day() == 0 || moment(row.startDate, "DD/MM/YYYY").day() == 6) && { backgroundColor: "#b4deea" } ]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[moment(row.startDate, 'DD/MM/YYYY').format('dddd DD/MM/YYYY'), row.actType]}
        />
      </TouchableOpacity>
    ));
  }

  handleValidate = () => {
    //TODO Retourne sur la page des CRA
    this.props.navigation.navigate("ActivitesListe"); //navigate back
  };

  //Affiche le contenu du menu des mois/années
  loadPickerItems() {
    return moment.months().map((item, i) => (
      <Picker.Item label={item + ' ' + this.state.yearSelected} value={i+1} key={i} />
    ));
  }

  render() {
    //Décralation du params transmis à l'écran courante.
    const { params } = this.props.navigation.state;

    let title = moment(this.state.yearSelected + '-' + this.state.monthSelected, 'YYYY-M').format("MMMM YYYY");

    if (!this.state.isReady) {
      return (
        <View>
          <ContainerTitre title={title}>
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
        <View>
          <ContainerTitre title={title} navigation={this.props.navigation}>
            <View style={style.container}>
              <View style={style.container1}>
                <View style={style.containerFirstLine}>
                  <Text style={style.text}>Etat : {this.state.data.libelle}</Text>
                </View>
                <View style={style.containerFirstLine}>
                  <Text style={style.text}>Jours ouvrés : {this.state.data.NbJOuvres ? this.state.data.NbJOuvres : '0'} j</Text>
                </View>
              </View>

              <View style={style.container1}>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>Travaillés : {this.getNbJoursTravailles().toFixed(1)} j</Text>
                </View>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>Absences : {this.getNbJoursAbsence().toFixed(1)} j</Text>
                </View>
              </View>

              <View style={style.containerButtonPeriod}>
                <Button
                  text="ÉDITER UNE PÉRIODE"
                  onPress={() => this.modifyPeriodeCRA()}
                >
                  {" "}
                  Periode
                </Button>
              </View>

              <View style={style.container3}>
                <Table
                  style={style.table}
                  borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
                >
                  <Row
                    data={this.state.header}
                    style={style.header}
                    textStyle={style.headerText}
                  />
                  {this.afficherRows()}
                </Table>
              </View>
              <Panel
                title="Information mission *"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
              >
                <View style={style.containerInformation}>
                  <View style={style.containerFirstLine}>
                    <Text style={style.text}>Client * : </Text>
                  </View>
                  <View style={style.containerInfoClt}>
                    <TextInput
                      style={style.textInputInfos}
                      value={this.state.TextClient}
                      editable={true}
                      placeholderTextColor="#000000"
                      onChangeText={TextClient => this.setState({ TextClient })}
                      underlineColorAndroid="transparent"
                    />
                  </View>

                  <View style={style.containerFirstLine}>
                    <Text style={style.textResponsable}> Responsable * : </Text>
                  </View>

                  <View style={style.containerInfoResp}>
                    <TextInput
                      style={style.textInputInfos}
                      value={this.state.TextResponsable}
                      editable={true}
                      placeholderTextColor="#000000"
                      onChangeText={TextResponsable =>
                        this.setState({ TextResponsable })}
                      underlineColorAndroid="transparent"
                    />
                  </View>

                  <View style={style.containerFirstLine}>
                    <Text style={style.textProjet}> Projet : </Text>
                  </View>

                  <View style={style.containerInfoPrj}>
                    <TextInput
                      style={style.textInputInfos}
                      value={this.state.TextProjet}
                      placeholderTextColor="#000000"
                      onChangeText={TextProjet => this.setState({ TextProjet })}
                      editable={true}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </Panel>

              <Panel
                title="Commentaire"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
              >
                <View style={style.containerCommentaire}>
                  <TextInput
                    style={style.textInputComment}
                    multiline={true}
                    editable={true}
                    numberOfLines={8}
                    onChangeText={TextComment => this.setState({ TextComment })}
                    placeholderTextColor="#000000"
                    value={this.state.TextComment}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </Panel>
              <View style={style.containerButton}>
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
  AjoutCra: {
    screen: AjoutCra,
    navigationOptions: { header: null },
  },
  ActivitesDetail: {
    screen: ActivitesDetail,
    navigationOptions: { header: null },
  },

  CraConfirmation: {
    screen: CraConfirmation,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
