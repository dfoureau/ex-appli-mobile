import React from 'react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { View, Text, TextInput, Picker, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from '../../../styles/Styles';
import styles from './styles';
import moment from 'moment';
import 'moment/locale/fr';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil';
import FraisDetail from '../fraisDetail/FraisDetail';
import FraisConfirmation from '../fraisConfirmation/FraisConfirmation';

class FraisAjout extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { 
			title:'Note de frais',
			statusId: 1, 
			status:'nouveau', 
			statusLabel:'Nouvelle NDF',
			header: ['Jour', 'Client', 'Montant €'],
			months: ["Avril 2017", "Mai 2017", "Juin 2017", "Juillet 2017", "Aout 2017", "Septembre 2017", "Octobre 2017", "Novembre 2017", "Décembre 2017", 'Janvier 2018', "Février 2018", "Mars 2018", ],
			monthSelected: 8,
			listFrais: this.setListFrais(),
			totalMontant: 0,
			totalClient: 0,
			nbJours: 0,
		}
	}

	//Set la liste des lignes du tableau
	setListFrais() {
		
		//Soit nouvelle NDF -> tableau vide, mois = par defaut le mois en cours (listeFrais vide)
		//Soit vient de modif une ligne de NDf -> tableau prérempli (en cache), mois = pas besoin de le savoir (listeFrais pas vide)
		//Soit ancienne NDF -> tableau prérempli avec get valeurs à partir d'un service, mois = passé en parametre (listeFrais pas vide)
		
		//TODO Check si liste presente dans le cache

		//Nouvelle NDF -> Tableau vide initié
		let currentDate = new Date();
		let initList = [],
			i = 0,
			jours = moment({y: '2017', M: currentDate.getMonth(), d: 1}), //Date de depart : le 1er du mois
			month = jours.month(), //numero du mois choisi
			monthOk = true; //verif que le mois est toujours le bon
		while (monthOk) {
			if (jours.month() == month) {
				initList.push({id: i, 
								date: jours.format('DD-MM-YYYY'), 
								dateShort: jours.format('dd DD'),
								client: '',
								montant:''});
				jours.add(1, 'days'); //passe au jour suivant
				i++;
			}
			else monthOk = false; //Si on passe au moins suivant on arrete
		}

		//Modification NDF (TEMP - la liste doit etre recup dans le cache)
		if (this.props.navigation.state.params != undefined) {
			if (this.props.navigation.state.params.id != undefined && this.props.navigation.state.params.client != undefined){
				let id =this.props.navigation.state.params.id;
				function getWithId(el) { //Cherche l'element dans le tableau qui correspond a l'id
					return el.id == id;
				}
				let index = initList.findIndex(getWithId);
				initList[index].client = this.props.navigation.state.params.client;
				initList[index].montant = this.props.navigation.state.params.montant;
			}
		}
		

		return initList;		
	}

	//Affiche les lignes du tableau à partir de listFrais
	afficherRow(){
		moment.locale('fr');
		return (this.state.listFrais.map((row, i) => (
			<TouchableOpacity key={i} onPress={() => this.modifyNDF(row.id, row.date, row.client)}>
				<Row 
				style={[styles.row, i%2 && {backgroundColor: '#FFFFFF'}]}
				borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
				textStyle={styles.rowText}
				data={[row.dateShort, row.client, row.montant ? row.montant : 0]}/> 
			</TouchableOpacity>   
		)));
		return lignes;
	}
	
	//Affiche le contenu du menu des mois/années
	loadPickerItems() {
		return this.state.months.map((item,i) => 
			<Picker.Item label={item} value={i} key={i}/>
		)
	}

	modifyNDF(id, date, client){ // date & client TEMPORAIRE
		//Indique le numéro de la ligne a modifier, data = toute la liste => TEMPORAIRE
        this.props.navigation.navigate('FraisDetail',{forfait: false, id: id, client:client, date:date});
    }
	addNDF(monthSelected) {
		this.props.navigation.navigate('FraisDetail', {forfait: true, month: monthSelected});
	}
	deleteNDF() {
        this.props.navigation.navigate('FraisConfirmation');
	}
	saveDraft(){
        this.setState({statusId: 2, status: 'brouillon', statusLabel: 'NDF en brouillon'});
        this.props.navigation.navigate('FraisConfirmation');
	}
	validateNDF(){
        this.setState({statusId: 3, status: 'validé', statusLabel: 'Modifications interdites'});
        this.props.navigation.navigate('FraisConfirmation');
    }
	
	showDeleteButton()
    {
		if(this.state.statusId == 2)
        	return <Button 
                        buttonStyles={styles.deleteButton} 
                        text="SUPPRIMER"
                        onPress={() =>
                           Alert.alert(
                           'Suppression',
                           'Etes-vous sûr de vouloir supprimer la note de frais ?',
                           [
                           {text: 'Non', onPress: () => console.log('Cancel!')},
                           {text: 'Oui', onPress: () => this.deleteNDF()},
                           ]
                           )
                           }/>
    }

    showDraftButton()
    {
		if(this.state.statusId == 1 || this.state.statusId == 2)
            return <Button 
                        buttonStyles={styles.draftButton}
                        text="BROUILLON" 
                        onPress={() => this.saveDraft()} />
    }

    showValidateButton()
    {
		if(this.state.statusId == 1 || this.state.statusId == 2)
            return <Button 
                        text="VALIDER" 
                        onPress={() => this.validateNDF()} />
    }

	render() {

		return (

			<View style={styles.mainContainer}>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                
				<View style={styles.container}>

                    <View style={styles.container1}>
                        <View style={styles.containerStatus}>
                            <Text style={styles.text}>Etat : {this.state.status}</Text>
                        </View>
                        <View style={styles.containerStatusLabel}>
                            <Text style={styles.statusLabel}>{this.state.statusLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.container2}>
							<View style={styles.containerPicker}>
								<Picker
									style={{width:160}}
									selectedValue={this.state.monthSelected}
									onValueChange={(itemValue, itemIndex) => this.setState({monthSelected: itemIndex})}>
									{this.loadPickerItems()}
								</Picker>
							</View>
							<View style={styles.containerColumn}>
								<View style={styles.containerInfoElement}>
									<Text style={styles.text}>Total à régler : {this.state.totalMontant} €</Text>
									<Text style={styles.text}>Total client : {this.state.totalClient} €</Text>
									{/*<Text style={styles.text}>Nombre de jours : {this.state.nbJours}</Text>*/}
								</View>
								<View style={styles.containerButton}>    
									<Button
										text="AJOUTER FORFAIT"
										onPress={() => this.addNDF(this.state.monthSelected)}
										buttonStyles={Style.addButton}/>
								</View>
							</View>
							<View style={styles.container2}>
								<Text style={styles.textAide}>Saisir une ligne pour ajouter/modifier une NDF</Text>
							</View>
                    </View>
                    <View style={styles.container3}>
					
							<View style={styles.containerTable}>
								<Table borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}>
									<Row data={this.state.header} style={styles.header} textStyle={styles.headerText} />
									{this.afficherRow()}
								</Table>
							</View>
							
                    </View>                   
					

				    <View style={styles.containerButtons}>
						{this.showDeleteButton()}
						{this.showDraftButton()}
						{this.showValidateButton()}
					</View>

			    </View>
				
            </ContainerTitre>  
			</View>
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	FraisAjout: {
		screen: FraisAjout,
		navigationOptions: { header: null }
    },
    FraisDetail: {
        screen: FraisDetail,
        navigationOptions: { header: null }
    },
    FraisConfirmation: {
		screen: FraisConfirmation,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 
