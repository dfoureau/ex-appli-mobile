import React, { Component } from 'react'
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
ScrollView  } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from './Styles';

/**container de l'accueil */
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';

import { ActivitesListe } from '../activite/activitesListe';
import { FraisListe } from '../frais/fraisListe';
import { CongesListe } from '../conges/congesListe';
import { AnnuaireListe } from '../annuaire/annuaireListe';
import { Notifications } from '../notifications';
import { APropos } from '../aPropos';
import { Reglages } from '../reglages';

var {height, width} = Dimensions.get('window');

class Accueil extends React.Component {
	 
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

	render() {

		return (
				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
					<View style={{height: 100, }}>
					</View>
				</ContainerAccueil>
            
        
		);
	}
}

/**Il faut ajouter les pages qui sont dans le menu */
const navigation=StackNavigator({

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

});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 