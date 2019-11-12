import React from "react";
import {
  View,
  Picker,
  Image,
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

import { Row } from "react-native-table-component";

import Icon from "react-native-vector-icons/FontAwesome";


import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import moment from "moment";
import feries from "moment-ferie-fr";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import { Calendar } from "react-native-calendars";
import styles from "./styles";
import style from "../ajoutCRA/styles";

import configurationAppli from "../../../configuration/Configuration";

class ClientsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  static navigationOptions = ({ navigation }) => ({
    date: navigation.state.params.date,
    activite: navigation.state.params.activite,
  });

  setInitialValues() {
    const { params } = this.props.navigation.state;
    const parent = params.parent;

    const calendarDateFormat = "YYYY-MM-DD";

    let calendarDate = null;
    let calendarMinDate = null;
    let calendarMaxDate = null;

    if (params.date != undefined && params.date != null) {
      let dayDate = moment(params.date, "DD/MM/YYYY");
      let dayNumber = dayDate.day();
    } else {
      // Cas d'une période
      const date = moment({
        year: parent.state.yearSelected,
        month: parent.state.monthSelected - 1,
      });
      calendarDate = date.format(calendarDateFormat);
      calendarMinDate = date.startOf("month").format(calendarDateFormat);
      calendarMaxDate = date.endOf("month").format(calendarDateFormat);
    }

    this.state = {
      title: "Détails client",
      linesToChange: ( params.ActualCalendar[params.idClient]!= null) ? params.ActualCalendar[params.idClient] : [],
      statusId: parent.state.statusId,
      calendarDate: calendarDate,
      calendarMinDate: calendarMinDate,
      calendarMaxDate: calendarMaxDate,
      calendarDateFormat: calendarDateFormat,
      textClient : " ",
      idClient : params.idClient,
      paramClient : params.clientText,
      paramReponsable : params.responsableText,
      paramProject : params.projetText,
      TextClient :( !params.clientText.includes("Client") ) ? params.clientText : null,
      TextResponsable : ( !params.clientText.includes("Client")) ? params.responsableText : null,
      TextProjet : ( !params.clientText.includes("Client") ) ? params.projetText : null,
      paramActualCalendar : params.ActualCalendar,
      listItem : params.listItem,
      vacationItems : ["0.0","AB","RT","CS","AM","CPA","FO","CMA"],
    };
  }

  /**
  * Fonction suite au clique sur le bouton "Valider"
  * Envoie les données à la page parent => AjoutCraMulti.js
  */
  handleValidate() {
    // Vérification des champs obligatoires client, responsable et projet :
    let errMsg = "";
    if (this.state.TextClient == null) {
      errMsg += (errMsg != "" ? "\n" : "") + "Veuillez renseigner le nom du client.";
    }
    if (this.state.TextProjet == null) {
      errMsg += (errMsg != "" ? "\n " : "") + "Veuillez renseigner le nom du projet.";
    }
    if (this.state.TextResponsable == null) {
      errMsg += (errMsg != "" ? "\n Et" : "") + "Veuillez renseigner le nom du responsable.";
    }
    if (errMsg != "") {
      showToast(errMsg);
      return;
    }

    // Préparation des valeurs à envoyer
    const { params } = this.props.navigation.state;
    let parent = params.parent;
    let id = this.state.idClient;
    console.log("IdClientValideé : ", id)

    let date = moment(this.state.calendarDate, this.state.calendarDateFormat);
    let listClients = Array.from(parent.state.Clients);
    let listProjets = Array.from(parent.state.Projets);
    let listResponsables = Array.from(parent.state.Responsables);
    let listCalendars = Array.from(parent.state.CalendarClient);

    listClients[id] = this.state.TextClient
    listProjets[id] = this.state.TextProjet
    listResponsables[id] = this.state.TextResponsable
    listCalendars[id] = this.state.linesToChange

    parent.setState({ Clients: listClients, Projets : listProjets, Responsables: listResponsables, CalendarClient: listCalendars }, () => {
      this.props.navigation.dispatch(NavigationActions.back());
    }); //on retourne à la page précédente qui à été modifié
  }

  /**
  * Quand une date est séléctionnée, elle est ajoutée au tableau linesToChange
  */
  onDateSelected(day) {
    let index = day.day - 1;
    let set = new Set(this.state.linesToChange);

    if (!set.has(index)) {
      if(!this.state.vacationItems.includes(this.state.listItem[index].actType)) { //Evite la selection d'une date de congés ou autre
        //Ajout d'une date dans le tableau
        set.add(index);
       }
    } else {
      //Suppression d'une date du tableau
      set.delete(index);
    }
    this.setState({
      linesToChange: [...set],
    });
  }


  /**
  * Converti les dates selectionnees stockees sous forme de tableau en objet
  * @return {[datesObject]} Permettant d'ajouter des dots et selections au calendrier
  */
  convertDates() {
    let datesObject = {};
    let currentDate = moment(
      this.state.calendarDate,
      this.state.calendarDateFormat
    );
    let format = this.state.calendarDateFormat;
    let idUseClient = this.state.idClient;
    let actualCalendar = this.state.paramActualCalendar
    let vacationItemsCopy = this.state.vacationItems
    let arrayStillWorked = [];

    const errDay = { key: "errDay", color: "red" };


    //Petits points bleu sur le calendrier pour les dates déjà séléctionnées pour un autre client
    if(this.state.paramActualCalendar!= null) {
      const stillWorked = {key:'stillWorked', color: "#255b9c", selectedDotColor: 'blue'};
      this.state.paramActualCalendar.forEach( function(calendrier,index) { //Pour chaque calendrier déjà rempli : Ajout des dates dans le calendrier via des petits points bleu
        if(index != idUseClient){
          calendrier.forEach(day => {
            arrayStillWorked.push(day)
            datesObject[ currentDate.date(day + 1).format(format) ] = {
              dots: [stillWorked],
              }
            }
          )
        }
      })
    }


//Points pour les dates en cours de séléction
this.state.linesToChange.forEach(index => {
    const stillWorked = {key:'stillWorked', color: "#255b9c", selectedDotColor: 'blue'};
    if(arrayStillWorked.includes(index)){
      datesObject[
        currentDate.date(index + 1).format(format)
      ] = {
        selected: true,
          dots: [stillWorked],
      };
    }
    else{
      datesObject[
        currentDate.date(index + 1).format(format)
      ] = {
        selected: true,
      };
    }
  }
);

//Petits points sur le calendrier poour les dates non disponible
if(this.state.paramActualCalendar!= null)
{
  const vacation = {key:'vacation', color: "#d43d3d", selectedDotColor: 'blue'};
  const other = {key:'oter', color: 'orange', selectedDotColor: 'blue'};
  let i = 1;
  this.state.listItem.forEach(day => {
    if(vacationItemsCopy.includes(day.actType)) //Si l'element fait parti des elements de vacationItems
    {
      datesObject[ currentDate.date(i).format(format) ] = {
        dots: [vacation],
      }
    }
    else if(day.actType.includes("1.0")){
      //Ne rien faire
    }
    else {
      datesObject[ currentDate.date(i).format(format) ] = {
        dots: [other],
      }
    }
    i++;
  }
)
}

return datesObject;
}

renderDate() {
  let ret = null;
    ret = (
      <View style={styles.containerCalendar}>
      <Calendar
      current={this.state.calendarDate}
      minDate={this.state.calendarMinDate}
      maxDate={this.state.calendarMaxDate}
      firstDay={1}
      hideArrows={true}
      hideExtraDays={true}
      markedDates={this.convertDates()}
      markingType="multi-dot"
      onDayPress={day => this.onDateSelected(day)}
      />
      </View>
    )
  return ret;
}

/**
* Affichage du bouton de validation
*/
showValidateButton() {
  if (
    this.state.statusId == 1 ||
    this.state.statusId == null ||
    this.state.statusId == 4
  ) {
    return (
      <View style={styles.containerButton}>
      <Button
      styleButton={styles.validateButton}
      text="VALIDER"
      onPress={() => this.handleValidate()}
      />
      </View>
    );
  }
}

render() {
  return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollViewBody}>
          {/*Le containerTitre est remplacé par ce code spécifique pour pouvoir mettre un footer persistent*/}
          <View style={styles.ContainerHeader}>
            <TouchableHighlight
              style={styles.MenuIconLink}
              onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
            >
              <Image
                style={styles.MenuIcon}
                source={require("../../../images/icons/retour.png")}
              />
            </TouchableHighlight>
            <Image
              style={styles.LogoTitreCat}
              source={require("../../../images/logo.png")}
            />
            <Text style={styles.TextHeader}>{this.state.title}</Text>
          </View>

          {/*Contenu*/}
          <View>
          <Text style={{textAlign: 'center', marginTop: 8, marginBottom: 5}}>Sélectionnez les jours travaillés pour ce client </Text>
          </View>
          <View style={styles.containerLegende}>
            <View style={{flexDirection: 'row',alignItems:"center",}}>
              <View>
                <Icon name="circle" size={6} color="#255b9c"></Icon>
              </View>
              <View>
                <Text style={{fontSize: 12}}>  Autre client</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row',alignItems:"center",}}>
              <View>
                <Icon name="circle" size={6} color="#d43d3d"></Icon>
              </View>
              <View>
                <Text style={{fontSize: 12}}>  Non travaillé</Text>
              </View>
            </View>

          </View>


          <View style={Style.firstView}>{this.renderDate()}</View>



          <View style={style.containerInformation}>
            {/*Partie nom du client*/}
            <View style={style.containerFirstLine}>
              <Text style={style.text}>Client * : </Text>
            </View>
            <View style={style.containerInfoClt}>
              <TextInput
                style={style.textInputInfos}
                value={this.state.TextClient}
                placeholder={this.state.paramClient}
                editable={true}
                onChangeText={TextClient => this.setState({ TextClient })}
                underlineColorAndroid="transparent"
              />
            </View>

            {/*Partie nom du résponsable*/}
            <View style={style.containerFirstLine}>
              <Text style={style.textResponsable}> Responsable * : </Text>
            </View>
            <View style={style.containerInfoResp}>
              <TextInput
                style={style.textInputInfos}
                value={this.state.TextResponsable}
                placeholder={this.state.paramReponsable}
                editable={true}
                onChangeText={TextResponsable => this.setState({ TextResponsable })}
                underlineColorAndroid="transparent"
              />
            </View>

            {/*Partie nom du projet*/}
            <View style={style.containerFirstLine}>
              <Text style={style.textProjet}> Projet * : </Text>
            </View>
            <View style={style.containerInfoPrj}>
              <TextInput
                style={style.textInputInfos}
                value={this.state.TextProjet}
                placeholder={this.state.paramProject}
                onChangeText={TextProjet => this.setState({ TextProjet })}
                editable={true}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          {this.showValidateButton()}
        </ScrollView>
      </View>

      );
    }
  }

  // NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
  const navigation = StackNavigator({
    ClientsDetail: {
      screen: ClientsDetail,
      navigationOptions: { header: null },
    },
  });

  // EXPORT DE LA NAVIGATION
  export default navigation;
