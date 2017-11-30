import React from "react";
import { View, Text, TextInput, Picker, TouchableOpacity } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "./styles";
import moment from "moment";
import { momentConfig } from '../../../configuration/MomentConfig';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import Calendar from "../../../components/calendar/Calendar";
import styles from "./styles";
import 'whatwg-fetch';

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

		console.log("INIT : " + params.idPeriod);

		if (params.idPeriod == null) {

			let now = moment().format("DD/MM/YYYY");

			// Nouvelle période
			this.state = {
				title: "Détails période",
				date1: now,
				moment1: "1",
				date2: now,
				moment2: "2",
				absence: "",
				joursFeries: feries2017,
				workingDays: 0,
				numDemande: params.numDemande == null ? 0 : params.numDemande,
			};
		} else {
			// Récupéré depuis le state du parent
			var period = {
				numDemande: parentState.numDemande,
				startDate: parentState.periods[params.idPeriod].dateDuFormated,
				startPeriod: "1",
				endDate: parentState.periods[params.idPeriod].dateAuFormated,
				endPeriod: "2",
				absTypeId: parentState.periods[params.idPeriod].codeTypeAbs,
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
			};
		}
	}

	savePeriod(idPeriod) {
		const { params } = this.props.navigation.state;
		var parent = params.parent;
		var hour1 = '';
		var hour2 = '';
		if (params.idPeriod == null) {
			parent.state.nbPeriode = parent.state.nbPeriode == 0 ? 1 : parent.state.nbPeriode + 1;
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

		let periodToSave = {
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
		};

		let parentPeriods = Array.from(parent.state.periods);

		if (params.idPeriod == null) {
			// Nouvelle période, on l'ajoute au tableau
			// periodToSave.numLigne = parentPeriods.length;
			parentPeriods.push(periodToSave);
		}
		else {
			parentPeriods[params.idPeriod] = periodToSave;
		}


		// On retrie les périodes par date de début
		parent.setState({periods: parentPeriods});
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
			if (currentDate.day() > 0 && currentDate.day() < 6) {
				//Si ce n'est pas un jour férié on incremente le compteur
				total = !this.isJourFerie(currentDate) ? total + 1 : total;
			}
			//Augmente d'un jour
			currentDate = currentDate.add(1, "days");
		}

		//Change la durée totale en fonction du moment choisi
		if (
			dateDu.day() > 0 && dateDu.day() < 6 &&
			this.state.moment1 == 2 &&
			!this.isJourFerie(dateDu)
		) {
			total = total > 0 ? total - 0.5 : total;
		}
		if (
			dateAu.day() > 0 && dateAu.day() < 6 &&
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

// 	renderTypesAbsences() {
// 		const { params } = this.props.navigation.state;
// 		var parentState = params.parent.state;
// // console.warn("2" + JSON.stringify(parentState.arrTypeAbs));
// 		return parentState.arrTypeAbs.map((row) => (
// 			// <Picker.Item key={row.idTypeAbs} label={row.libelle} value={row.code} />
// // console.warn(row.libelle)
// 		));
// 	}

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
