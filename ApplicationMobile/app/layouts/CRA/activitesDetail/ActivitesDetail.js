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

const ITEMCRA_SCHEMA = 'ItemCRA';

class ActivitesDetail extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { 
			title:'Détails période',
			date1: this.props.navigation.state.params.startDate,
			date2: this.props.navigation.state.params.endDate,
			activite: this.props.navigation.state.params.actType,
			activitesListe: [ 
								{code:"1.0"}, 
								{code:"IC", label:"Intercontrat"}, 
								{code:"FO", label:"Formation"}, 
								{code:"AM", label:"Arrêt maladie"}, 
								{code:"AB", label:"Absence diverse"}, 
								{code:"0.5+FO", label:"0.5 + Formation"}, 
								{code:"0.5+AM", label:"0.5 + Arrêt maladie"}, 
								{code:"0.5+AB", label:"0.5 + Absence diverse"}
							],
			activiteClicked: { code: this.props.navigation.state.params.actType }
		}
	}


	// Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	};

	choixActivite = (activite) => {
		// Change le bouton sélectionné
		this.setState({activiteClicked: activite});
	};

	handleValidate(){
		const { params } = this.props.navigation.state;
		this.saveItemCRA(params.idItem);
        // Retour à la page d'ajout
        this.props.navigation.navigate('AjoutCRA');
	}
	
	saveItemCRA(idItem)
    {
        var item = {
            id: idPeriod == null ? service.getNextKey(PERIOD_SCHEMA) : idPeriod,
            idConge: this.state.idConge,
            startDate: this.state.date1,
            startPeriod: this.state.moment1, 
            endDate: this.state.date2,
            endPeriod: this.state.moment2,
            absTypeId: this.state.absence,
            workingDays: this.state.workingDays
        }; 

        // Mise à jour d'un item
		service.update(ITEMCRA_SCHEMA, item);
    }

	// Gère le rendu des boutons sur plusieurs lignes, et gère le toggle
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

					// Si le bouton courant est dans le state activiteClicked, un style lui est rajouté
					if(this.state.activiteClicked.code != null && this.state.activiteClicked.code == code) {
						styleButton = [styles.btnChoixDetail, styles.btnChoixClicked];
					}
					
					button.push(
						<View key={nb}>
							<TouchableOpacity 
								onPress={() => this.choixActivite(activite)} 
								style={styleButton}>
								<Text style={styles.activitesText}>{code}</Text>
							</TouchableOpacity >
						</View>
					)
				}
			}
			// Ajoute la liste des boutons à la ligne
			buttons.push(
				<View key={j+100} style={[styles.calendarFlexContainer, styles.marginBottom20]}>
					{button}
				</View>);
		}
		return buttons;
	};

	//Gère l'affichage du détail d'une activité quand sélectionnée
	renderDetailActivite() {
		let activite = this.state.activiteClicked;
		if (activite.code != undefined)
			if (activite.label != undefined) 
				return <Text style={styles.text}>{activite.code} = {activite.label}</Text>;
			else return <Text style={styles.text}>{activite.code}</Text>;				
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
			</View>);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({
	ActivitesDetail: {
		screen: ActivitesDetail,
		navigationOptions: { header: null }
	}
});


// EXPORT DE LA NAVIGATION
export default navigation; 
