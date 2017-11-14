import React from "react";
import {
  View,
  Picker,
  Image,
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
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


//import service from "../../../realm/service";

const ITEMCRA_SCHEMA = "ItemCRA";

class ActivitesDetail extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }


  setInitialValues() {
    const { params } = this.props.navigation.state;

    var parent = params.parent;

    if(params.line == -1){
      this.state = {
        title: "Détails jours",
        isPeriod: true,
        month : parent.state.monthSelected,//for the calendar
        linesToChange: [],
        activitesListe: [
          { code: "1.0" },
          { code: "IC", label: "Intercontrat" },
          { code: "FO", label: "Formation" },
          { code: "AM", label: "Arrêt maladie" },
          { code: "AB", label: "Absence diverse" },
          { code: "0.5+FO", label: "0.5 + Formation" },
          { code: "0.5+AM", label: "0.5 + Arrêt maladie" },
          { code: "0.5+AB", label: "0.5 + Absence diverse" },
        ],
        activiteClicked: { code: "1.0" },
      };
    }else {
      let tmp =parent.state.listItemsCRA[params.line];
      this.state = {
        title: "Détails jour",
        isPeriod: false,
        date: tmp.startDate,
        linesToChange:[params.line],
        activitesListe: [
          { code: "1.0" },
          { code: "IC", label: "Intercontrat" },
          { code: "FO", label: "Formation" },
          { code: "AM", label: "Arrêt maladie" },
          { code: "AB", label: "Absence diverse" },
          { code: "0.5+FO", label: "0.5 + Formation" },
          { code: "0.5+AM", label: "0.5 + Arrêt maladie" },
          { code: "0.5+AB", label: "0.5 + Absence diverse" },
        ],
        activiteClicked: { code: tmp.actType },
      };
    }

  }

  choixActivite = activite => {
    // Change le bouton sélectionné
    var tmp = this.state;
    tmp.activiteClicked = activite;
    this.setState(tmp);
  };

  handleValidate() {
    const { params } = this.props.navigation.state;
    var parentState = params.parent.state;
    for (var i = 0; i < this.state.linesToChange.length; i++) {
      parentState.listItemsCRA[this.state.linesToChange[i]].actType=this.state.activiteClicked.code;
      parentState.modifiedLines = [...new Set(parentState.modifiedLines)];//on ajoute la ligne modifié sans garder les doublons
    }
    params.parent.forceUpdate();//force l'appel de la fonction render sur la page précedente
    this.props.navigation.dispatch(NavigationActions.back());//on retourne à la page précédente qui à été modifié
  }

  // Gère le rendu des boutons sur plusieurs lignes, et gère le toggle
  renderActiviteButtons = () => {
    console.log(this.state.activitesListe);
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

    let index = day.day-1;
    let set = new Set(this.state.linesToChange);
    if (!set.has(index)) {
      //Ajout d'une date dans le tableau
      set.add(index);
    } else{
      //Suppression d'une date du tableau
      set.delete(index);
    }
    this.state.linesToChange= [...set];
    this.forceUpdate();
  }

  convertDates() {
    //Converti les dates selectionnees stockees sous forme de tableau en objet
    let datesObject = {};
    this.state.linesToChange.forEach(date => {
      datesObject[date+1] = [
        { startingDay: true, color: "#355A86" },
        { endingDay: true, color: "#355A86", textColor: "#ffff" },
      ];
    });
    return datesObject;
  }


  renderDate()
  {
    let ret = null;
    if(this.state.isPeriod)
    {
      ret =
      <View style={styles.containerCalendar}>
        <Calendar

          hideArrows={true}
          markedDates={this.convertDates()}
          markingType={"interactive"}
          onDayPress={day => this.onDateSelected(day)}
        />
      </View>
    ;
    }else {
      ret =<View style={styles.calendarContainer}>

          <Text style={styles.calendarText}>{this.state.date} </Text>


      </View>;
    }
    return ret;
  };
  //Gère l'affichage du détail d'une activité quand sélectionnée
  renderDetailActivite() {
    let activite = this.state.activiteClicked;
    if (activite.code != undefined)
      if (activite.label != undefined)
        return (
          <Text style={styles.text}>
            {activite.code} = {activite.label}
          </Text>
        );
      else return <Text style={styles.text}>{activite.code}</Text>;
  }

  render() {
    return (
      <View>
        <ContainerTitre
          title={this.state.title}
          navigation={this.props.navigation}
        >
          <View style={Style.firstView}>
            {this.renderDate()}
          </View>
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
          <View style={Style.firstView}>
            <View style={styles.containerButton}>
              <Button
                styleButton={styles.validateButton}
                text="Valider"
                onPress={() => this.handleValidate()}
              />
            </View>
          </View>
        </ContainerTitre>
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
