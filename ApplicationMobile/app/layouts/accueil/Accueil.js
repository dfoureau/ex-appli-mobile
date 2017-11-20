import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
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
import { Reglages } from "../Configuration/reglages";

import configurationAppli from "../../configuration/Configuration";

class Accueil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //On définit les différentes variables
      title: "Cat-Amania",
      user: [
        {
          id: null,
          nom: null,
          prenom: null,
          profil: null,
          entite: null,
          agence: null,
          responsable: null,
        },
      ],
      conges: [
        {
          id: null,
          datesolde: null,
          cp: null,
          rtt: null,
        },
      ],
      news: [
        {
          news_id: null,
          news_titre: null,
          news_contenu: null,
          news_date: null,
          news_file: null,
          news_photo: null,
        },
      ],
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
    var that = this;
    fetch(this.state.webServiceLien1, this.state.obj)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("GetUtilisateur : Bad response from server");
        }
        return response.json();
      })
      .then(function(foncuser) {
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
        that.setState({ news: foncnews, isReadyw3: true });
      });
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  renderItemNews() {
    return this.state.news.map((item, index) => (
      <View key={index}>
        <NewsItem {...item} />
      </View>
    ));
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
          title={this.state.title}
          afficherEcran={this.afficherEcranParent.bind(this)}
        >
          <Panel title="INFORMATIONS PERSONNELLES">
            <Text style={Style.text}>
              Bienvenue {this.state.user[0]["prenom"]}{" "}
              {this.state.user[0]["nom"]}
            </Text>
            <Text style={Style.text}>
              Entité juridique : {this.state.user[0]["entite"]}
            </Text>
            <Text style={Style.text}>
              Profil : {this.state.user[0]["profil"]}
            </Text>
            <Text style={Style.text}>
              Agence : {this.state.user[0]["agence"]}
            </Text>
            <Text style={Style.text}>
              Manager : {this.state.user[0]["responsable"]}
            </Text>
          </Panel>
          <Panel title="SOLDES CONGES">
            <Text style={Style.text}>
              Sur votre bulletin de salaire du{" "}
              {this.state.conges[0]["datesolde"]}, votre solde de congés se
              compose de la manière suivante :
            </Text>
            <Text style={[Style.text, Style.text2]}>
              - solde CP : {this.state.conges[0]["cp"]}
            </Text>
            <Text style={[Style.text, Style.text2]}>
              - solde RTT : {this.state.conges[0]["rtt"]}
            </Text>
          </Panel>
          <Panel title="NEWS">{this.renderItemNews()}</Panel>
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
  APropos: {
    screen: APropos,
    navigationOptions: { header: null },
  },
  Reglages: {
    screen: Reglages,
    navigationOptions: { header: null },
  },
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation;
