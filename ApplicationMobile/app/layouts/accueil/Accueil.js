import React, {Component} from 'react'
import {
				AppRegistry,
				StyleSheet,
				Dimensions,
				View,
				TextInput,
				Button,
				Image,
				TouchableHighlight,
				Text,
				Alert,
				ScrollView
} from 'react-native'
import {StackNavigator, NavigationActions} from 'react-navigation';
import Style from './Styles';

/**container de l'accueil */
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';

import Vierge from '../vierge/Vierge';
import Notifications from '../notifications/Notifications';

import Reglages from '../reglages/Reglages';

import ListCRA from '../CRA/liste';

var {height, width} = Dimensions.get('window');

class Accueil extends React.Component {

				constructor(props) {
								super(props)
								this.state = {
												//On définit les différentes variables
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
												<ContainerAccueil
																afficherEcran={this
																.afficherEcranParent
																.bind(this)}>
																<View style={{
																				height: 100
																}}>
																				<Text >Accueil</Text>

																</View>
												</ContainerAccueil>

								);
				}
}

/**Il faut ajouter les pages qui sont dans le menu */
const navigation = StackNavigator({

				Accueil: {
								screen: Accueil,
								navigationOptions: {
												header: null
								}
				},
				Vierge: {
								screen: Vierge,
								navigationOptions: {
												header: null
								}
				},
				Reglages: {
								screen: Reglages,
								navigationOptions: {
												header: null
								}
				},
				Notifications: {
								screen: Notifications,
								navigationOptions: {
												header: null
								}
				},
				ListCRA: {
								screen: ListCRA,
								navigationOptions: {
												header: null
								}
				}
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation;