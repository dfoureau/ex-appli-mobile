import React from "react";
import { Calendar } from "react-native-calendars";
import { CalendarConfig } from '../../../configuration/CalendarConfig';

import { View, Text, TextInput, ScrollView, Alert, TouchableHighlight, Image, } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import PropTypes from "prop-types";
import Style from "../../../styles/Styles";
import styles from "./styles";
import CheckBox from "react-native-check-box";
import moment from "moment";
import { momentConfig } from '../../../configuration/MomentConfig';

// IMPORT DES COMPOSANTS EXOTIQUES
//import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import Panel from "../../../components/Panel/Panel";

import FraisJour from "../utils/FraisJour";

class FraisDetail extends React.Component {
  static propTypes = {
    forfait: PropTypes.bool,
    month: PropTypes.number,
    id: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  findFraisJour(jour) {
      return ((element) => {return element.date == jour; });
  }

  setInitialValues() {
    // indique si on se trouve dans le cas d'un création de frais
    let isNewFrais = true;
    let calendarDateFormat = "YYYY-MM-DD";
    let calendarDate = moment().format(calendarDateFormat);

    const params = this.props.navigation.state.params;

    if (params.idFrais != null && params.idFrais != undefined) {
      // on récupère le frais dans le cas d'une modification
      calendarDate = moment(params.idFrais, 'DD-MM-YYYY');

      // Recherche du fraisJour dans la listFrais du parent
        var frais = params.parent.state.listFrais.find(this.findFraisJour(params.idFrais));

        if (frais != null && frais != undefined) {
          // il existe un frais déjà crée en cache
          isNewFrais = false;
        }
    }
    else {
      let month = params.parent.state.monthSelected
          year = params.parent.state.yearSelected;

          calendarDate = moment(year + '-' + month , 'YYYY-M');
    }

    calendarMinDate = calendarDate.clone().set('date', 1).format(calendarDateFormat);
    calendarMaxDate = calendarDate.clone().set('date', calendarDate.daysInMonth()).format(calendarDateFormat);

    this.state = {
      statusId: this.props.navigation.state.params.statusId,
      title: "Note de frais",
      selectedDatesArray: [],
      isforfait: this.props.navigation.state.params.forfait,
      isNewFrais: isNewFrais,
      facturable: !isNewFrais && frais.detail.facturable,
      client: isNewFrais ? "" : frais.detail.client,
      lieu: isNewFrais ? "" : frais.detail.lieu,
      nbKMS: isNewFrais ? "0" : frais.detail.nbKMS.toString(),
      indemKM: isNewFrais ? "0.00" : frais.detail.indemKM.toString(),
      forfait: isNewFrais ? "0.00" : frais.detail.forfait.toFixed(2),
      sncf: isNewFrais ? "0.00" : frais.detail.sncf.toFixed(2),
      peages: isNewFrais ? "0.00" : frais.detail.peages.toFixed(2),
      essence: isNewFrais ? "0.00" : frais.detail.essence.toFixed(2),
      taxi: isNewFrais ? "0.00" : frais.detail.taxi.toFixed(2),
      nbZones: isNewFrais ? "0" : frais.detail.nbZones.toFixed(0),
      pourcentage: isNewFrais ? "0.00" : frais.detail.pourcentage.toFixed(2),
      hotel: isNewFrais ? "0.00" : frais.detail.hotel.toFixed(2),
      repas: isNewFrais ? "0.00" : frais.detail.repas.toFixed(2),
      invit: isNewFrais ? "0.00" : frais.detail.invit.toFixed(2),
      parking: isNewFrais ? "0.00" : frais.detail.parking.toFixed(2),
      divers: isNewFrais ? "0.00" : frais.detail.divers.toFixed(2),
      libelle: isNewFrais ? "" : frais.detail.libelle,
      calendarDateFormat: calendarDateFormat,
      calendarDate: calendarDate.format(calendarDateFormat),
      calendarMinDate: calendarMinDate,
      calendarMaxDate: calendarMaxDate,
      joursFeries: [/* PLACEHOLDER pour stocker des objets momentjs correspondants à des jours fériés */],
    };
  }

  /** Au chargement **/
  setDatesArray() {
    let selectedDates = [];

    // dans le cas d'une modifcation d'un frais on alimente le tableau de date avec la date du frais (correspondant à son id)
    if (this.props.navigation.state.params.idFrais != null) {
      selectedDates.push(this.props.navigation.state.params.idFrais);
    }
    else {
          let currentDate = moment(this.state.calendarMinDate, this.state.calendarDateFormat);
          let nbJours = currentDate.daysInMonth(); // Nombre de jours dans le mois

          for (i=1; i<= nbJours; i++) {
            currentDate.set('date', i);

            if (currentDate.day() > 0 && currentDate.day() < 6 && !this.state.joursFeries.includes(currentDate)) {
              selectedDates.push(currentDate.clone().format('YYYY-MM-DD'));
            }
          }
        }
        return selectedDates;
      }

  onDateSelected(day) {
    let date = day.dateString;
    let index = this.state.selectedDatesArray.indexOf(date);
    if (index <= -1) {
      //Ajout d'une date dans le tableau
      this.setState(prevState => ({
        selectedDatesArray: [...prevState.selectedDatesArray, date],
      }));
    } else if (index > -1) {
      //Suppression d'une date du tableau
      this.setState(prevState => ({
        selectedDatesArray: [
          ...prevState.selectedDatesArray.slice(0, index),
          ...prevState.selectedDatesArray.slice(index + 1),
        ],
      }));
    }
  }

  afficherDate() {
    let date = moment(this.props.navigation.state.params.idFrais);
    return date.format("dddd DD MMMM YYYY");
  }

  //Inputs handle
  handleChecked() {
    this.setState(prevState => ({
      facturable: !prevState.facturable,
    }));
  }

  /**
   * Rassemble toutes les informations de détail relatives à un FraisJour
   * depuis le state, et renvoie un objet contenant toutes les
   * clés: valeurs correspondantes
   * @return {Boolean} [description]
   */
  getFraisJourData() {
    return {
      facturable: this.state.facturable,
      indemKM: this.state.indemKM,
      client: this.state.client,
      lieu: this.state.lieu,
      nbKMS: this.state.nbKMS,
      peages: this.state.peages,
      forfait: this.state.forfait,
      sncf: this.state.sncf,
      nbZones: this.state.nbZones,
      pourcentage: this.state.pourcentage,
      hotel: this.state.hotel,
      repas: this.state.repas,
      invit: this.state.invit,
      essence: this.state.essence,
      taxi: this.state.taxi,
      parking: this.state.parking,
      divers: this.state.divers,
      libelle: this.state.libelle
    };
  }

  /**
   * Fonction de validation de la note de frais
   * @return {[type]} [description]
   */
  handleValidate() {

    // On initialise l'objet fraisData à utiliser pour updater les fraisJours
    // à partir du state
    let fraisJourData = this.getFraisJourData();

    var parent = this.props.navigation.state.params.parent;
    var listFrais = Array.from(parent.state.listFrais);
    // Pour chaque date sélectionnée, on récupère le fraisJour correspondant
    // dans la listeFrais du parent, et on lui mappe les données de notre state
    this.state.selectedDatesArray.forEach( date => {

      //recherche du jour dans le tableau parent
      let fraisJour = listFrais.find(this.findFraisJour(date));
      if (fraisJour !== null && fraisJour !== undefined) {
        fraisJour.updateDetail(fraisJourData);
      }
      else {
        console.log("JOUR " + date + " : non trouvé");
      }

    });

    // On recalcule les montants totaux
      let totalMontant = 0,
          totalClient = 0;

      listFrais.forEach((fraisJour) => {
        totalMontant += fraisJour.totalAReglerFrais;
        totalClient +=  fraisJour.totalClientFrais;
      });

    parent.setState({
      totalMontant: totalMontant,
      totalClient: totalClient,
      listFrais: listFrais
    }, () => {
      this.props.navigation.dispatch(NavigationActions.back());
    });
  }

/**
 * Suppression : On crée un nouveau frais vide
 * pour chaque jour sélectionné
 * @return {[type]} [description]
 */
  handleDelete() {
    var parent = this.props.navigation.state.params.parent;
    var listFrais = Array.from(parent.state.listFrais);

    this.state.selectedDatesArray.forEach( date => {

      //recherche du jour dans le tableau parent
      let fraisJourIndex = listFrais.findIndex(this.findFraisJour(date));
      if (fraisJourIndex !== null && fraisJourIndex !== undefined) {
        listFrais[fraisJourIndex] = new FraisJour(date);
      }
      else {
        console.log("JOUR " + date + " : non trouvé");
      }
    });

    // On recalcule les montants totaux
      let totalMontant = 0,
          totalClient = 0;

      listFrais.forEach((fraisJour) => {
        totalMontant += fraisJour.totalAReglerFrais;
        totalClient +=  fraisJour.totalClientFrais;
      });

    parent.setState({
      totalMontant: totalMontant,
      totalClient: totalClient,
      listFrais: listFrais
    }, () => {
      this.props.navigation.dispatch(NavigationActions.back());
    });

  }

  /**
   * Fonction de conversions des dates pour l'affichage
   * dans le composant Caldendar
   * On renvoie un objet en mode clé: valeur,
   * où chaque clé est une chaine de caractère représentant une date
   * @return {[type]} [description]
   */
  convertDates() {
    //Converti les dates selectionnees stockees sous forme de tableau en objet
    let datesObject = {};
    this.state.selectedDatesArray.forEach(date => {
      datesObject[date] = [
        { startingDay: true, color: "#355A86" },
        { endingDay: true, color: "#355A86", textColor: "#ffff" },
      ];
    });
    return datesObject;
  }

  showValidateButton() {
    if ((this.state.statusId == null || this.state.statusId == 0)) {
      return (
        /*Bouton validera affiché que si c'est une NDF en brouillon ou une nouvelle NDF*/
        <Button onPress={() => this.handleValidate()} text="VALIDER" />
      );
    }
  }

  showDeleteButton() {
    if ((this.state.statusId == null || this.state.statusId == 0) && (!this.state.isforfait)) {
      return (
        /*Bouton supprimer affiché que si ce n'est pas un forfait, et que si c'est une NDF en brouillon ou une nouvelle NDF*/
        <Button
          buttonStyles={styles.deleteButton}
          text="SUPPRIMER"
          onPress={() =>
            Alert.alert(
              "Suppression",
              "Etes-vous sûr de vouloir supprimer la période ?",
              [
                { text: "Non", onPress: () => console.log("Cancel!") },
                { text: "Oui", onPress: () => this.handleDelete() },
              ]
            )}
        />
      );
    }
  }

  componentWillMount() {
    this.setState({
      selectedDatesArray: this.setDatesArray()
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollViewBody}>

          {/*Le containerTitre est remplacé par ce code spécifique pour pouvoir mettre un footer persistent*/}
          <View style={styles.ContainerHeader}>
            <TouchableHighlight
              style={styles.MenuIconLink}
              onPress={() => this.retour()}
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

          <View style={styles.container}>
            {/*Affiche soit le calendrier pour un forfait, soit la date selectionnée*/}
            {this.state.isforfait ? (
              <View>
                <View style={styles.containerEtat}>
                  <Text style={styles.text}>
                    Forfait : sélectionner les jours sur le calendrier
                  </Text>
                </View>

                <View style={styles.containerCalendar}>
                  <Calendar
                    current={this.state.calendarDate}
                    minDate={this.state.calendarMinDate}
                    maxDate={this.state.calendarMaxDate}
                    hideArrows={true}
                    markedDates={this.convertDates()}
                    markingType={"interactive"}
                    onDayPress={day => this.onDateSelected(day)}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.containerDate}>
                <Text style={[styles.text, { fontSize: 18 }]}>
                  {this.afficherDate()}
                </Text>
              </View>
            )}

            <View style={styles.containerDetails}>
              <Panel
                title="Informations client*"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
              >
                <View style={styles.inputView}>
                  <CheckBox
                    onClick={() => this.handleChecked()}
                    isChecked={this.state.facturable}
                    rightText="Facture client ?"
                    rightTextStyle={{ color: "black", fontSize: 16 }}
                    style={styles.checkbox}
                  />
                  <View>
                    <Text style={styles.text}>Client/Object* :</Text>
                    <TextInput
                      style={styles.inputComponent}
                      value={this.state.client}
                      onChangeText={text => this.setState({ client: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                  <View>
                    <Text style={styles.text}>Lieu de déplacement* :</Text>
                    <TextInput
                      style={styles.inputComponent}
                      value={this.state.lieu}
                      placeholderTextColor="#000000"
                      onChangeText={text =>
                        this.setState({ lieu: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </Panel>

              <Panel
                title="Forfait"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
                expanded={true}
              >
                <View style={styles.inputView}>
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.text,
                        styles.inputText,
                        styles.inputTextSmall,
                      ]}
                    >
                      Forfait journalier :
                    </Text>
                    <TextInput
                      style={[
                        styles.inputComponent,
                        styles.inputComponentRow,
                        styles.inputComponentSmall,
                      ]}
                      value={this.state.forfait}
                      onChangeText={text => this.setState({ forfait: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Panel>

              <Panel
                title="Transport"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
                expanded={false}
              >
                <View style={styles.inputView}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Nombre de km :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.nbKMS}
                      onChangeText={text => this.setState({ nbKMS: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>SNCF :</Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.sncf}
                      onChangeText={text => this.setState({ sncf: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Péages :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.peages}
                      onChangeText={text => this.setState({ peages: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Essence :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.essence}
                      onChangeText={text => this.setState({ essence: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Parking :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.parking}
                      onChangeText={text => this.setState({ parking: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>Taxi :</Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.taxi}
                      onChangeText={text => this.setState({ taxi: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View
                    style={[
                      styles.inputGroup,
                      { paddingTop: 10, paddingBottom: 10 },
                    ]}
                  >
                    <Text style={styles.text}>Indemnité kilométrique</Text>
                    <Text
                      style={[styles.text, { width: 130, textAlign: "right" }]}
                    >
                      {this.state.indemKM}
                    </Text>
                  </View>
                </View>
              </Panel>

              <Panel
                title="Abonnements"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
                expanded={false}
              >
                <View style={styles.inputView}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Nb de zones :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.nbZones}
                      onChangeText={text => this.setState({ nbZones: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>50% :</Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.pourcentage}
                      onChangeText={text => this.setState({ pourcentage: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Panel>

              <Panel
                title="Frais de réception"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
                expanded={false}
              >
                <View style={styles.inputView}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>Hôtel :</Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.hotel}
                      onChangeText={text => this.setState({ hotel: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>Repas :</Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.repas}
                      onChangeText={text => this.setState({ repas: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Invitation :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.invit}
                      onChangeText={text => this.setState({ invit: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Panel>

              <Panel
                title="Divers"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
                expanded={false}
              >
                <View style={styles.inputView}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.text, styles.inputText]}>
                      Divers :
                    </Text>
                    <TextInput
                      style={[styles.inputComponent, styles.inputComponentRow]}
                      value={this.state.divers}
                      onChangeText={text => this.setState({ divers: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.text,
                        styles.inputText,
                        styles.inputTextSmall,
                      ]}
                    >
                      Libellé frais divers :
                    </Text>
                    <TextInput
                      style={[
                        styles.inputComponent,
                        styles.inputComponentRow,
                        styles.inputComponentSmall,
                      ]}
                      value={this.state.libelle}
                      onChangeText={text =>
                        this.setState({ libelle: text })}
                      editable={true}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </Panel>
            </View>
          </View>

          </ScrollView>

          <View style={styles.stickyFooter}>
            <View style={styles.containerButton}>
              <Text style={styles.textFooter}> Total : {(
                  FraisJour.calculerTotal(this.state).toFixed(2)
                )}
              </Text>
              {this.showDeleteButton()}
              {this.showValidateButton()}
            </View>
          </View>

      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  FraisDetail: {
    screen: FraisDetail,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
