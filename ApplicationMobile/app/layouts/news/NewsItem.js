import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../styles/Styles";


export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let rightElem = <Text>right</Text>;
    let element = <View style = { Style.newsItem
                                }>
                        <View style = {Style.newsItemL}>

                          <Image style = {Style.newsItemLImg,

                                        {height : this.props.style.height -10,
                                        width : this.props.style.height -10}}


                              source={require("../../images/imageNewsDefault.jpg")
                                      } />
                        </View>

                        <View style = {Style.newsItemR}>
                          <View style = {Style.newsItemRL}>
                            <Text>{this.props.titre}</Text>
                            <Text>{this.props.contenu}</Text>
                          </View>

                          <View style = {Style.newsItemRR}>
                            {rightElem}
                          </View>
                        </View>

                      </View>;

    return(
      <View>
        {element}
      </View>
    );
  }
}
