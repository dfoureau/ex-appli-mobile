import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";
import configurationAppli from "../../configuration/Configuration";
import HTMLView from 'react-native-htmlview';

export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extend: false,
    };
  }

  render() {
    let lienEspaceCollaborateur = configurationAppli.lienEspaceCollaborateur;

    //récupération de l'image ouaffichage par defaut
    let imgSrc;
    if (this.props.news_photo == null) {
      imgSrc = require("../../images/imageNewsDefault.png");
    } else {
      imgSrc = { uri: lienEspaceCollaborateur + this.props.news_photo };
    }

    //Affichage d'un lien si existant
    let linkElement = null;
    if (this.props.news_file != null) {
      linkElement = (
        <View style={Style.newsItemRBR}>
          <TouchableHighlight
            onPress={() =>
              Linking.openURL(lienEspaceCollaborateur + this.props.news_file)}
          >
            <Image
              style={Style.newsItemRImg}
              source={require("../../images/imageNewsLink.png")}
            />
          </TouchableHighlight>
        </View>
      );
    }

    // Corrige liens relatifs dans certaines news de l'espace collaborateur
    let contenuNews = "<div>" + this.props.news_contenu.replace("../../", lienEspaceCollaborateur + "/espacecollaborateur/").trim() + "</div>";

    const stylesContent = StyleSheet.create({
      div: {
        color: "black",
      }
    });

    return (
      <View style={Style.newsItem}>
        <View style={Style.newsItemL}>
          <Image style={Style.newsItemLImg} source={imgSrc} />
        </View>

        <View style={Style.newsItemR}>
          <View style={Style.newsItemRT}>
            <Text style={Style.title}>{this.props.news_titre}</Text>
            <Text style={Style.date}>{this.props.news_date}</Text>
          </View>

          <View style={Style.newsItemRB}>
            <View style={Style.newsItemRBL}>
              <HTMLView
                value={contenuNews}
                stylesheet={stylesContent}
              />
              {/*<Text style={Style.content}>{this.props.news_contenu}</Text>*/}
            </View>

            {linkElement}
          </View>
        </View>
      </View>
    );
  }
}
