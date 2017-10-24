import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../styles/Styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../components/containerAccueil/ContainerAccueil";

import Accueil from "../accueil/Accueil";

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "News" };
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    return (
      <View>
        <ContainerAccueil
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <FlatList
            data={[
              {
                key: 1,
                not: "CRA à valider",
                type: "CRA",
                status: 1,
              },
              {
                key: 2,
                not: "NDF à saisir",
                type: "NDF",
                status: 2,
              },
              {
                key: 3,
                not: "Actualité demande de congé",
                type: "DC",
                status: 1,
              },
              {
                key: 4,
                not: "Informations",
                type: "INF",
                status: 2,
              },
              {
                key: 5,
                not: "CRA à valider",
                type: "CRA",
                status: 2,
              },
              {
                key: 6,
                not: "NDF à saisir",
                type: "NDF",
                status: 2,
              },
              {
                key: 7,
                not: "Informations",
                type: "INF",
                status: 2,
              },
              {
                key: 8,
                not: "NDF à saisir",
                type: "NDF",
                status: 1,
              },
              {
                key: 9,
                not: "Actualité demande de congé",
                type: "DC",
                status: 2,
              },
              {
                key: 10,
                not: "CRA à saisir",
                type: "CRA",
                status: 2,
              },
              {
                key: 11,
                not: "NDF à saisir",
                type: "NDF",
                status: 3,
              },
              {
                key: 12,
                not: "Informations",
                type: "INF",
                status: 3,
              },
              {
                key: 13,
                not: "Actualité demande de congé",
                type: "DC",
                status: 1,
              },
              {
                key: 14,
                not: "NDF à saisir",
                type: "NDF",
                status: 3,
              },
              {
                key: 15,
                not: "CRA à valider",
                type: "CRA",
                status: 3,
              },
              {
                key: 16,
                not: "NDF à saisir",
                type: "NDF",
                status: 2,
              },
            ]}
            renderItem={({ item }) => (
              <View>
                <View style={Style.firstView}>
                  <View style={Style.secondView}>
                    <Text style={Style.listFirstEltText}>{item.not}</Text>
                  </View>
                  <View style={Style.thirdView}>
                    <Text style={Style.listDate}>15/08/2017</Text>
                  </View>
                </View>
                <View style={Style.firstView}>
                  <View style={Style.secondView}>
                    <Text style={Style.listText}>{item.not}</Text>
                  </View>
                  <View style={Style.thirdView}>
                    <Image
                      style={Style.listIcon}
                      source={
                        item.status == 1
                          ? require("../../images/icons/check2.png")
                          : null
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </ContainerAccueil>
      </View>
    );
  }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
  News: {
    screen: News,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
