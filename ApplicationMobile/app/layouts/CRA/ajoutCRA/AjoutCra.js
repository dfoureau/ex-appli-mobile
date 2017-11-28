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
  hide,
} from "react-native-notifyer";

import moment from "moment";
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
import service from "../../../realm/service";

import configurationAppli from "../../../configuration/Configuration";

class AjoutCra extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  static navigationOptions = ({ navigation }) => ({
    idCRA: navigation.state.params.idCRA,
    // date: navigation.state.params.date,
  });

  setInitialValues() {
    const { params } = this.props.navigation.state;

    let now = moment();
    monthSelected = now.month() + 1; // On prend le mois +1 à case de l'indexation des mois en javascript (0 -> 11)
    yearSelected = now.year();

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
      listItemsCRA : [],
      modifiedLines: [], //liste des lignes à modifier si validation
      activitesListeJourOuvre: [],
      activitesListeJourWE: [],
      activitesListe: [],
      userId: configurationAppli.userID,
      fetchHeaders: {
        Authorization: "Bearer " + configurationAppli.userToken,
      },
      WSLinkCRA: configurationAppli.apiURL + "CRA/RA/",
	    webServiceLien1: configurationAppli.apiURL + "CRA/typesactivites",
      isReady: false,
      data: [],
    };

  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  componentWillMount() {
    var that = this;
    //Récupération des paramètres de navigation
    const { params } = this.props.navigation.state;

	  this.getTypeActivite();

    if (params.idCRA != null) {
      // Récupere les périodes
      this.getCRAInfosByID(params.idCRA);
    } else {
      that.setState({
        data: [],
        isReady: true,
      });
    }
  }

   getTypeActivite() {
    var that = this;
    fetch(this.state.webServiceLien1, {
      method: 'GET',
      headers: this.state.fetchHeaders
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("GetUtilisateur : Bad response from server");
        }
        return response.json();
      })
      .then(function(typesactivites) {
        that.setState({
          activitesListe: typesactivites,
          activitesListeJourOuvre : typesactivites['jourouvre'],
          activitesListeJourWE : typesactivites['jourwe'],
        });
      })
   }

  getCRAInfosByID(idCRA) {
    var that = this;
    fetch(this.state.WSLinkCRA + idCRA,  {
      method: 'GET',
      headers: this.state.fetchHeaders
    })
    .then(function(response) {
      if (response.status >= 400) {
        that.setState({
          data: [],
          idReady: true,
        });
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(cra) {
      that.setState({
        isReady: true,
        data: cra,
        statusId: cra.etat,
        listItemsCRA : that.getItemsCRA(cra.valeursSaisies),
        TextClient : cra.client,
        TextResponsable : cra.responsable,
        TextProjet : cra.projet,
        TextComment : cra.commentaires,
      });
    });
  }

  getItemsCRA(valeursSaisies) {
    return valeursSaisies.map((item) => {
      return {
        startDate: item.date,
        actType: item.activité,
        valeur: item.valeur
      };
    });
  }


  /**
   * Supprime le CRA via un appel au service
   * @return {[type]} [description]
   */
  deleteCra() {
    // var that = this;
    let idCra = this.props.navigation.state.params.idCRA,
        parent = this.props.navigation.state.params.parent,
        year = this.state.yearSelected;

    fetch(this.state.WSLinkCRA + idCra, {
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
        parent.getDemandesByUserAndYear(year);
        this.props.navigation.dispatch(NavigationActions.back());
      }
    })

  }

  // validatePressDelete() {
  //   this.props.navigation.navigate("CraConfirmation");
  // }

  saveDraft() {
    this.setState({
      statusId: 2,
      status: "brouillon",
    });
    this.props.navigation.navigate("CraConfirmation");
  }

  validate() {
    // Après sauvegarde en bdd, on reset le cache
    service.delete(ITEMCRA_SCHEMA);
    this.setState({
      statusId: 3,
      status: "validé",
    });
    this.props.navigation.navigate("CraConfirmation");
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
        onPress={() => this.saveDraft()}
      />
    );
  }

  showValidateButton() {
    if(this.state.statusId == 1 || this.state.statusId == null)
      return <Button text="VALIDER" onPress={() => this.validate()} />;
  }

  afficherRows() {
    return this.state.listItemsCRA.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyItemCRA(i, row.startDate, row.actType, row.valeur)}>
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
                  <Text style={style.text}>Travaillés : {this.state.data.nbJourTravailles ? this.state.data.nbJourTravailles : '0'} j</Text>
                </View>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>Absences : {this.state.data.nbJourAbs ? this.state.data.nbJourAbs : '0'} j</Text>
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
