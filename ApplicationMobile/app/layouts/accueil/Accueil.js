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

<<<<<<< HEAD
import Vierge from '../vierge/Vierge';
import Notifications from '../notifications/Notifications';

import Reglages from '../reglages/Reglages';

import ListCRA from '../CRA/liste';
=======
import { ActivitesListe } from '../CRA/activitesListe';
import { FraisListe } from '../noteDeFrais/fraisListe';
import { CongesListe } from '../demandeDeConges/congesListe';
import { AnnuaireListe } from '../annuaire/annuaireListe';
import { Notifications } from '../notifications';
import { APropos } from '../Configuration/aPropos';
import { Reglages } from '../Configuration/reglages';
>>>>>>> feature/annuaireList

var {height, width} = Dimensions.get('window');

class Accueil extends React.Component {
<<<<<<< HEAD
=======
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			title:'Cat-Amania',
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
>>>>>>> feature/annuaireList

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

<<<<<<< HEAD
																</View>
												</ContainerAccueil>

								);
				}
=======
		return (
				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
					<View style={{height: 100, }}>
					</View>
				</ContainerAccueil>
            
        
		);
	}
>>>>>>> feature/annuaireList
}

/**Il faut ajouter les pages qui sont dans le menu */
const navigation = StackNavigator({

<<<<<<< HEAD
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
=======
	Accueil:{
		screen:Accueil,
		navigationOptions: { header: null }
	},
	ActivitesListe:{
		screen:ActivitesListe, 
		navigationOptions: { header: null }
	}, 
	FraisListe:{
		screen:FraisListe, 
		navigationOptions: { header: null }
	},   
	CongesListe:{
		screen:CongesListe, 
		navigationOptions: { header: null }
	}, 
	AnnuaireListe:{
		screen:AnnuaireListe, 
		navigationOptions: { header: null }
	},
	Notifications:{
		screen:Notifications, 
		navigationOptions: { header: null }
	}, 
	APropos:{
		screen:APropos, 
		navigationOptions: { header: null }
	}, 
	Reglages:{
		screen:Reglages, 
		navigationOptions: { header: null }
	}

>>>>>>> feature/annuaireList
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation;