import React from 'react'
import { Calendar } from 'react-native-calendars';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Style from '../../../styles/Styles';
import styles from './styles';
import CheckBox from 'react-native-check-box'
import moment from 'moment';
import business from 'moment-business';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button } from '../../../components/Buttons';
import Panel from '../../../components/Panel/Panel';

class FraisDetail extends React.Component {
	
	static propTypes = {
		forfait: PropTypes.bool,
		month: PropTypes.number,
		id: PropTypes.number,
	}

	constructor (props) {
		super(props)
		this.state = { 
			title:'Note de frais',
			selectedDatesArray: this.setDatesArray(),
			isforfait: this.props.navigation.state.params.forfait,
			factureClientChecked: false,
			nomClient: this.props.navigation.state.params.client ? this.props.navigation.state.params.client : '',
			lieuDeplacement: '',
			nbKm: '',
			indemKm: 0.333,
			forfait: '',
			sncf: '',
			peages: '',
			essence: '',
			taxi: '',
			nbZones: '',
			pourcent: '',
			hotel: '',
			repas: '',
			invitation: '',
			divers: '',
			libelleDivers: ''
		}
	}

	/** Au chargement **/
	setDatesArray() {
		
		if (this.props.navigation.state.params.month == undefined) return [];
		let arr = [],
			month = this.props.navigation.state.params.month, //numero du mois de la NDF
			date = moment({y: '2017', M: month, d: 1}), //Date de depart : le 1er du mois
			monthOk = true; //verif que le mois est toujours le bon
		
			while (monthOk) {
			if (date.month() == month) {
				if (business.isWeekDay(date)) {//Si weekend on ajoute pas
					arr.push(date.format('YYYY-MM-DD'));
				}
				date.add(1, 'days'); //Incremente le jour
			}
			else monthOk = false; //Si on passe au moins suivant on arrete
		}
		return arr;
	}

	onDateSelected(day) {
		
		let date = day.dateString;
		let index = this.state.selectedDatesArray.indexOf(date);
		if (index <= -1) {
			//Ajout d'une date dans le tableau
			this.setState(prevState => ({
				selectedDatesArray: [...prevState.selectedDatesArray, date]
			}))
		}
		else if (index > -1){
			//Suppression d'une date du tableau
			this.setState((prevState) => ({
				selectedDatesArray: [...prevState.selectedDatesArray.slice(0,index), ...prevState.selectedDatesArray.slice(index+1)]
			}))
		}
	}
	afficherDate() {
		//TEMP recupère la date en parametre 
		let	date = moment(this.props.navigation.state.params.date, 'DD-MM-YYYY');
		return date.format('dddd DD MMMM YYYY');
	}
	
	//Inputs handle
	handleChecked() {
		this.setState(prevState => ({
				factureClientChecked: !prevState.factureClientChecked
			}))
    }
    handleValidate() {
		//Si forfait: params = liste des dates modifiees et des valeurs
		//Si non: params = id de la ligne, valeurs
		if (!this.state.isforfait) {
			this.props.navigation.navigate('FraisAjout', {id: this.props.navigation.state.params.id, client: this.state.nomClient, montant: this.state.nbKm});
		}
		else {
			this.props.navigation.navigate('FraisAjout', {dates: this.state.selectedDatesArray});
		}
    }
    handleDelete() {
        this.props.navigation.navigate('FraisAjout');
    }

	/** Au chargement **/
	convertDates() {
		//Converti les dates selectionnees stockees sous forme de tableau en objet
		let datesObject = {};
		this.state.selectedDatesArray.forEach((date) => {
			datesObject[date] = [{startingDay: true, color: '#355A86'}, {endingDay: true, color: '#355A86',textColor: '#ffff'}];
		} );
		return datesObject;
	}

	render() {
		return (

            <View style={styles.mainContainer}>
                <ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                
				<View style={styles.container}>

					{/*Affiche soit le calendrier pour un forfait, soit la date selectionnée*/}
					{this.state.isforfait ? <View>
							<View style={styles.containerEtat}>
								<Text style={styles.text}>Forfait : sélectionner les jours sur le calendrier</Text>
							</View>

							<View style={styles.containerCalendar}>
								<Calendar
									hideArrows={true}
									markedDates={this.convertDates()}
									markingType={'interactive'}
									onDayPress={(day) => this.onDateSelected(day)}
								/>
							</View>
						</View> : 
						<View style={styles.containerDate}>
							<Text style={[styles.text, {fontSize:18}]}>{this.afficherDate()}</Text>
						</View>
					}
					
					<View style={styles.containerDetails}>

						<Panel 	title="Informations client*" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<CheckBox	
									onClick={() => this.handleChecked()}
									isChecked={this.state.factureClientChecked}
									rightText='Facture client ?'
									rightTextStyle={{color:'black', fontSize: 16}}
									style={styles.checkbox}
								/>
								<View>
									<Text style={styles.text}>Client/Object* :</Text>
									<TextInput
										style={styles.inputComponent}
										value={this.state.nomClient}
										onChangeText={(text) => this.setState({nomClient: text})}
										editable={true}
										underlineColorAndroid='transparent'
									/>	 
								</View>
								<View>
									<Text style={styles.text}>Lieu de déplacement* :</Text>
									<TextInput
										style={styles.inputComponent}
										value={this.state.lieuDeplacement}
										placeholderTextColor='#000000'
										onChangeText={(text) => this.setState({lieuDeplacement: text})}
										editable={true}
										underlineColorAndroid='transparent'
									/>	 
								</View>
							</View>

						</Panel>

						<Panel 	title="Forfait" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText, styles.inputTextSmall]}>Forfait journalier :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow, styles.inputComponentSmall]}
										value={this.state.forfait}
										onChangeText={(text) => this.setState({forfait: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>
								</View> 
							</View>

						</Panel>

						<Panel 	title="Transport" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Nombre de km :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.nbKm}
										onChangeText={(text) => this.setState({nbKm: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>SNCF :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.sncf}
										onChangeText={(text) => this.setState({sncf: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Péages :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.peages}
										onChangeText={(text) => this.setState({peages: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Essence :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.essence}
										onChangeText={(text) => this.setState({essence: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Taxi :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.taxi}
										onChangeText={(text) => this.setState({taxi: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={[styles.inputGroup, {paddingTop: 10, paddingBottom: 10}]}>
								<Text style={styles.text}>Indemnité kilométrique</Text>
								<Text style={[styles.text, {width: 130, textAlign: 'right'}]}>{this.state.indemKm}</Text>
								</View>
							</View>
						</Panel>

						<Panel title="Abonnements" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Nb de zones :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.nbZones}
										onChangeText={(text) => this.setState({nbZones: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>50% :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.pourcent}
										onChangeText={(text) => this.setState({pourcent: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>
								</View> 
							</View>
						</Panel>

						<Panel title="Frais de réception" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Hôtel :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.hotel}
										onChangeText={(text) => this.setState({hotel: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Repas :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.repas}
										onChangeText={(text) => this.setState({repas: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>
								</View> 
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Invitation :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.invitation}
										onChangeText={(text) => this.setState({invitation: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>
								</View> 
							</View>
						</Panel>
							
						<Panel title="Divers" 
								containerStyle={{backgroundColor:"transparent", margin:0}}>

							<View style={styles.inputView}>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText]}>Divers :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow]}
										value={this.state.divers}
										onChangeText={(text) => this.setState({divers: text})}
										editable={true}
										underlineColorAndroid='transparent'
										keyboardType="numeric"
									/>	 
								</View>
								<View style={styles.inputGroup}>
									<Text style={[styles.text,styles.inputText, styles.inputTextSmall]}>Libellé frais divers :</Text>
									<TextInput
										style={[styles.inputComponent, styles.inputComponentRow, styles.inputComponentSmall]}
										value={this.state.libelleDivers}
										onChangeText={(text) => this.setState({libelleDivers: text})}
										editable={true}
										underlineColorAndroid='transparent'
									/>
								</View> 
							</View>
						</Panel>

					</View>
					
                </View>
                
                <View style={styles.containerButton}>
					{/*Bouton supprimer affiché que si ce n'est pas un forfait*/}
                    {!this.state.isforfait && <Button 
                        buttonStyles={styles.deleteButton} 
                        text="SUPPRIMER"
                        onPress={() =>
                           Alert.alert(
                           'Suppression',
                           'Etes-vous sûr de vouloir supprimer la période ?',
                           [{text: 'Non', onPress: () => console.log('Cancel!')},{text: 'Oui', onPress: () => this.handleDelete()},]
                        )}/>}
					<Button onPress={() => this.handleValidate()} text="VALIDER"/>
                </View>
			</ContainerTitre>
			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({
	FraisDetail: {
		screen: FraisDetail,
		navigationOptions: { header: null }
	},
});


// EXPORT DE LA NAVIGATION
export default navigation; 
