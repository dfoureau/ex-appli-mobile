import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../styles/Styles";
import NewsItem from "../../components/newsItem/NewsItem";
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
                titre: "Titre de la news 1",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 2",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",

              },
              {
                titre: "Titre de la news 3",
                contenu: "Contenu de la news",
                date: "17/09/2017",

                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 4",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                

              },
              {
                titre: "Titre de la news 5",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 6",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 7",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 8",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 9",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 10",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 11",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 12",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 13",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 14",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 15",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
              {
                titre: "Titre de la news 16",
                contenu: "Contenu de la news",
                date: "17/09/2017",
                photo: "http://test.net/photo.jpg",
                file: "http://test.net/news.pdf",
              },
            ]}

            keyExtractor = { item => item.titre}

            renderItem={({ item }) => (
                <NewsItem {...item} />
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
