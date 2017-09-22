import React from 'react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { View, Text, TextInput, Picker, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from '../../../styles/Styles';
import styles from './styles';


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
			status:'Brouillon', 
			statusLabel:'Nouvelle NDF',
			header: ['Date du', 'Date au', 'Client', 'Montant'],
			months: ["Avril 2017", "Mai 2017", "Juin 2017", "Juillet 2017", "Aout 2017", "Septembre 2017", "Octobre 2017", "Novembre 2017", "Décembre 2017", 'Janvier 2018', "Février 2018", "Mars 2018", ],
			monthSelected: 5,
			listFrais: [ 
				{
					id:8,
					startDate: '30/10/2017',
					endDate: '31/10/2017',
					client : 'La Banque Postale',
					montant: 480
				}, {
					id: 9,
					startDate: '02/11/2017',
					endDate: '03/11/2017',
					client : 'La Banque Postale',
					montant: 40
				}, {
					id: 10,
					startDate: '02/12/2017',
					endDate: '02/12/2017',
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
			],
			totalMontant: 0,
			totalClient: 0,
			nbJours: 0
		}
	}

	//Affiche les lignes du tableau
	afficherRow(){
        return (this.state.listFrais.map((row, i) => (
            <TouchableOpacity key={i} onPress={() => this.modifyNDF(row.id)}>
                <Row 
                style={[styles.row, i%2 && {backgroundColor: '#FFFFFF'}]}
                borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
                textStyle={styles.rowText}
                data={[row.startDate, row.endDate, row.client, row.montant]}/> 
            </TouchableOpacity>   
        )));
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
        this.setState({statusId: 2, status: 'Brouillon', statusLabel: 'DC en brouillon'});
        this.props.navigation.navigate('FraisConfirmation');
	}
	validateNDF(){
        this.setState({statusId: 3, status: 'Validé', statusLabel: 'Modifications interdites'});
        this.props.navigation.navigate('FraisConfirmation');
    }
	
	showDeleteButton()
    {
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
            return <Button 
                        buttonStyles={styles.draftButton}
                        text="BROUILLON" 
                        onPress={() => this.saveDraft()} />
    }

    showValidateButton()
    {
            return <Button 
                        text="VALIDER" 
                        onPress={() => this.validateNDF()} />
    }

	render() {


		return (

			<View>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                
				<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
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
							<View style={styles.containerInfoElement}>
								<Text style={styles.text}>Total à régler : {this.state.totalMontant} €</Text>
								<Text style={styles.text}>Total client : {this.state.totalClient} €</Text>
								<Text style={styles.text}>Nombre de jours : {this.state.nbJours}</Text>
							</View>
							<View style={styles.containerButton}>    
								<Button
									text="AJOUTER"
									onPress={() => this.addNDF()}
									buttonStyles={Style.addButton}/>
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
                   
					

				    <View style={styles.container4}>
						{this.showDeleteButton()}
						{this.showDraftButton()}
						{this.showValidateButton()}{console.log(this.props.navigation)}
					</View>
					</ScrollView>
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
