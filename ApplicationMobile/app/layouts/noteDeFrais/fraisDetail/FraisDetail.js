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
import service from '../../../realm/service';

const FRAIS_SCHEMA = 'Frais';

class FraisDetail extends React.Component {

	static propTypes = {
		forfait: PropTypes.bool,
		month: PropTypes.number,
		id: PropTypes.number,
	}

	constructor(props) {
		super(props);
		this.setInitialValues();
	}

	setInitialValues() {

		// indique si on se trouve dans le cas d'un création de frais
		let isNewFrais = true;

		if (this.props.navigation.state.params.idFrais != null) {
			// on récupère le frais dans le cas d'une modification
			var frais = service.getByPrimaryKey(FRAIS_SCHEMA, this.props.navigation.state.params.idFrais);
			if (frais != null) {
				// il existe un frais déjà crée en cache
				isNewFrais = false;
			}
		}

		this.state = {
			title: 'Note de frais',
			selectedDatesArray: this.setDatesArray(),
			isforfait: this.props.navigation.state.params.forfait,
			isNewFrais: isNewFrais,
			factureClientChecked: isNewFrais ? false : frais.facturable == 1 ? true : false,
			nomClient: isNewFrais ? '' : frais.client,
			lieuDeplacement: isNewFrais ? '' : frais.lieu,
			nbKm: isNewFrais ? '' : frais.nbKMS.toString(),
			indemKm: 0.333,
			forfait: isNewFrais ? '' : frais.forfait.toString(),
			sncf: isNewFrais ? '' : frais.sncf.toString(),
			peages: isNewFrais ? '' : frais.peages.toString(),
			essence: isNewFrais ? '' : frais.essence.toString(),
			taxi: isNewFrais ? '' : frais.taxi.toString(),
			nbZones: isNewFrais ? '' : frais.nbZones.toString(),
			pourcent: isNewFrais ? '' : frais.pourcentage.toString(),
			hotel: isNewFrais ? '' : frais.hotel.toString(),
			repas: isNewFrais ? '' : frais.repas.toString(),
			invitation: isNewFrais ? '' : frais.invit.toString(),
			divers: isNewFrais ? '' : frais.divers.toString(),
			libelleDivers: isNewFrais ? '' : frais.libelle
		}

	}

	/** Au chargement **/
	setDatesArray() {

		// dans le cas d'une modifcation d'un frais on alimente le tableau de date avec la date du frais (correspondant à son id)
		if (this.props.navigation.state.params.idFrais != null) return [moment(this.props.navigation.state.params.idFrais, 'DD-MM-YYYY')];
		let arr = [],
			month = this.props.navigation.state.params.month, //numero du mois de la NDF
			date = moment({ y: '2017', M: month, d: 1 }), //Date de depart : le 1er du mois
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
		else if (index > -1) {
			//Suppression d'une date du tableau
			this.setState((prevState) => ({
				selectedDatesArray: [...prevState.selectedDatesArray.slice(0, index), ...prevState.selectedDatesArray.slice(index + 1)]
			}))
		}
	}
	afficherDate() {
		let date = moment(this.props.navigation.state.params.idFrais, 'DD-MM-YYYY');
		return date.format('dddd DD MMMM YYYY');
	}

	//Inputs handle
	handleChecked() {
		this.setState(prevState => ({
			factureClientChecked: !prevState.factureClientChecked
		}))
	}
	handleValidate() {

		// on insère les données créées dans le cache
		let frais = {
			id: '',    // primary key			
			jour: 0,
			mois: 0,
			annee: 0,
			// TODO remplacer par celui connecté
			idUser: 999,
			indemKM: this.state.indemKm,
			client: this.state.nomClient,
			facturable: this.state.factureClientChecked ? 1 : 0,
			lieu: this.state.lieuDeplacement,
			nbKMS: this.state.nbKm != '' ? parseInt(this.state.nbKm) : 0,
			peages: this.state.peages != '' ? parseFloat(this.state.peages) : 0,
			forfait: this.state.forfait != '' ? parseFloat(this.state.forfait) : 0,
			sncf: this.state.sncf != '' ? parseFloat(this.state.sncf) : 0,
			nbZones: this.state.nbZones != '' ? parseInt(this.state.nbZones) : 0,
			pourcentage: this.state.pourcent != '' ? parseFloat(this.state.pourcent) : 0,
			hotel: this.state.hotel != '' ? parseFloat(this.state.hotel) : 0,
			repas: this.state.repas != '' ? parseFloat(this.state.repas) : 0,
			invit: this.state.invitation != '' ? parseFloat(this.state.invitation) : 0,
			essence: this.state.essence != '' ? parseFloat(this.state.essence) : 0,
			taxi: this.state.taxi != '' ? parseFloat(this.state.taxi) : 0,
			divers: this.state.divers != '' ? parseFloat(this.state.divers) : 0,
			libelle: this.state.libelleDivers
		};

		// pour chaque date sélectionnée on crée un frais en cache (realms)
		this.state.selectedDatesArray.forEach((date) => {
			
			// la clée primaire insérée correspondant à la date du frais
			frais.id = moment(date).format("DD-MM-YYYY");
			frais.jour = moment(date).get('day');
			frais.mois = moment(date).get('month');
			frais.annee = moment(date).get('year');

			// On test si le frais existe
			if (service.getByPrimaryKey(FRAIS_SCHEMA, frais.id) != null) {
				// mise à jour du frais
				service.update(FRAIS_SCHEMA, frais);
			} else {
				// Création d'un frais
				service.insert(FRAIS_SCHEMA, frais);
			}
		});

		//Si forfait: params = liste des dates modifiees et des valeurs
		//Si non: params = id de la ligne, valeurs
		if (!this.state.isforfait) {
			this.props.navigation.navigate('FraisAjout', { idFrais: this.props.navigation.state.params.idFrais });
		}
		else {
			this.props.navigation.navigate('FraisAjout', { idFrais: this.props.navigation.state.params.idFrais });
		}


	}
	handleDelete() {
		// dans le cas d'une modification d'un frais on le supprime du cache (realms)
		if (!this.state.isNewFrais) {
			service.deleteById(FRAIS_SCHEMA, this.props.navigation.state.params.idFrais);
		}
		this.props.navigation.navigate('FraisAjout');
	}

	/** Au chargement **/
	convertDates() {
		//Converti les dates selectionnees stockees sous forme de tableau en objet
		let datesObject = {};
		this.state.selectedDatesArray.forEach((date) => {
			datesObject[date] = [{ startingDay: true, color: '#355A86' }, { endingDay: true, color: '#355A86', textColor: '#ffff' }];
		});
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
								<Text style={[styles.text, { fontSize: 18 }]}>{this.afficherDate()}</Text>
							</View>
						}

						<View style={styles.containerDetails}>

							<Panel title="Informations client*"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<CheckBox
										onClick={() => this.handleChecked()}
										isChecked={this.state.factureClientChecked}
										rightText='Facture client ?'
										rightTextStyle={{ color: 'black', fontSize: 16 }}
										style={styles.checkbox}
									/>
									<View>
										<Text style={styles.text}>Client/Object* :</Text>
										<TextInput
											style={styles.inputComponent}
											value={this.state.nomClient}
											onChangeText={(text) => this.setState({ nomClient: text })}
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
											onChangeText={(text) => this.setState({ lieuDeplacement: text })}
											editable={true}
											underlineColorAndroid='transparent'
										/>
									</View>
								</View>

							</Panel>

							<Panel title="Forfait"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText, styles.inputTextSmall]}>Forfait journalier :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow, styles.inputComponentSmall]}
											value={this.state.forfait}
											onChangeText={(text) => this.setState({ forfait: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
								</View>

							</Panel>

							<Panel title="Transport"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Nombre de km :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.nbKm}
											onChangeText={(text) => this.setState({ nbKm: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>SNCF :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.sncf}
											onChangeText={(text) => this.setState({ sncf: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Péages :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.peages}
											onChangeText={(text) => this.setState({ peages: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Essence :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.essence}
											onChangeText={(text) => this.setState({ essence: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Taxi :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.taxi}
											onChangeText={(text) => this.setState({ taxi: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={[styles.inputGroup, { paddingTop: 10, paddingBottom: 10 }]}>
										<Text style={styles.text}>Indemnité kilométrique</Text>
										<Text style={[styles.text, { width: 130, textAlign: 'right' }]}>{this.state.indemKm}</Text>
									</View>
								</View>
							</Panel>

							<Panel title="Abonnements"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Nb de zones :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.nbZones}
											onChangeText={(text) => this.setState({ nbZones: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>50% :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.pourcent}
											onChangeText={(text) => this.setState({ pourcent: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
								</View>
							</Panel>

							<Panel title="Frais de réception"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Hôtel :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.hotel}
											onChangeText={(text) => this.setState({ hotel: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Repas :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.repas}
											onChangeText={(text) => this.setState({ repas: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Invitation :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.invitation}
											onChangeText={(text) => this.setState({ invitation: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
								</View>
							</Panel>

							<Panel title="Divers"
								containerStyle={{ backgroundColor: "transparent", margin: 0 }}>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText]}>Divers :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.divers}
											onChangeText={(text) => this.setState({ divers: text })}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text, styles.inputText, styles.inputTextSmall]}>Libellé frais divers :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow, styles.inputComponentSmall]}
											value={this.state.libelleDivers}
											onChangeText={(text) => this.setState({ libelleDivers: text })}
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
									[{ text: 'Non', onPress: () => console.log('Cancel!') }, { text: 'Oui', onPress: () => this.handleDelete() },]
								)} />}
						<Button onPress={() => this.handleValidate()} text="VALIDER" />
					</View>
				</ContainerTitre>
			</View>

		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
	FraisDetail: {
		screen: FraisDetail,
		navigationOptions: { header: null }
	},
});


// EXPORT DE LA NAVIGATION
export default navigation; 
