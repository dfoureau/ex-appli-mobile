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
			monthSelected: 5,
			listFrais: [],
			totalMontant: 0,
			totalClient: 0,
			nbJours: 0
		}
	}

	//Affiche les lignes du tableau
	afficherRow(firstDay){
		moment.locale('fr');
		let tal = this.state.listFrais, 
			lignes = [],
			jours = moment(firstDay, "DD-MM-YYYY"),
			daysInMonth = 30 //TODO calculer
		if (tal.length == 0 ) { //A l'init on rempli des lignes vides
			for(let i = 0 ; i < daysInMonth ; i++) {
				lignes.push(<TouchableOpacity key={i} onPress={() => this.modifyNDF(i)}>
								<Row 
									style={[styles.row, i%2 && {backgroundColor: '#FFFFFF'}]}
									borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
									textStyle={styles.rowText}
									data={[jours.format('dd D'), '', 0]}/> 
							</TouchableOpacity>);
				jours.add(1, 'days');
			}
		}
		return lignes;
	}
	
	//Affiche le contenu du menu des mois/années
	loadPickerItems() {
		return this.state.months.map((item,i) => 
			<Picker.Item label={item} value={i} key={i}/>
		)
	}

	modifyNDF(id){
		console.log(id);
        this.props.navigation.navigate('FraisDetail',{id: id});
    }
	addNDF() {
		this.props.navigation.navigate('FraisDetail');
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

		const list = [ 
			{
				id:8,
				jour: '30/10/2017',
				client : 'La Banque Postale',
				montant: 480
			}, {
				id: 9,
				jour: '02/11/2017',
				client : 'La Banque Postale',
				montant: 40
			}, {
				id: 10,
				jour: '02/12/2017',
				client : 'La Banque Postale',
				montant: 800
			}, {
				id: 110,
				startDate: '02/12/2017',
				endDate: '02/12/2017',
				client : 'La Banque Postale',
				montant: 800
			}, {
				id: 120,
				startDate: '02/12/2017',
				endDate: '02/12/2017',
				client : 'La Banque Postale',
				montant: 800
			}, {
				id: 310,
				startDate: '02/12/2017',
				endDate: '02/12/2017',
				client : 'La Banque Postale',
				montant: 800
			}
		]

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
									<Text style={styles.text}>Nombre de jours : {this.state.nbJours}</Text>
								</View>
								<View style={styles.containerButton}>    
									<Button
										text="AJOUTER FORFAIT"
										onPress={() => this.addNDF()}
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
									{this.afficherRow("01/09/2017")}
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
