import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StackNavigator, NavigationActions, Navigator } from "react-navigation";
import style from "./styles";
import Style from "../../../styles/Styles";

import CRAItem from "../../../components/CRAItem/CRAItem";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import Accueil from "../../accueil/Accueil";
import { Button } from "../../../components/Buttons";
import ActivitesDetail from "../activitesDetail/ActivitesDetail";
import AjoutCra from "../ajoutCRA/AjoutCra";
import ActivitesConfirmation from "../activitesConfirmation/ActivitesConfirmation";

class ActivitesListe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "Relevés d'Activités" };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  // afficher plusieures CRA

  afficherCRAs(item) {
    var rows = [];
    var manyElt = true;
    var hideDate = false;
    for (var i = 0; i < item.content.length; i++) {
      rows.push(
        <CRAItem
          status={item.content[i].status}
          client={item.content[i].client}
          date={item.date}
          manyElt={manyElt}
          hideDate={hideDate}
          key={item.content[i].Id}
        />
      );
      manyElt = false;
      hideDate = true;
    }
    return rows;
  }

  //Transfert du paramétre vers la page AjoutCRa
  //Params : date
  SendDataCRA(id, ItemDate) {
    this.props.navigation.navigate("AjoutCra", {
      idCRA: id,
      date: ItemDate,
      isServiceCalled: true,
    });
  }

  AfficherAjoutCRa() {
    this.props.navigation.navigate("AjoutCra", {
      date: "Octobre 2017",
      isServiceCalled: true,
    });
  }

  render() {
    /*status => 1: validé, 2: brouillon, 3: en cours de validation */
    const data = [
      {
        key: 1,
        Id: 1,
        moreThanOne: false,
        hideDate: false,
        manyElt: false,
        date: "Août 2017",
        client: "La banque de Nantes",
        status: 2,
      },
      {
        key: 2,
        Id: 2,
        moreThanOne: true,
        hideDate: false,
        manyElt: true,
        date: "Juillet 2017",
        client: "La banque de Paris",
        status: 1,
      },
      {
        key: 3,
        Id: 3,
        moreThanOne: true,
        date: "Juillet 2017",
        hideDate: true,
        client: "La banque de Paris",
        status: 1,
        manyElt: true,
      },
      {
        key: 4,
        Id: 4,
        moreThanOne: false,
        manyElt: false,
        hideDate: false,
        date: "Juin 2017",
        client: "Cat-Amania",
        status: 1,
      },
    ];

    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={style.container}>
            <View style={style.container2}>
              <View style={style.containerPicker}>
                <Picker
                  style={{
                    width: 120,
                  }}
                  selectedValue={this.state.month}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ month: itemValue })}
                >
                  <Picker.Item label="Année" value="0" />
                  <Picker.Item label="2017" value="1" />
                  <Picker.Item label="2016" value="2" />
                  <Picker.Item label="2015" value="3" />
                  <Picker.Item label="2014" value="4" />
                  <Picker.Item label="2013" value="5" />
                  <Picker.Item label="2012" value="6" />
                  <Picker.Item label="2011" value="7" />
                </Picker>
              </View>
              <View style={style.containerButton}>
                <Button
                  text="AJOUTER"
                  onPress={() => this.AfficherAjoutCRa()}
                />
              </View>
            </View>

            <FlatList
              data={data}
              renderItem={({ item }) =>
                !item.moreThanOne ? (
                  <View>
                    <TouchableOpacity
                      key={item.Id}
                      onPress={() => this.SendDataCRA(item.Id, item.date)}
                    >
                      <CRAItem
                        date={item.date}
                        client={item.client}
                        status={item.status}
                        key={item.Id}
                        manyElt={item.manyElt}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      key={item.Id}
                      onPress={() => this.SendDataCRA(item.Id, item.date)}
                    >
                      <CRAItem
                        date={item.date}
                        client={item.client}
                        status={item.status}
                        key={item.Id}
                        hideDate={item.hideDate}
                        manyElt={item.manyElt}
                      />
                    </TouchableOpacity>
                  </View>
                )}
            />
          </View>
        </ContainerAccueil>
      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  ActivitesListe: {
    screen: ActivitesListe,
    navigationOptions: { header: null },
  },

  AjoutCra: {
    screen: AjoutCra,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
