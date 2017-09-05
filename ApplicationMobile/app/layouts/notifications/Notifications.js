import React, {Component} from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Image
} from 'react-native';
import {StackNavigator, NavigationActions} from 'react-navigation';

import Accueil from '../accueil/Accueil';
import ContainerTitre from '../../components/containerTitre/ContainerTitre';
import Style from '../../styles/Styles';

// class qui represente la liste des notifications
class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //On définit les différentes variables
      title: 'Notifications'
    }
  }

  //Permet d'afficher l'ecran choisi dans le menu
  afficherEcranParent(ecran) {
    this
      .props
      .navigation
      .navigate(ecran);
  }

  render() {
    return (
      <View>
        <ContainerTitre
          afficherEcran={this
          .afficherEcranParent
          .bind(this)}
          title={this.state.title}>
          <View style={{
            backgroundColor: 'white'
          }}>
            <FlatList
              data={[
              {
                key: 1,
                not: 'CRA à valider',
                type: 'CRA'
              }, {
                key: 2,
                not: 'NDF à saisir',
                type: 'NDF'
              }, {
                key: 3,
                not: 'Actualité demande de congé',
                type: 'DC'
              }, {
                key: 4,
                not: 'Informations',
                type: 'INF'
              }, {
                key: 5,
                not: 'CRA à valider',
                type: 'CRA'
              }, {
                key: 6,
                not: 'NDF à saisir',
                type: 'NDF'
              }, {
                key: 7,
                not: 'Informations',
                type: 'INF'
              }, {
                key: 8,
                not: 'NDF à saisir',
                type: 'NDF'
              }, {
                key: 9,
                not: 'Actualité demande de congé',
                type: 'DC'
              }, {
                key: 10,
                not: 'CRA à saisir',
                type: 'CRA'
              }, {
                key: 11,
                not: 'NDF à saisir',
                type: 'NDF'
              }, {
                key: 12,
                not: 'Informations',
                type: 'INF'
              }, {
                key: 13,
                not: 'Actualité demande de congé',
                type: 'DC'
              }, {
                key: 14,
                not: 'NDF à saisir',
                type: 'NDF'
              }, {
                key: 15,
                not: 'CRA à valider',
                type: 'CRA'
              }, {
                key: 16,
                not: 'NDF à saisir',
                type: 'NDF'
              }
            ]}
              renderItem={({item}) => <View>
              <View style={Style.firstView}>
                <View style={Style.secondView}>
                  <Text style={Style.listFirstEltText}>
                    {item.not}</Text>
                </View>
                <View style={Style.thirdView}>
                  <Text style={Style.listDate}>15/08/2017
                  </Text>
                </View>
              </View>
              <View style={Style.firstView}>
                <View style={Style.secondView}>
                  <Text style={Style.listText}>
                    {item.not}</Text>
                </View>
                <View style={Style.thirdView}>
                  <Image style={Style.listIcon} source={require('../../images/icons/check.png')}/>
                </View>
              </View>
            </View>}/>
          </View>

        </ContainerTitre>
      </View>

    );
  }
}

/**Navigation entre les pages */
const navigation = StackNavigator({

  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null
    }
  }
});

export default navigation;