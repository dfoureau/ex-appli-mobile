import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import style from "./styles";

import {
	showToast,
	showNotification,
	showLoading,
	hideLoading,
	hide
} from 'react-native-notifyer';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import FraisAjout from "../fraisAjout/FraisAjout";
import service from "../../../realm/service";

const FRAIS_SCHEMA = "Frais";

class FraisListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      title: "Note de frais",
      data: [],
      months: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      year: "",
    };
    service.delete(FRAIS_SCHEMA);
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  addNDF() {
    this.props.navigation.navigate("FraisAjout", {
      idUser: null,
      month: null,
      year: null,
    });
  }

  getNDF(id, month, year) {
    this.props.navigation.navigate("FraisAjout", {
      idUser: id,
      month: month,
      year: year,
    });
  }

  componentDidMount() {
    var today = new Date();
    var year = today.getFullYear();
    this.getNDFByUser(year);
  }

  getNDFByUser(year){
    var that = this;
    fetch('http://185.57.13.103/rest/web/app_dev.php/ndf/'+year+'/1000000')
    .then(function(response) {
      if (response.status >= 400) {
        that.setState({data: []})
        showToast("Aucune note de frais trouvée pour l'année " + year);
      }
      return response.json();
    })
    .then(function(ndf) {
      that.setState({data: ndf})
    });
  }

  reloadNDFByYear(_year){
    var that = this;
    that.setState({year: _year});

    this.getNDFByUser(_year);
  }

  //Fonction permettant de conditionner l'affichage du bloc valideur
  checkItem(item){
    if(item.statusId == 2 && item.valideur != null && item.dateactionetat != null){
      return true;
    }
    else{
      return false;
    }
  }

  render() {
    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={style.container}>
            {/* Container filtre et ajout de NDF*/}
            <View style={style.container1}>
              <View style={style.containerPicker}>
                <Picker
                  style={{ width: 110 }}
                  selectedValue={this.state.year}
                  onValueChange={(itemValue, itemIndex) =>
                    this.reloadNDFByYear(itemValue)}
                >
                  <Picker.Item label="2017" value="2017" />
                  <Picker.Item label="2016" value="2016" />
                  <Picker.Item label="2015" value="2015" />
                  <Picker.Item label="2014" value="2014" />
                  <Picker.Item label="2013" value="2013" />
                  <Picker.Item label="2012" value="2012" />
                  <Picker.Item label="2011" value="2011" />
                  <Picker.Item label="2010" value="2010" />
                  <Picker.Item label="2009" value="2009" />
                  <Picker.Item label="2008" value="2008" />
                </Picker>
              </View>
              <View style={style.containerButton}>
                <Button text="AJOUTER" onPress={() => this.addNDF()} />
              </View>
            </View>
          </View>
          {/* Container liste des NDF */}
          <View style={style.container2}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <View style={style.containerList}>
                  <TouchableOpacity
                    key={item.idUser}
                    onPress={() => this.getNDF(item.idUser, item.mois, item.annee)}
                  >
                    <View style={style.containerPeriod}>
                      <Text style={style.periodText}>
                        {this.state.months[item.mois-1]} {item.annee}
                      </Text>
                      <View style={style.containerIcon}>
                        <Image
                          style={style.listIcon}
                          source={
                            item.statusId == 2
                              ? require("../../../images/icons/check2.png")
                              : null
                          }
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={style.amountText}>
                        Montant : {item.montantTotal} €
                      </Text>
                      <Text style={style.statusText}>
                        Etat : {item.etat}
                        {this.checkItem(item) == true ? (
                          <Text>
                            {" "}
                            par {item.valideur} le {item.dateactionetat}
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              keyExtractor={(item, index) => index}
            />
          </View>
        </ContainerAccueil>
      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  FraisListe: {
    screen: FraisListe,
    navigationOptions: { header: null },
  },
  FraisAjout: {
    screen: FraisAjout,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
