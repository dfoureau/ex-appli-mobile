import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from './Styles';

/**container de l'accueil */
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';
import Panel from '../../components/Panel/Panel';

import { ActivitesListe } from '../CRA/activitesListe';
import { FraisListe } from '../noteDeFrais/fraisListe';
import { CongesListe } from '../demandeDeConges/congesListe';
import { AnnuaireListe } from '../annuaire/annuaireListe';
import { Notifications } from '../notifications';
import { APropos } from '../Configuration/aPropos';
import { Reglages } from '../Configuration/reglages';

class Accueil extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			title:'Cat-Amania',
			userInfo: {
				idUser:803,
				firstName: 'Prénom',
				lastName: 'NOM',
				branch : 'Production',
				agency: 'Lille',
				manager: 'John DOE',
				vacationInfo: {
					period: '07/2017',
					CPCounter: '55.0',
					RTTCounter: '10.0'
				}
			 },
			 news: [
				 {
					 id: 1,
					 title: 'Zeeletter de Juin 2017',
					 content: 'QUESTIONNAIRE SOCIAL CAT-AMANIA \nIl y a un an, nous avons été un certain nombre à répondre à un questionnaire, à l\'initiative du CE, sur notre bien-être chez CAT-AMANIA.'
				 },
				 {
					 id: 2,
					 title: 'Zeeletter de Mai 2017',
					 content: 'La Smart Connexion'
				 }
			 ]
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	renderItemNews() {
		return (this.state.news.map(item => (
			<View key={item.id}>
				<Text style={Style.titleNews}>{item.title}</Text>
				<Text style={[Style.text, Style.text3]}>{item.content}</Text>
			</View>   
        )));
	}

	render() {

		return (
				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
					<Panel title="INFORMATIONS PERSONNELLES">
						<Text style={Style.text}>Bienvenue {this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
						<Text style={Style.text}>Entité juridique : CAT-AMANIA</Text>
						<Text style={Style.text}>Profil : {this.state.userInfo.branch}</Text> 
						<Text style={Style.text}>Agence : {this.state.userInfo.agency}</Text>
						<Text style={Style.text}>Manager : {this.state.userInfo.manager}</Text>		
        			</Panel>
        			<Panel title="SOLDES CONGES">
						<Text style={Style.text}>Sur votre bulletin de salaire du {this.state.userInfo.vacationInfo.period}, votre solde de congés se compose de la manière suivante :</Text>
						<Text style={[Style.text, Style.text2]}>- solde CP : {this.state.userInfo.vacationInfo.CPCounter}</Text>
						<Text style={[Style.text, Style.text2]}>- solde RTT : {this.state.userInfo.vacationInfo.RTTCounter}</Text>
        			</Panel>
        			<Panel title="NEWS">
						{this.renderItemNews()}
        			</Panel>
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