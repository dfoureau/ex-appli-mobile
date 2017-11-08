import React from "react";
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
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import styles from "./styles";
import moment from "moment";
import "moment/locale/fr";

// IMPORT DES COMPOSANTS EXOTIQUE
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import FraisDetail from "../fraisDetail/FraisDetail";
import FraisConfirmation from "../fraisConfirmation/FraisConfirmation";
import service from "../../../realm/service";

const FRAIS_SCHEMA = "Frais";

class FraisAjout extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }

  //Récupération des paramètres de navigation
  static navigationOptions = ({ navigation }) => ({
    idUser: navigation.state.params.idUser,
    month: navigation.state.params.month,
    year: navigation.state.params.year,
  });

  setInitialValues() {
    this.state = {
      title: "Note de frais",
      statusId: 1,
      status: "nouveau",
      statusLabel: "Nouvelle NDF",
      header: ["Jour", "Client", "Montant €"],
      months: [
        "Janvier 2017",
        "Février 2017",
        "Mars 2017",
        "Avril 2017",
        "Mai 2017",
        "Juin 2017",
        "Juillet 2017",
        "Août 2017",
        "Septembre 2017",
        "Octobre 2017",
        "Novembre 2017",
        "Décembre 2017",
      ],
      monthSelected: "Octobre 2017",
      listFrais: [],
      totalMontant: 0,
      totalClient: 0,
      nbJours: 0,
    };
  }

  getNDF(year, month){
    var that = this;
    fetch('http://localhost:8000/ndf/1000000/'+year+'/'+month)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(ndf) {
        //Construction du tableau de la note de frais
        var frais = ndf["notesDeFrais"];
        let tableauFrais = [];
        
        frais.forEach(function(item){
          tableauFrais.push({
            dateShort: item["jour"],
            client: item["client"],
            montant: 0,
            id: item["jour"],
          })
        });

        that.setState({listFrais: tableauFrais});
    });
  }

  componentDidMount(){
    var that = this;
    //Récupération des paramètres de navigation
    const { params } = this.props.navigation.state;

    //Test pour savoir si on ajoute ou si on consulte une NDF
    if(params.month != null){
      this.getNDF(params.year, params.month);
    }
    else{
      var initListAndTotals = this.initListAndTotals();
      that.setState({
        listFrais: initListAndTotals.listFrais,
        totalMontant: initListAndTotals.totalAReglerAllFrais,
        totalClient: initListAndTotals.totalClientAllFrais});
    }
  }

  // Méthode permettant de calculer le total à régler d'un frais
  calculTotaux(frais) {
    // on calcul le total avec un arrondi de 2 décimals
    var total = (frais.indemKM * frais.nbKMS +
      frais.forfait +
      frais.sncf +
      frais.pourcentage +
      frais.hotel +
      frais.repas +
      frais.invit +
      frais.peages +
      frais.essence +
      frais.taxi +
      frais.parking +
      frais.divers
    ).toFixed(2);

    return {
      totalAReglerFrais: parseFloat(total),
      totalClientFrais: frais.facturable == 1 ? parseFloat(total) : 0,
    };
  }

  // Méthode permettant l'initialisation de la liste des frais et des totaux (montant à régler et client)
  initListAndTotals() {

    // intialisation des totaux globaux
    var totalAReglerAllFrais = 0;
    var totalClientAllFrais = 0;

    //Nouvelle NDF -> Tableau vide initié
    let currentDate = new Date();
    let initList = [],
      jours = moment({ y: "2017", M: currentDate.getMonth(), d: 1 }), //Date de depart : le 1er du mois
      month = jours.month(), //numero du mois choisi
      monthOk = true; //verif que le mois est toujours le bon
    while (monthOk) {
      if (jours.month() == month) {
        // on récupère le frais pour la date
        var frais = service.getByPrimaryKey(
          FRAIS_SCHEMA,
          jours.format("DD-MM-YYYY")
        );
        var totauxFrais = null;

        // le frais existe en cache
        if (frais != null) {
          // on calcul les totaux
          totauxFrais = this.calculTotaux(frais);
          // on incrémentes les totaux globaux
          totalAReglerAllFrais += totauxFrais.totalAReglerFrais;
          totalClientAllFrais += totauxFrais.totalClientFrais;
        }

        initList.push({
          // l'id du frais correspond à sa date au format DD-MM-YYYY
          id: jours.format("DD-MM-YYYY"),
          date: jours.format("DD-MM-YYYY"),
          dateShort: jours.format("dd DD"),
          client: frais != null ? frais.client : "",
          // affichage des totaux spécifiques à un frais
          montant: totauxFrais != null ? totauxFrais.totalAReglerFrais : "",
        });

        jours.add(1, "days"); //passe au jour suivant
      } else monthOk = false; //Si on passe au moins suivant on arrete
    }
    return {
      listFrais: initList,
      totalAReglerAllFrais: totalAReglerAllFrais,
      totalClientAllFrais: totalClientAllFrais,
    };
  }

  //Affiche les lignes du tableau à partir de listFrais
  afficherRow() {
    moment.locale("fr");
    return this.state.listFrais.map((row, i) => (
      <TouchableOpacity key={i} onPress={() => this.modifyNDF(row.id)}>
        <Row
          style={[styles.row, i % 2 && { backgroundColor: "#FFFFFF" }]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={styles.rowText}
          data={[row.dateShort, row.client, row.montant ? row.montant : 0]}
        />
      </TouchableOpacity>
    ));
    return lignes;
  }

  //Affiche le contenu du menu des mois/années
  loadPickerItems() {
    return this.state.months.map((item, i) => (
      <Picker.Item label={item} value={item} key={i} />
    ));
  }

  modifyNDF(idFrais) {
    //Indique le numéro de la ligne a modifier
    this.props.navigation.navigate("FraisDetail", {
      forfait: false,
      idFrais: idFrais,
    });
  }
  addNDF(monthSelected) {
    this.props.navigation.navigate("FraisDetail", {
      forfait: true,
      month: monthSelected,
    });
  }
  deleteNDF() {
    this.props.navigation.navigate("FraisConfirmation");
  }
  saveDraft() {
    this.setState({
      statusId: 2,
      status: "brouillon",
      statusLabel: "NDF en brouillon",
    });
    this.props.navigation.navigate("FraisConfirmation");
  }
  validateNDF() {
    this.setState({
      statusId: 3,
      status: "validé",
      statusLabel: "Modifications interdites",
    });
    this.props.navigation.navigate("FraisConfirmation");
  }

  showDeleteButton() {
    if (this.state.statusId == 2)
      return (
        <Button
          buttonStyles={styles.deleteButton}
          text="SUPPRIMER"
          onPress={() =>
            Alert.alert(
              "Suppression",
              "Etes-vous sûr de vouloir supprimer la note de frais ?",
              [
                { text: "Non", onPress: () => console.log("Cancel!") },
                { text: "Oui", onPress: () => this.deleteNDF() },
              ]
            )}
        />
      );
  }

  showDraftButton() {
    if (this.state.statusId == 1 || this.state.statusId == 2)
      return (
        <Button
          buttonStyles={styles.draftButton}
          text="BROUILLON"
          onPress={() => this.saveDraft()}
        />
      );
  }

  showValidateButton() {
    if (this.state.statusId == 1 || this.state.statusId == 2)
      return <Button text="VALIDER" onPress={() => this.validateNDF()} />;
  }

  render() {
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.mainContainer}>
        <ContainerTitre
          title={this.state.title}
          navigation={this.props.navigation}
        >
          <View style={styles.container}>
            <View style={styles.container1}>
              <View style={styles.containerStatus}>
                <Text style={styles.text}>Etat : {this.state.status}</Text>
              </View>
              <View style={styles.containerStatusLabel}>
                <Text style={styles.statusLabel}>{this.state.statusLabel}</Text>
              </View>
            </View>
            <View style={styles.container2}>
              <View style={styles.containerPicker}>
                <Picker
                  style={{ width: 160 }}
                  selectedValue={this.state.monthSelected}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ monthSelected: itemIndex })}
                >
                  {this.loadPickerItems()}
                </Picker>
              </View>
              <View style={styles.containerColumn}>
                <View style={styles.containerInfoElement}>
                  <Text style={styles.text}>
                    Total à régler : {this.state.totalMontant} €
                  </Text>
                  <Text style={styles.text}>
                    Total client : {this.state.totalClient} €
                  </Text>
                  {/*<Text style={styles.text}>Nombre de jours : {this.state.nbJours}</Text>*/}
                </View>
                <View style={styles.containerButton}>
                  <Button
                    text="AJOUTER FORFAIT"
                    onPress={() => this.addNDF(this.state.monthSelected)}
                    buttonStyles={Style.addButton}
                  />
                </View>
              </View>
              <View style={styles.container2}>
                <Text style={styles.textAide}>
                  Saisir une ligne pour ajouter/modifier une NDF
                </Text>
              </View>
            </View>
            <View style={styles.container3}>
              <View style={styles.containerTable}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}>
                  <Row
                    data={this.state.header}
                    style={styles.header}
                    textStyle={styles.headerText}
                  />
                  {this.afficherRow()}
                </Table>
              </View>
            </View>
            <View style={styles.containerButtons}>
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
  FraisAjout: {
    screen: FraisAjout,
    navigationOptions: { header: null },
  },
  FraisDetail: {
    screen: FraisDetail,
    navigationOptions: { header: null },
  },
  FraisConfirmation: {
    screen: FraisConfirmation,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
