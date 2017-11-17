import React from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import StyleGeneral from "../../styles/Styles";
import NewsItem from "../../components/newsItem/NewsItem";
// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../components/containerAccueil/ContainerAccueil";

import configurationAppli from "../../configuration/Configuration";

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "News" ,
      newsList:  [
        {
          news_id: null,
          news_titre: null,
          news_contenu: null,
          news_date: null,
          news_file: null,
		      news_photo : null
        }
      ],
      isReady: false,
      webServiceLien: configurationAppli.apiURL + "news/10",
	  obj : {
        method: 'GET',
        headers: {
          'Authorization': "Bearer " + configurationAppli.userToken
	  }}
	  };
  }
  
  componentDidMount() {
	var that = this;
    fetch(this.state.webServiceLien, this.state.obj )
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(foncnews) {
      that.setState({newsList: foncnews, isReady: true})
    });
	
  }
  
  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  render() {
    if (!this.state.isReady) {
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
    )

    } else {
      return (
        <View>
          <ContainerAccueil
            title={this.state.title}
            afficherEcran={this.afficherEcranParent.bind(this)}
          >
            <FlatList
              data={this.state.newsList}

              keyExtractor = { item => item.news_id}

              renderItem={({ item }) => (
                  <NewsItem {...item} />
              )}

            />
          </ContainerAccueil>
        </View>
      );
    }
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
