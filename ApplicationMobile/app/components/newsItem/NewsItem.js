import React from "react";
import { View, Text, Image, FlatList, Linking} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";


export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {extend : false};
  }

  render(){
    //récupération de l'image ouaffichage par defaut
    let imgSrc;
    if(this.props.photo == null){
      imgSrc = require("../../images/imageNewsDefault.png");
    }
    else {
      imgSrc ={uri: this.props.photo};
    }
    //Affichage d'un lien si existant

    let linkElement = null;//will be a link if exist
    if (this.props.file != null) {
      linkElement = <View style = {Style.newsItemRR}>
      <Image style = {Style.newsItemRImg}
          source={require("../../images/imageNewsLink.png")}
          onPress = {()=> Linking.openURL(this.props.file) } />
      </View>;
    }
    return(
      <View style = { Style.newsItem
                                  }>
                          <View style = {Style.newsItemL}>

                            <Image style = {Style.newsItemLImg}
                                source={imgSrc} />
                          </View>

                          <View style = {Style.newsItemR}>
                            <View style = {Style.newsItemRL}>
                              <Text style = {Style.title}>{this.props.titre}</Text>
                              <Text style = {Style.content}>{this.props.contenu}</Text>
                              <Text style = {Style.date}>{this.props.date}</Text>
                            </View>

                            {linkElement}
                          </View>

                        </View>
    );
  }
}
