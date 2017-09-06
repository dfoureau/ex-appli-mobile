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
                type: 'CRA',
                status: 1,
              }, {
                key: 2,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 2,
              }, {
                key: 3,
                not: 'Actualité demande de congé',
                type: 'DC',
                status: 1,
              }, {
                key: 4,
                not: 'Informations',
                type: 'INF',
                status: 2,
              }, {
                key: 5,
                not: 'CRA à valider',
                type: 'CRA',
                status: 2,
              }, {
                key: 6,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 2,
              }, {
                key: 7,
                not: 'Informations',
                type: 'INF',
                status: 2,
              }, {
                key: 8,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 1,
              }, {
                key: 9,
                not: 'Actualité demande de congé',
                type: 'DC',
                status: 2,
              }, {
                key: 10,
                not: 'CRA à saisir',
                type: 'CRA',
                status: 2,
              }, {
                key: 11,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 3,
              }, {
                key: 12,
                not: 'Informations',
                type: 'INF',
                status: 3,
              }, {
                key: 13,
                not: 'Actualité demande de congé',
                type: 'DC',
                status: 1,
              }, {
                key: 14,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 3,
              }, {
                key: 15,
                not: 'CRA à valider',
                type: 'CRA',
                status: 3,
              }, {
                key: 16,
                not: 'NDF à saisir',
                type: 'NDF',
                status: 2,
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
                  <Image style={Style.listIcon} source= { item.status == 1 ? require('../../images/icons/check2.png') : null}/>
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