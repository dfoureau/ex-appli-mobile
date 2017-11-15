import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import style from "./styles";
import StyleGeneral from "../../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import FraisAjout from "../fraisAjout/FraisAjout";
import service from "../../../realm/service";

import moment from "moment";

import {
	showToast,
	showNotification,
	showLoading,
	hideLoading,
	hide
} from 'react-native-notifyer';

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
      year: moment().format("YYYY"),
      isReady: false,
      isData: false,
      webServiceLien: 'http://185.57.13.103/rest/web/app_dev.php/ndf/',
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

  getNDFByUser(_annee){
    showLoading("Récupération des données. Veuillez patienter...");
    var that = this;
    this.state.year = _annee;
    fetch(this.state.webServiceLien + _annee + '/1000000')
    .then(function(response) {
      if (response.status >= 400) {
        that.setState({
          data: [],
          isReady: true,
          isData: false,
        });
      }
      hideLoading();
      return response.json();
    })
    .then(function(ndf) {
      that.setState({
        data: ndf,
        isReady: true,
        isData: true,
      })
    });
  }

  reloadNDFByYear(_year){
    this.setState({year: _year});
		this.setState({isData: false, isReady: false});
    this.getNDFByUser(_year);
  }

  //Fonction permettant de conditionner l'affichage du bloc valideur
  checkItem(item){
    if (item.statusId == 2 && item.valideur != null && item.dateactionetat != null) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    if (this.state.data && this.state.data.length > 0) {
      textePasDeDonnes = <Text style={style.texteMessage}>{this.state.data.length} notes de frais trouvées</Text>;
    } else {
      textePasDeDonnes = <Text style={style.texteMessage}>Aucune note de frais trouvée</Text>;
    }

    if (!this.state.isReady) {
			return (
				<View>
					<ContainerAccueil
						title={this.state.title}
						afficherEcran={this.afficherEcranParent.bind(this)}
					>
						<ActivityIndicator
							color={"#8b008b"}
							size={"large"}
							style={StyleGeneral.loader}
						/>
						<Text style={StyleGeneral.texteLoader}>
							Récupération des données. Veuillez patienter...
						</Text>
					</ContainerAccueil>
				</View>
			);
		} else {
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
            {textePasDeDonnes}
            
            {this.state.isData && 
              <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.idUser}
                    onPress={() => this.getNDF(item.idUser, item.mois, item.annee)}
                  >
                  <View style={style.containerList}>
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
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index}
              />
              }
            </View>
          </ContainerAccueil>
        </View>
      );
    }
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
