import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";


export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let rightElem = <Text>right</Text>;//will be a link if exist
    let imgSrc = require("../../images/imageNewsDefault.jpg");
    let displayLink ;
    if (this.props.file == null) {
      displayLink = {display : "none"};
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
                              <Text>{this.props.titre}</Text>
                              <Text>{this.props.contenu}</Text>
                              <Text style = {Style.newsItemR}>{this.props.date}</Text>
                            </View>

                            <View style = {displayLink,Style.newsItemRR}>
                              {rightElem}
                            </View>
                          </View>

                        </View>
    );
  }
}
