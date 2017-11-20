import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  TouchableHighlight,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";

export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extend: false,
    };
  }

  render() {
    let URLEspaceCollaborateur = "https://espacecollaborateur.cat-amania.com";

    //récupération de l'image ouaffichage par defaut
    let imgSrc;
    if (this.props.news_photo == null) {
      imgSrc = require("../../images/imageNewsDefault.png");
    } else {
      imgSrc = { uri: URLEspaceCollaborateur + this.props.news_photo };
    }

    //Affichage d'un lien si existant
    let linkElement = null;
    if (this.props.news_file != null) {
      linkElement = (
        <View style={Style.newsItemRBR}>
          <TouchableHighlight
            onPress={() =>
              Linking.openURL(URLEspaceCollaborateur + this.props.news_file)}
          >
            <Image
              style={Style.newsItemRImg}
              source={require("../../images/imageNewsLink.png")}
            />
          </TouchableHighlight>
        </View>
      );
    }
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
              <Text style={Style.content}>{this.props.news_contenu}</Text>
            </View>

            {linkElement}
          </View>
        </View>
      </View>
    );
  }
}
