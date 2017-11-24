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
} from "react-native";

import {
  Row,
} from "react-native-table-component";

import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import moment from "moment";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import { Calendar } from "react-native-calendars";
import styles from "./styles";

import configurationAppli from "../../../configuration/Configuration";

//import service from "../../../realm/service";

const ITEMCRA_SCHEMA = "ItemCRA";

class ActivitesDetail extends React.Component {
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
    
    var parent = params.parent;

    let dayDate = moment(params.date, "DD/MM/YYYY");
    let dayNumber = dayDate.day();
    let activitesListe = [];

    if (dayNumber == 0 || dayNumber == 6) {
      // Jours en weekend, Dimanche ou Samedi
      activitesListe = parent.state.activitesListeJourWE;
    } else {
      // Jours en semaine
      activitesListe = parent.state.activitesListeJourOuvre;
    }

    let tmp = parent.state.listItemsCRA[params.line];

    this.state = {
      title: "Détails jour",
      date: params.date,
      linesToChange: [params.line],
      activitesListeJourOuvre: parent.state.activitesListeJourOuvre,
      activitesListeJourWE: parent.state.activitesListeJourWE,
      activitesListe: activitesListe,
      activiteClicked: { code: params.activite, label: params.activite },
      webServiceLien1: configurationAppli.apiURL + "CRA/typesactivites",
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
    };
  }

  choixActivite = activite => {
    // Change le bouton sélectionné
    var tmp = this.state;
    tmp.activiteClicked = activite;
    this.setState(tmp);
  };

  handleValidate() {
    const { params } = this.props.navigation.state;
    var parent = params.parent;
	
	let listItemsCRA = Array.from(parent.state.listItemsCRA);
	
	listItemsCRA[this.state.linesToChange] = 
	
	(<Row
		  startDate={this.state.date}
		  actType={this.state.activiteClicked.code}
        />)
	  parent.setState({listItemsCRA: listItemsCRA},()=>{this.props.navigation.dispatch(NavigationActions.back())}); //on retourne à la page précédente qui à été modifié
  }

  // Gère le rendu des boutons sur plusieurs lignes, et gère le toggle
  renderActiviteButtons = () => {
    let button,
    buttons = [];
    const maxItems = 4;
    let tempLength = this.state.activitesListe.length / 4;
    
    //Boucle sur les 2 Lignes
    for (let j = 0; j < tempLength; j++) {
      //Boucle sur les Boutons
      let button = [];
      for (let i = 0; i < maxItems; i++) {
        let nb = i + maxItems * j;
        if (this.state.activitesListe[nb] != undefined) {
          let activite = this.state.activitesListe[nb];
          let code = activite.code;
          let styleButton = styles.btnChoixDetail;

          // Si le bouton courant est dans le state activiteClicked, un style lui est rajouté
          if (
            this.state.activiteClicked.code != null &&
            this.state.activiteClicked.code == code
          ) {
            styleButton = [styles.btnChoixDetail, styles.btnChoixClicked];
          }

          button.push(
            <View key={nb}>
              <TouchableOpacity
                onPress={() => this.choixActivite(activite)}
                style={styleButton}
              >
                <Text style={styles.activitesText}>{code}</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
      // Ajoute la liste des boutons à la ligne
      buttons.push(
        <View
          key={j + 100}
          style={[styles.calendarFlexContainer, styles.marginBottom20]}
        >
        {button}
        </View>
      );
    }
    return buttons;
  };

  onDateSelected(day) {
    let index = day.day - 1;
    let set = new Set(this.state.linesToChange);
    if (!set.has(index)) {
      //Ajout d'une date dans le tableau
      set.add(index);
    } else {
      //Suppression d'une date du tableau
      set.delete(index);
    }
    this.state.linesToChange = [...set];
    this.forceUpdate();
  }

  convertDates() {
    //Converti les dates selectionnees stockees sous forme de tableau en objet
    let datesObject = {};
    this.state.linesToChange.forEach(date => {
      datesObject[date + 1] = [
        { startingDay: true, color: "#355A86" },
        { endingDay: true, color: "#355A86", textColor: "#ffff" },
      ];
    });
    return datesObject;
  }

  renderDate() {
    let ret = null;
    if (this.state.isPeriod) {
      ret = (
        <View style={styles.containerCalendar}>
          <Calendar
            hideArrows={true}
            markedDates={this.convertDates()}
            markingType={"interactive"}
            onDayPress={day => this.onDateSelected(day)}
          />
        </View>
      );
    } else {
      ret = (
        <View style={styles.calendarContainer}>
          <Text style={styles.texteDate}>{this.state.date} </Text>
        </View>
      );
    }
    return ret;
  }
  //Gère l'affichage du détail d'une activité quand sélectionnée
  renderDetailActivite() {
    let activite = this.state.activiteClicked;
    if (activite.code != undefined)
      if (activite.label != undefined)
        return (
          <Text style={styles.texteLabel}>
            {activite.code} = {activite.label}
          </Text>
        );
      else return <Text style={styles.texteLabel}>{activite.code}</Text>;
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollViewBody}>

          {/*Le containerTitre est remplacé par ce code spécifique pour pouvoir mettre un footer persistent*/}
          <View style={styles.ContainerHeader}>
            <TouchableHighlight
              style={styles.MenuIconLink}
              onPress={() => this.props.navigation.dispatch(NavigationActions.back()) }
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
          <View style={Style.firstView}>{this.renderDate()}</View>
          <View style={Style.firstView}>
            <View style={styles.detailActivite}>
              {this.renderDetailActivite()}
            </View>
          </View>
          <View style={Style.firstView}>
            <View style={[styles.calendarContainer]}>
              {this.renderActiviteButtons()}
            </View>
          </View>

          </ScrollView>

          <View style={styles.stickyFooter}>
            <View style={styles.containerButton}>
              <Button
                styleButton={styles.validateButton}
                text="VALIDER"
                onPress={() => this.handleValidate()}
              />
            </View>
          </View>

      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  ActivitesDetail: {
    screen: ActivitesDetail,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
