import React from 'react';
import { View, Picker, Image, FlatList, Text, TouchableHighlight, TouchableOpacity  } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from '../../../styles/Styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil';
import Calendar from '../../../components/calendar/Calendar';

import styles from './styles';

class ActivitesDetail extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { 
			title:'Détails période',
			date1: this.props.navigation.state.params.date1,
			date2: this.props.navigation.state.params.date2,
			activite: this.props.navigation.state.params.activite,
			activitesListe: [ {"code" :"1.0", "label": "Client"}, 
							{"code":"IC", "label":"Intercontrat"}, 
							{"code":"FO", "label":"Formation"}, 
							{"code":"AM", "label":"Arrêt maladie"}, 
							{"code": "AB", "label":"Absence diverse"}, 
							{"code":"0.5+FO"}, 
							{"code":"0.5+AM"}, 
							{"code":"0.5+AB"},],
			activiteClicked: "",
		}
	}


	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	};
	choixActivite = (activite) => {
		//Change le bouton sélectionné
		this.setState({activiteClicked: activite});
		console.log(this.state.activiteClicked.code)
	};

	  handleValidate() {
            this.props.navigation.dispatch(NavigationActions.back());
        }

	     //handleValidate = () => {
		//TODO Retourne sur la page des CRA
		//this.props.navigation.navigate('AjoutCra', { date1: this.state.date1})};


	//Gère le rendu des boutons sur plusieurs lignes, et gère le toggle
	renderActiviteButtons = () => {
		console.log(this.state.activitesListe)
		let button, buttons = [];
		const maxItems = 4;
		let tempLength = this.state.activitesListe.length/4;

		//Boucle sur les 2 Lignes
		for (let j=0; j<tempLength; j++)
		{
			//Boucle sur les Boutons
			let button = [];
			for (let i=0; i<maxItems; i++) {

				let nb = i+(maxItems*j);
				if (this.state.activitesListe[nb] != undefined) {

					let activite = this.state.activitesListe[nb];
					let code = activite.code;
					let styleButton = styles.btnChoixDetail;
					//Si le bouton courant est dans le state activiteClicked, un style lui est rajouté
					if(this.state.activiteClicked.code != undefined && this.state.activiteClicked.code==code) {
						styleButton = [styles.btnChoixDetail, styles.btnChoixClicked];
					}
					
					button.push(
						<View key={nb}>
							<TouchableOpacity  onPress={() => this.choixActivite(activite)} 
							style={styleButton}>
								<Text style={styles.activitesText}>{code}</Text>
							</TouchableOpacity >
						</View>
					)
				}
			}//Ajoute la liste des boutons à la ligne
			buttons.push(
				<View key={j+100} style={[styles.calendarFlexContainer, styles.marginBottom20]}>
					{button}
				</View>
			)
		}
		return buttons;
	};

	//Gère l'affichage du détail d'une activité quand sélectionnée
	renderDetailActivite() {

		let activite = this.state.activiteClicked;
		if (activite.code != undefined)
			return <Text style={styles.text}>{activite.code} = {activite.label}</Text>;
					
	}

	render() {

		return (

			<View>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                <View style={Style.firstView}>
					<View style={styles.calendarContainer}>
						<View style={styles.calendarFlexContainer}>
							<Text style={styles.calendarText}>Du</Text>
							<Calendar style={styles.calendarComponent} date={this.state.date1} onValueChange={(newDate) => this.setState({date1:newDate})}/>
						</View>
						<View style={styles.calendarFlexContainer}>
							<Text style={styles.calendarText}>Au</Text>
							<Calendar style={styles.calendarComponent} date={this.state.date2} onValueChange={(newDate) => this.setState({date2:newDate})}/>
						</View>
					</View>
                </View>
				<View style={Style.firstView}>

					<View style={styles.detailActivite}>
						{this.renderDetailActivite()}
					</View>

				</View>
				<View style={Style.firstView}>					

					<View style={[styles.calendarContainer]}>
						
							{this.renderActiviteButtons()}

					</View>
				</View >
				<View style={Style.firstView}>
					<View style={styles.containerButton}>
						<Button
							styleButton={styles.validateButton}
							text="Valider"
							onPress={() => this.handleValidate() }
						/>
					</View>
				</View>
				</ContainerTitre>
			</View>

		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	ActivitesDetail: {
		screen: ActivitesDetail,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 
