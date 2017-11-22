import React from "react";
import { View, Text, TextInput, Picker, TouchableOpacity } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";
import moment from "moment";
import business from "moment-business";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import Calendar from "../../../components/calendar/Calendar";
import styles from "./styles";
import 'whatwg-fetch';

const PERIOD_SCHEMA = "Period";
const feries2017 = [
	"01/01",
	"17/04",
	"01/05",
	"08/05",
	"25/05",
	"14/07",
	"15/08",
	"01/11",
	"11/11",
	"25/12",
];

class CongesPeriode extends React.Component {
	constructor(props) {
		super(props);
		this.setInitialValues();
	}

	static navigationOptions = ({ navigation }) => ({
		numDemande: navigation.state.params.numDemande,
		idPeriod: navigation.state.params.idPeriod,
		isNew: navigation.state.params.isNew,
	});

	setInitialValues() {
		const { params } = this.props.navigation.state;
		var parentState = params.parent.state;

		if (params.idPeriod == null) {

			var currentDate = new Date();

			// Nouvelle période
			this.state = {
				title: "Détails période",
				date1: currentDate.toLocaleDateString('fr-FR'),
				moment1: "1",
				date2: currentDate.toLocaleDateString('fr-FR'),
				moment2: "2",
				absence: "",
				joursFeries: feries2017,
				workingDays: 0,
				numDemande: params.numDemande == null ? 0 : params.numDemande,
				WSLinkTypeAbs: "http://localhost:8000/conges/typesabsences",
				arrTypeAbs: [],
			};
		} else {
			// Récupéré depuis le state du parent
			var period = {
				numDemande: parentState.numDemande,
				startDate: parentState.periods[params.idPeriod - 1].dateDuFormated,
				startPeriod: "1",
				endDate: parentState.periods[params.idPeriod - 1].dateAuFormated,
				endPeriod: "2",
				absTypeId: parentState.periods[params.idPeriod - 1].codeTypeAbs,
			};

			this.state = {
				title: "Détails période",
				date1: period.startDate,
				moment1: period.startPeriod,
				date2: period.endDate,
				moment2: period.endPeriod,
				absence: period.absTypeId,
				joursFeries: feries2017,
				workingDays: 0,
				numDemande: params.numDemande == null ? 0 : params.numDemande,
				WSLinkTypeAbs: "http://localhost:8000/conges/typesabsences",
				arrTypeAbs: [],
			};
		}
	}

	componentDidMount() {
		this.getTypesAbsences();
	}

	// Retourne les types absences congés
	getTypesAbsences() {
		var that = this;

		fetch(this.state.WSLinkTypeAbs)
		.then(function(response) {
			if (response.status >= 400) {
				that.setState(arrTypeAbs: []);
				throw new Error("Bad response from server");
			}
			return response.json();
		})
		.then(function(typeAbs) {
			that.setState(arrTypeAbs: typeAbs);
		});
	}

	savePeriod(idPeriod) {
		const { params } = this.props.navigation.state;
		var parentState = params.parent.state;
		var hour1 = hour2 = '';
		if (params.idPeriod == null) {
			parentState.nbPeriode = parentState.nbPeriode == 0 ? 1 : parentState.nbPeriode + 1;
		}

		// Matin =1, Midi =2
		if (this.state.moment1 == 1) {
			hour1 = '00:00:00';
		} else {
			hour1 = '12:00:00';
		}

		// Soir =2, Midi =1
		if (this.state.moment2 == 2) {
			hour2 = '23:59:59';
		} else {
			hour2 = '12:00:00';
		}

		if (params.idPeriod == null) {
			// Ajout de la nouvelle période
			parentState.periods.push({
				numLigne: parentState.nbPeriode,
				dateDuFormated: this.state.date1,
				dateAuFormated: this.state.date2,
				dateDu: moment(this.state.date1 + ' ' + hour1, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
				dateAu: moment(this.state.date2 + ' ' + hour2, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
				nbJour: parseInt(this.state.workingDays),
				etat: 0, // A changer dans l'ecran suivant pour toutes les périodes
								 // lorsque l'utilisateur choisit de valider ou d'enregistrer en brouillon
				typeabs: 0,//parseInt(this.state.arrTypeAbs[0][]),
				codeTypeAbs: this.state.absence,
				libelleTypeAbs: '',
				libelleEtat: '',
			});
		} else {
			// Mise a jour de la période
			parentState.periods[params.idPeriod - 1].dateDuFormated = this.state.date1;
			parentState.periods[params.idPeriod - 1].dateAuFormated = this.state.date2;
			parentState.periods[params.idPeriod - 1].dateDu = moment(this.state.date1 + ' ' + hour1, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
			parentState.periods[params.idPeriod - 1].dateAu = moment(this.state.date2 + ' ' + hour2, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
			parentState.periods[params.idPeriod - 1].nbJour = parseInt(this.state.workingDays);
			parentState.periods[params.idPeriod - 1].etat = 0;
			parentState.periods[params.idPeriod - 1].typeabs = 0;
			parentState.periods[params.idPeriod - 1].codeTypeAbs = this.state.absence;
			parentState.periods[params.idPeriod - 1].libelleTypeAbs = '';
			parentState.periods[params.idPeriod - 1].libelleTypeAbs = '';
		}
console.warn(JSON.stringify(parentState.periods));
		// Force l'appel de la fonction render sur la page précedente
		params.parent.forceUpdate();
	}

	handleValidate() {
		const { params } = this.props.navigation.state;
		this.savePeriod(params.idPeriod);
		// Retour à la page d'ajout
		this.props.navigation.dispatch(NavigationActions.back());
	}

	handleSupprimer() {
		// Retour à la page d'ajout
		this.props.navigation.dispatch(NavigationActions.back());
	}

	calculNbJours() {
		let dateDu = moment(this.state.date1, "DD-MM-YYYY");
		let dateAu = moment(this.state.date2, "DD-MM-YYYY");
		let momentDu = this.state.moment1; //Matin (=1) ok, Midi (=2) -0.5j
		let momentAu = this.state.moment2; //Soir (=2) ok, Midi (=1) -0.5j

		//Calcule la difference entre les deux jours
		let currentDate = moment(dateDu);
		let total = 0;
		while (dateAu.diff(currentDate, "days") >= 0) {
			//Si c'est un jour ouvré
			if (business.isWeekDay(currentDate)) {
				//Si ce n'est pas un jour férié on incremente le compteur
				total = !this.isJourFerie(currentDate) ? total + 1 : total;
			}
			//Augmente d'un jour
			currentDate = currentDate.add(1, "days");
		}

		//Change la durée totale en fonction du moment choisi
		if (
			business.isWeekDay(dateDu) &&
			this.state.moment1 == 2 &&
			!this.isJourFerie(dateDu)
		) {
			total = total > 0 ? total - 0.5 : total;
		}
		if (
			business.isWeekDay(dateAu) &&
			this.state.moment2 == 1 &&
			!this.isJourFerie(dateAu)
		) {
			total = total > 0 ? total - 0.5 : total;
		}

		this.state.workingDays = total;

		return (
			<View style={styles.container}>
				<Text style={styles.text}>Jours ouvrés : {total}</Text>
			</View>
		);
	}

	isJourFerie(date) {
		let res = this.state.joursFeries.indexOf(date.format("DD/MM"));
		if (res > -1) {
			return true;
		}
		return false;
	}
// TODO : probleme d'affichage dur ios
	render() {
		return (
			<View>
				<ContainerTitre
					title={this.state.title}
					navigation={this.props.navigation}
				>
					<View style={Style.firstView}>
						<View style={styles.container}>
							<View style={styles.flexContainer}>
								<Text style={styles.calendarText}>Du</Text>
								<Calendar
									style={styles.calendarComponent}
									date={this.state.date1}
									onValueChange={newDate => this.setState({ date1: newDate })}
								/>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={this.state.moment1}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({ moment1: itemValue })}
									>
										<Picker.Item label="Matin" value="1" />
										<Picker.Item label="Midi" value="2" />
									</Picker>
								</View>
							</View>
							<View style={styles.flexContainer}>
								<Text style={styles.calendarText}>Au</Text>
								<Calendar
									style={styles.calendarComponent}
									date={this.state.date2}
									onValueChange={newDate => this.setState({ date2: newDate })}
								/>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={this.state.moment2}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({ moment2: itemValue })}
									>
										<Picker.Item label="Midi" value="1" />
										<Picker.Item label="Soir" value="2" />
									</Picker>
								</View>
							</View>
						</View>
						{this.calculNbJours()}
					</View>
					<View style={Style.firstView}>
						<View style={[styles.container, styles.marginTop40]}>
							<View style={styles.pickerContainer}>
								<Picker
									style={[styles.picker, styles.pickerAbsences]}
									selectedValue={this.state.absence}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({ absence: itemValue })}
								>
									<Picker.Item label="- Type d'absence -" value="0" />
									<Picker.Item label="Congés payés" value="CP" />
									<Picker.Item label="Congés anticipés" value="CA" />
									<Picker.Item label="Congés sans solde" value="CS" />
									<Picker.Item label="Solde RTT" value="RTT" />
									<Picker.Item label="Congés maternité" value="CMA" />
									<Picker.Item label="Congés paternité" value="CPA" />
									<Picker.Item label="Absence exceptionnelle" value="AE" />
								</Picker>
							</View>
						</View>
					</View>
					<View style={Style.firstView}>
						<View style={styles.containerButton}>
							<View style={styles.button}>
								<Button
									buttonStyles={styles.deleteButton}
									text="Supprimer"
									onPress={() => this.handleSupprimer()}
								/>
							</View>
							<View style={styles.button}>
								<Button
									buttonStyles={styles.validateButton}
									text="Valider"
									onPress={() => this.handleValidate()}
								/>
							</View>
						</View>
					</View>
				</ContainerTitre>
			</View>
		);
	}
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
	CongesPeriode: {
		screen: CongesPeriode,
		navigationOptions: { header: null },
	},
});

// EXPORT DE LA NAVIGATION
export default navigation;
