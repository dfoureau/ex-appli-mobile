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
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

import {
  Row,
} from "react-native-table-component";

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

import configurationAppli from "../../../configuration/Configuration";

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
    const parent = params.parent;

    const calendarDateFormat = "YYYY-MM-DD";

    let calendarDate = null,
        calendarMinDate = null,
        calendarMaxDate = null;


    let activitesListe = [];

    if (params.date != undefined && params.date != null) {
      let dayDate = moment(params.date, "DD/MM/YYYY");
      let dayNumber = dayDate.day();
      if (dayNumber == 0 || dayNumber == 6 || dayDate.isFerie()) {
        // Jours en weekend, Dimanche ou Samedi
        activitesListe = parent.state.activitesListe.jourwe;
      } else {
        // Jours en semaine
        activitesListe = parent.state.activitesListe.jourouvre;
      }
    }
    else {
      // Cas d'une période
      const date = moment({year: parent.state.yearSelected, month: parent.state.monthSelected -1});

      calendarDate = date.format(calendarDateFormat);
      calendarMinDate = date.startOf('month').format(calendarDateFormat);
      calendarMaxDate = date.endOf('month').format(calendarDateFormat);

      activitesListe = parent.state.activitesListe.jourouvre;
    }

    this.state = {
      title: "Détails jour",
      date: params.date,
      linesToChange: (params.line >= 0) ? [params.line] : [],
      isPeriod: (params.line == undefined || params.line == null),
      activitesListe: activitesListe,
      activiteClicked: { code: params.activite, label: params.activite },
      webServiceLien1: configurationAppli.apiURL + "CRA/typesactivites",
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
      statusId: parent.state.statusId,
      calendarDate: calendarDate,
      calendarMinDate: calendarMinDate,
      calendarMaxDate: calendarMaxDate,
      calendarDateFormat: calendarDateFormat
    };
  }

  /**
   * Vérifie si un jour donné est compatible avec le code sélectionné
   * On renvoie false si aucun code n'est sélectionné
   * @param  {[type]} day [description]
   * @return {[type]}     [description]
   */
  checkDay(day) {
    let code = this.state.activiteClicked.code;

    if (code == "" || code == undefined ||code == null) {
      return false;
    }
    else {
      const parent = this.props.navigation.state.params.parent;
      const codesOuvres = parent.state.activitesListe.jourouvre;
      const codesWE     = parent.state.activitesListe.jourwe;

      let date = moment({
        year: parent.state.yearSelected,
        month: parent.state.monthSelected -1,
        day: day
      });

      let index = -1;
      if (date.day() > 0 && date.day() < 6 && !date.isFerie()) {

        index = codesOuvres.findIndex((item) => {
          return Boolean(item.code == code);
        })
      }
      else {
        index = codesWE.findIndex((item) => {
          return item.code == code;
        })
      }

      if (index >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  handleValidate() {
    const { params } = this.props.navigation.state;
    let parent = params.parent;

    // En cas de période, on parcourt tous les jours sélectionnés, et on vérifie
    // qu'ils ont tous un code valide.
    let date = moment(this.state.calendarDate, this.state.calendarDateFormat);

    let codeOk = this.state.linesToChange.every((item) => {
      return this.checkDay(item +1)
    })

    if (codeOk) {
      let listItemsCRA = Array.from(parent.state.listItemsCRA);

      for (item of this.state.linesToChange) {
        listItemsCRA[item].actType = this.state.activiteClicked.code;
      }
      parent.setState({listItemsCRA: listItemsCRA},()=>{ this.props.navigation.dispatch(NavigationActions.back()); }); //on retourne à la page précédente qui à été modifié
    }
    else {
      showToast("Le code choisi est incompatible avec certains jours de la période.");
    }
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
                onPress={() => {
                  this.setState({
                      activiteClicked: activite
                  });
                }}
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
    this.setState({
      linesToChange: [...set]
    });
  }

  convertDates() {
    //Converti les dates selectionnees stockees sous forme de tableau en objet
    let datesObject = {};
    let currentDate = moment(this.state.calendarDate, this.state.calendarDateFormat);
    const errDay = {key: "errDay", color: 'red'};

    this.state.linesToChange.forEach(index => {
      let dots = [];

      if (!this.checkDay(index +1, this.state.activiteClicked.code)) {
        dots.push(errDay);
      }

      datesObject[currentDate.date(index +1).format(this.state.calendarDateFormat)] = {
        selected: true,
        dots: dots,
      };
    });
    return datesObject;
  }

  renderDate() {
    let ret = null;
    if (this.state.isPeriod) {
      ret = (
        <View style={styles.containerCalendar}>
          <Calendar
            current={this.state.calendarDate}
            minDate={this.state.calendarMinDate}
            maxDate={this.state.calendarMaxDate}
            firstDay={1}
            hideArrows={true}
            markedDates={this.convertDates()}
            markingType="multi-dot"
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

  showValidateButton() {
    if (this.state.statusId == 1 || this.state.statusId == null || this.state.statusId == 2) {
      return (
        <View style={styles.stickyFooter}>
          <View style={styles.containerButton}>
            <Button
              styleButton={styles.validateButton}
              text="VALIDER"
              onPress={() => this.handleValidate()}
            />
          </View>
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
              onPress={() =>
                this.props.navigation.dispatch(NavigationActions.back())}
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

        {this.showValidateButton()}
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
