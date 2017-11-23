import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  ScrollView,
  Alert,
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

import moment from "moment";
import "whatwg-fetch";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import ActivitesDetail from "../activitesDetail/ActivitesDetail";
import CraConfirmation from "../craConfirmation/CraConfirmation";
import Style from "../../../styles/Styles";
import style from "./styles";
import Panel from "../../../components/Panel/Panel";
import service from "../../../realm/service";

import configurationAppli from "../../../configuration/Configuration";

const ITEMCRA_SCHEMA = "ItemCRA";

class AjoutCra extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  static navigationOptions = ({ navigation }) => ({
    idCRA: navigation.state.params.idCRA,
    date: navigation.state.params.date,
  });

  setInitialValues() {
    const { params } = this.props.navigation.state;
    let dateStr = moment().format("MMMM YYYY");
    this.state = {
      title: "",
      statusId: 1,
      TextClient: " ",
      TextResponsable: " ",
      TextProjet: " ",
      TextComment: " ",
      status: "Nouveau",
      header: ["Date", "Activité"],
      monthSelected: dateStr.charAt(0).toUpperCase() + dateStr.slice(1), //la premiere lettre du mois en majuscule
      //listItemsCRA: this.getItemsCRA(), //liste des cra du mois, doit être ordonée
      listItemsCRA : [],
	  modifiedLines: [], //liste des lignes à modifier si validation
	  activitesListeJourOuvre: [],
	  activitesListe: [],
      userId: configurationAppli.userID,
      objGET: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
      WSLinkCRA: configurationAppli.apiURL + "CRA/RA/",
	  webServiceLien1: configurationAppli.apiURL + "CRA/typesactivites",
      isReady: false,
      data: [],
    };

    if (params.isServiceCalled) {
      this.saveItemsCRA();
    }
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
  fetch(this.state.webServiceLien1,)
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
        }
		//, () => { console.log( that.state.activitesListe )} 
		);
      }) 
   }

  getCRAInfosByID(idCRA) {
    var that = this;

    fetch(this.state.WSLinkCRA + idCRA, this.state.objGET)
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
      //console.log(cra.valeursSaisies);
      that.setState({
        isReady: true,
        data: cra,
		    listItemsCRA : that.getItemsCRA(cra.valeursSaisies),
      });  
	  //console.log("statevs : "  + that.state.data.valeursSaisies.length);
    });
	

  }

getItemsCRA(valeursSaisies) {
	   var rows = [];
	   for (var i = 0; i < valeursSaisies.length; i++) {
		   rows.push(
		  <Row
		  startDate={valeursSaisies[i]['date']}
		  actType={valeursSaisies[i]['activité']}
        />
		);
		    }
    return rows;
  }


  saveItemsCRA() {
    let list = [];
    // Enregistrement des items du CRA dans le cache
    if (this.state.listItemsCRA != null) {
      this.state.listItemsCRA.forEach(function(item) {
        var itemCRA = {
          id: service.getNextKey(ITEMCRA_SCHEMA),
          idItem: item.id,
          idCRA: item.idCRA,
          startDate: item.startDate,
          endDate: item.endDate,
          actType: item.actType,
          workingDays: 1,
        };

        list.push(itemCRA); //need to replace, not to push
        service.insert(ITEMCRA_SCHEMA, itemCRA);
      });

      this.state.listItemsCRA = list; 
    }
  }

  deleteCr() {}

  validatePressDelete() {
    this.props.navigation.navigate("CraConfirmation");
  }

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

  modifyItemCRA(l,startDate,actType) {
    this.props.navigation.navigate("ActivitesDetail", {
      line: l,
      //date: '01/02/2017',
      //activite: 'IC',
      date : startDate,
	  activite : actType,
	  parent: this,
    });
	//console.log("texto : "  + startDate);
  }
 
  
  
  modifyPeriodeCRA() {
    this.props.navigation.navigate("ActivitesDetail", {
      line: -1,
      parent: this,
    });
  }   
 
  showDeleteButton() {
    //if(this.state.statusId == 1 || this.state.statusId == 2)
    return (
      <Button
        text="SUPPRIMER"
        buttonStyles={style.deleteButton}
        onPress={() =>
          Alert.alert(
            "Suppression",
            "Etes-vous sûr de vouloir supprimer le relevé d activité ?",
            [
              { text: "Non", onPress: () => console.log("Cancel Pressed!") },
              { text: "Oui", onPress: () => this.validatePressDelete() },
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
    //if(this.state.statusId == 1 || this.state.statusId == 2)
    return <Button text="VALIDER" onPress={() => this.validate()} />;
  }

  afficherRows() {
       return this.state.listItemsCRA.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyItemCRA(i,row.props.startDate,row.props.actType)}>
        <Row
          style={[style.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[row.props.startDate, row.props.actType]}
        />
      </TouchableOpacity>
    ));
/*
   let items = this.state.listItemsCRA;
	//console.log(this.state.listItemsCRA);
    return this.getRows(items); 
  */
  }

  
 
  
  /*
  getRows(tab) {
    return tab.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyItemCRA(i)}>
        <Row
          style={[style.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[row.props.startDate, row.props.actType]}
        />
      </TouchableOpacity>
    ));
  }*/


  handleValidate = () => {
    //TODO Retourne sur la page des CRA
    this.props.navigation.navigate("ActivitesListe"); //navigate back
  };

  render() {
    //Décralation du params transmis à l'écran courante.
    const { params } = this.props.navigation.state;
 
    return (
      <View>
        <ContainerTitre title={params.date} navigation={this.props.navigation}>
          <View style={style.container}>
            <View style={style.container1}>
              <View style={style.containerFirstLine}>
                <Text style={style.text}>Etat : {this.state.data.libelle}</Text>
              </View>
            </View>

            <View style={style.containerSecondLine}>
              <Text style={style.text}>Jours ouvrés : {this.state.data.NbJOuvres ? this.state.data.NbJOuvres : '0'} j</Text>
            </View>

            <View style={style.container1}>
              <View style={style.containerThirdLine}>
                <Text style={style.text}>Travaillés : {this.state.data.nbJourTravailles ? this.state.data.nbJourTravailles : '0'} j</Text>
              </View>
              <View style={style.containerThirdLine}>
                <Text style={style.textAbsences}>Absences : {this.state.data.nbJourAbs ? this.state.data.nbJourAbs : '0'} j</Text>
              </View>
              <View style={style.containerThirdLine}>
                <View style={style.containerPicker}>
                  <Picker
                    style={{
                      width: 162,
                    }}
                    selectedValue={
                      params.idCRA == null
                        ? this.state.monthSelected
                        : params.Idate
                    }
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ monthSelected: itemIndex })}
                  >
                    <Picker.Item
                      label="Janvier 2017"
                      value="Janvier 2017"
                      key="1"
                    />
                    <Picker.Item
                      label="Février 2017"
                      value="Février 2017"
                      key="2"
                    />
                    <Picker.Item label="Mars 2017" value="Mars 2017" key="3" />
                    <Picker.Item
                      label="Avril 2017"
                      value="Avril 2017"
                      key="4"
                    />
                    <Picker.Item label="Mai 2017" value="Mai 2017" key="5" />
                    <Picker.Item label="Juin 2017" value="Juin 2017" key="6" />
                    <Picker.Item
                      label="Juillet 2017"
                      value="Juillet 2017"
                      key="7"
                    />
                    <Picker.Item label="Août 2017" value="Août 2017" key="8" />
                    <Picker.Item
                      label="Septembre 2017"
                      value="Septembre 2017"
                      key="9"
                    />
                    <Picker.Item
                      label="Octobre 2017"
                      value="Octobre 2017"
                      key="10"
                    />
                    <Picker.Item
                      label="Novembre 2017"
                      value="Novembre 2017"
                      key="11"
                    />
                    <Picker.Item
                      label="Décembre 2017"
                      value="Décembre 2017"
                      key="12"
                    />
                  </Picker> 
                </View>
              </View>
            </View>

            <Button
              text="Editer une Periode"
              onPress={() => this.modifyPeriodeCRA()}
            >
              {" "}
              Periode
            </Button>

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
                    value={this.state.data.client ? this.state.data.client : ''}
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
                    value={this.state.data.responsable ? this.state.data.responsable : ''}
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
                    value={this.state.data.projet ? this.state.data.projet : ''}
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
                  numberOfLines={4}
                  onChangeText={textComment => this.setState({ textComment })}
                  placeholderTextColor="#000000"
                  value={this.state.data.commentaires ? this.state.data.commentaires : ''}
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
