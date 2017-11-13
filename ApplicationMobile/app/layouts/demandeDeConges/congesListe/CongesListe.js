import React from "react";
import {
	View,
	Text,
	TextInput,
	Picker,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import style from "./styles";
import styleButton from "../../../components/Buttons/styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import { ContainerFilters } from "../../../components/containerFilters";
import { SearchFilter } from "../../../components/searchFilter";
import { OptionFilter } from "../../../components/optionFilter";
import { Button } from "../../../components/Buttons";
import Accueil from "../../accueil/Accueil";
import CongesAjout from "../congesAjout/CongesAjout";

// SCREEN = DEMANDE DE CONGES
class CongesListe extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			title: "Demande de congés",
			data: [],
			year: "",
			dateSolde: "",
			soldeRTT: "",
			soldeConges: "",
// TODO : Construction de l'adresse a partir d'un fichier de config 
// TODO : Recuperation de l'idUser
			WSLinkSolde: "http://185.57.13.103/rest/web/app_dev.php/conges/solde/124124251",
			WSLinkList: "http://185.57.13.103/rest/web/app_dev.php/conges/124124251/",
			// WSLinkSolde: "http://185.57.13.103/rest/web/app_dev.php/conges/solde/124124251",
			// WSLinkList: "http://185.57.13.103/rest/web/app_dev.php/conges/124124251/",
			dataLoaded: false,
			noData: false,
		};
	}

	componentDidMount() {
		var today = new Date();
		var year = today.getFullYear();
		this.getDemandesByUserAndYear(year);
		this.getDemandeCongesByUserId();
	}
	
	// Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran) {
		this.props.navigation.navigate(ecran);
	}

	addNewConge() {
		this.props.navigation.navigate("CongesAjout", { idConge: null });
	}

	getConge(id, dateD, dateA, codeC, nbj, etat, libEtat) {
		this.props.navigation.navigate("CongesAjout", { 
			idConge: id,
			dateDuMin: dateD,
			dateAuMax: dateA,
			codeConge: codeC,
			nbJour: nbj,
			etat: etat,
			libelleEtat: libEtat,
		});
	}

	reloadDemandesConges(_year) {
		this.setState({year: _year});
		this.setState({dataLoaded: false, noData: false});
		
		this.getDemandesByUserAndYear(_year);
	}

	// Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
	getDemandeCongesByUserId() {
		var that = this;

		fetch(this.state.WSLinkSolde)
		.then(function(response) {
			if (response.status >= 400) {
				that.setState({
					dateSolde: "",
					soldeRTT: '',
					soldeConges: ''
				});
				throw new Error("Bad response from server");
			}
			return response.json();
		})
		.then(function(solde) {
			that.setState({
				dateSolde: solde[0]["datesolde"],
				soldeRTT: solde[0]['rtt'],
				soldeConges: solde[0]['cp'],
			});
		});
	}

	// Retourne toutes les demandes de congés de l'utilisateur en paramètre pour l'année en paramètre
	getDemandesByUserAndYear(year) {
    var that = this;
    
		fetch(this.state.WSLinkList + year)
		.then(function(response) {
			if (response.status == 400) {
        that.setState({data: []});
				//throw new Error("Bad response from server");
			} else if (response.status == 404) {
        that.setState({data: [], noData: true});
				//throw new Error("No data found");
      }
			return response.json();
		})
		.then((conges) => this.setState({data: conges, dataLoaded: true})
		);
	}

	render() {
	
		if (!this.state.dataLoaded && this.state.noData == false) {
			return (
				<View>
					<ContainerAccueil
						title={this.state.title}
						afficherEcran={this.afficherEcranParent.bind(this)}
					>
						<ActivityIndicator
							color={"#8b008b"}
							size={"large"}
							style={style.loader}
						/>
						<Text style={style.texte}>
							Récupération des données. Veuillez patienter.
						</Text>
					</ContainerAccueil>
				</View>
			);

		} else {
			return (
				<View>
					<ContainerAccueil
						title={this.state.title}
						afficherEcran={this.afficherEcranParent.bind(this)}
					>
						<View style={style.container}>
							{/* Container avec compteurs des congés*/}
							<View style={style.container1}>
								<View style={style.containerInfoElement}>
									<Text style={style.text}>Solde au :</Text>
									<TextInput
										style={style.textInputYear}
										value={this.state.dateSolde}
										editable={false}
										underlineColorAndroid="transparent"
									/>
								</View>
								<View style={style.containerInfoElement}>
									<Text style={style.text}>RTT :</Text>
									<TextInput
										style={style.textInputCounter}
										value={this.state.soldeRTT}
										editable={false}
										underlineColorAndroid="transparent"
									/>
								</View>
								<View style={style.containerInfoElement}>
									<Text style={style.text}>CP :</Text>
									<TextInput
										style={style.textInputCounter}
										value={this.state.soldeConges}
										editable={false}
										underlineColorAndroid="transparent"
									/>
								</View>
							</View>
							{/* Container filtre et ajout de congés*/}
							<View style={style.container2}>
								<View style={style.containerPicker}>
									<Picker
										style={{ width: 110 }}
										selectedValue={this.state.year}
										onValueChange={(itemValue, itemIndex) => 
											this.reloadDemandesConges(itemValue)}
									>
										<Picker.Item label="2017" value="2017" />
										<Picker.Item label="2016" value="2016" />
										<Picker.Item label="2015" value="2015" />
										<Picker.Item label="2014" value="2014" />
										<Picker.Item label="2013" value="2013" />
										<Picker.Item label="2012" value="2012" />
										<Picker.Item label="2011" value="2011" />
										<Picker.Item label="2011" value="2010" />
										<Picker.Item label="2009" value="2009" />
									</Picker>
								</View>
								<View style={style.containerButton}>
									<Button text="AJOUTER" onPress={() => this.addNewConge()} />
								</View>
							</View>
							{/* Container liste des congés */}
							<View style={style.container3}>
								{this.state.noData &&
									<Text style={style.texte}>
										Aucunes données trouvées pour cette année.
									</Text>
								}
								{!this.state.noData && 
									<FlatList 
                    data={this.state.data}
                    keyExtractor={(item, index) => index}
										renderItem={({ item }) => (
                      <TouchableOpacity
                        key={item.numDemande}
                        onPress={() => this.getConge(item.numDemande, item.dateDuMin, item.dateAuMax, item.codeConge, 
                          item.nbJour, item.etat, item.libelleEtat)}
                      >
											<View style={style.containerList}>
													<View style={style.containerPeriod}>
														<Text style={style.periodText}>
															{item.dateDuMin} au {item.dateAuMax}
														</Text>
														<View style={style.containerIcon}>
															<Image
																style={style.listIcon}
																source={
																	item.etat == 1
																		? require("../../../images/icons/check2.png")
																		: null
																}
															/>
														</View>
													</View>
													<View>
														<Text style={style.dayNumberText}>
															Nb jours : {item.nbJour}
														</Text>
														<Text style={style.statusText}>
															Etat : {item.libelleEtat}
															{item.etat == 1 ? (
																<Text>
																	{" "}
																	par {item.valid} le {item.dateValidation}
																</Text>
															) : null}
														</Text>
													</View>
											  </View>
                      </TouchableOpacity>
										)}
									/>
								}
							</View>
						</View>
					</ContainerAccueil>
				</View>
			);
		}
	}
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
	CongesListe: {
		screen: CongesListe,
		navigationOptions: { header: null },
	},
	CongesAjout: {
		screen: CongesAjout,
		navigationOptions: { header: null },
	},
});

// EXPORT DE LA NAVIGATION
export default navigation;