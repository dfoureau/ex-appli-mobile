import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput, Image } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./Styles";
import StyleGeneral from "../../styles/Styles";

/**container de l'accueil */
import ContainerAccueil from "../../components/containerAccueil/ContainerAccueil";
import Panel from "../../components/Panel/Panel";
import NewsItem from "../../components/newsItem/NewsItem";

import { ActivitesListe } from "../CRA/activitesListe";
import { FraisListe } from "../noteDeFrais/fraisListe";
import { CongesListe } from "../demandeDeConges/congesListe";
import { AnnuaireListe } from "../annuaire/annuaireListe";
import { News } from "../news";
import { APropos } from "../Configuration/aPropos";
import { BugReport } from "../Configuration/bugReport";
import { Reglages } from "../Configuration/reglages";

import configurationAppli from "../../configuration/Configuration";
import configAccueil from "../../configuration/ConfigAccueil";

class Accueil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      title: "Cat-Amania",
      user: configAccueil.user,
      /*{
          id: null,
          nom: null,
          prenom: null,
          profil: null,
          entite: null,
          agence: null,
          responsable: null,
        },*/
      conges: configAccueil.conges,
      /*{
          id: null,
          datesolde: null,
          cp: null,
          rtt: null,
        },*/
      news: configAccueil.news,
      /*{
          news_id: null,
          news_titre: null,
          news_contenu: null,
          news_date: null,
          news_file: null,
          news_photo: null,
        },*/
      isReadyw1: false,
      isReadyw2: false,
      isReadyw3: false,
      webServiceLien1:
        configurationAppli.apiURL + "utilisateur/" + configurationAppli.userID,
      webServiceLien2:
        configurationAppli.apiURL + "conges/solde/" + configurationAppli.userID,
      webServiceLien3: configurationAppli.apiURL + "news/3",
      obj: {
        method: "GET",
        headers: {
          Authorization: "Bearer " + configurationAppli.userToken,
        },
      },
    };
  }

  componentDidMount() {
    if (
      this.state.user != null &&
      this.state.conges != null &&
      this.state.news != null
    ) {
      this.setState({
        isReadyw1: true,
        isReadyw2: true,
        isReadyw3: true,
      });
      return;
    } else {
      var that = this;
      fetch(this.state.webServiceLien1, this.state.obj)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("GetUtilisateur : Bad response from server");
          }
          return response.json();
        })
        .then(function(foncuser) {
          configAccueil.user = foncuser;
          that.setState({
            user: foncuser,
            isReadyw1: true,
          });
        })
        .catch(function(error) {
          return console.log(error);
        });

      var that = this;
      fetch(this.state.webServiceLien2, this.state.obj)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("GetConges : Bad response from server");
          }
          return response.json();
        })
        .then(function(fonconges) {
          configAccueil.conges = fonconges;
          that.setState({ conges: fonconges, isReadyw2: true });
        });

      var that = this;
      fetch(this.state.webServiceLien3, this.state.obj)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("GetNews : Bad response from server");
          }
          return response.json();
        })
        .then(function(foncnews) {
          configAccueil.news = foncnews;
          that.setState({ news: foncnews, isReadyw3: true });
        });
    }
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  renderItemNews() {
    if (this.state.news != null) {
      return this.state.news.map((item, index) => (
        <View key={index}>
          <NewsItem {...item} />
        </View>
      ));
    }
  }

  render() {
    if (
      !this.state.isReadyw1 ||
      !this.state.isReadyw2 ||
      !this.state.isReadyw2
    ) {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <ActivityIndicator
              color="#8b008b"
              size="large"
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
        <ContainerAccueil
          title={this.state.user[0]["prenom"] + " " + this.state.user[0]["nom"]}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <View style={Style.containerGeneral}>
            <View style={Style.bienvenueView}>
              <Text style={Style.text}>
                Bienvenue <Text style={Style.textGrand}>
                  {this.state.user[0]["prenom"]}{" "}
                  {this.state.user[0]["nom"]}
                </Text> !
              </Text>
            </View>

            <Text style={Style.text}>
              Votre entité juridique est <Text style={Style.textBold}>
              {this.state.user[0]["entite"]}
              </Text> avec un profil <Text style={Style.textBold}>
              {this.state.user[0]["profil"]}
              </Text>.
            </Text>

            <Text style={Style.text}>
              Votre manager est <Text style={Style.textBold}>
              {this.state.user[0]["responsable"]}
              </Text>, et vous faites partie de l'agence <Text style={Style.textBold}>
              {this.state.user[0]["agence"]}
              </Text>.
            </Text>

            <Text style={Style.text}>
              Au <Text style={Style.textBold}>{this.state.conges.datesolde}</Text>, vous avez un solde congés de <Text style={Style.textBold}>
              {this.state.conges.rtt} RTT</Text> et de <Text style={Style.textBold}>{this.state.conges.cp} CP</Text>.
            </Text>
          </View>

          <View style={Style.containerGeneral}>
            <Text style={Style.textGrand}>News de Cat-Amania</Text>
            {this.renderItemNews()}
          </View>
        </ContainerAccueil>
      );
    }
  }
}

/**Il faut ajouter les pages qui sont dans le menu */
const navigation = StackNavigator({
  Accueil: {
    screen: Accueil,
    navigationOptions: { header: null },
  },
  ActivitesListe: {
    screen: ActivitesListe,
    navigationOptions: { header: null },
  },
  FraisListe: {
    screen: FraisListe,
    navigationOptions: { header: null },
  },
  CongesListe: {
    screen: CongesListe,
    navigationOptions: { header: null },
  },
  AnnuaireListe: {
    screen: AnnuaireListe,
    navigationOptions: { header: null },
  },
  News: {
    screen: News,
    navigationOptions: { header: null },
  },
  BugReport: {
    screen: BugReport,
    navigationOptions: { header: null },
  },
  APropos: {
    screen: APropos,
    navigationOptions: { header: null },
  },
  Reglages: {
    screen: Reglages,
    navigationOptions: { header: null },
  },
});

//Il faut exporter la navigation ou bien la classe
export default navigation;
