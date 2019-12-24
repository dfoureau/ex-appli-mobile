import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Linking,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

import {
  showToast,
  showNotification,
  showLoading,
  hideLoading,
  hide,
} from "react-native-notifyer";

import moment from "moment";
import feries from "moment-ferie-fr";
import "whatwg-fetch";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from "../../../components/containerAccueil/ContainerAccueil";
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";
import ActivitesDetail from "../activitesDetail/ActivitesDetail";
import ClientsDetail from "../clientsDetail/ClientsDetail";
import StyleGeneral from "../../../styles/Styles";
import style from "./styles";
import Panel from "../../../components/Panel/Panel";

import configurationAppli from "../../../configuration/Configuration";

class AjoutCraMulti extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues();
  }
  
   static navigationOptions = ({ navigation }) => ({
    idMulti: navigation.state.params.idMulti,
    parent: navigation.state.params.parent,
  });

  /**
  * Méthode appelée dans le constructeur pour initialiser les valeurs d'un nouveau cra multi
  */
  setInitialValues() {
	  
    const { params } = this.props.navigation.state;
	
    let now = moment();
    let monthSelected = now.month() + 1; // On prend le mois +1 à case de l'indexation des mois en javascript (0 -> 11)
    let yearSelected = now.year();
	
    if (params.month != null) {
      monthSelected = params.month;
    }
    if (params.year != null) {
      yearSelected = params.year;
    }
	
    this.state = {
      yearSelected: parseInt(yearSelected),
      monthSelected: parseInt(monthSelected),
      title: "",
      statusId: null,
      nombreClients: 1,
      Clients: [],
      Responsables: [],
      Projets: [],
      CalendarClient: [],
      TextComment: " ",
      status: "Nouveau",
      header: ["Date", "Client", "Activité"],
      newCra: params.newCra != undefined && params.newCra,
      listItemsCRA: [],
	  idCraMono: [], //la valeur du cra mono si ancien, null si nouveau client
	  delClient: [], //va contenir les clients à supprimer de la base
      activitesListe: [],
      userId: configurationAppli.userID,
      fetchHeaders: {
        Authorization: "Bearer " + configurationAppli.userToken,
      },
      WSLinkCRA: configurationAppli.apiURL + "CRA/RA",
      isReady: false,
      data: [],
      pickerNewCraValue: moment().format("YYYY-MM"),
    };
	
  }

  /**
  * Permet d'afficher l'ecran choisi dans le menu
  * @param ecran
  */
  afficherEcranParent(ecran) {
    this.props.navigation.navigate(ecran);
  }

  /**
  * Calcule le nombre de jours travaillés du mois
  * @return {[type]} [description]
  */
  getNbJoursTravailles() {
	  
    return this.state.listItemsCRA.reduce((result, element) => {
	  return result + this.getValeurJour(element.actType);
	  
    }, 0);
  }

  /**
  * Calcule le nombre de jours d'absence du mois
  * @return {[type]} [description]
  */
  getNbJoursAbsence() {
    return this.state.data.NbJOuvres - this.getNbJoursTravailles();
  }

  /**
  * Retrouve la quantité travaillée et la quantité d'absence pour un code donné
  * @param  {[type]} code [description]
  * @return {[type]}      [description]
  */
  getValeurJour(code) {

    let travaille = 0;
    // On cherche le jour dans jourouvre, puis dans jourwe
    let typeAct = this.state.activitesListe.jourouvre.find(element => {
      return element.code.replace(",", ".") == code.replace(",", ".");
    });

    if (typeAct == undefined) {
      typeAct = this.state.activitesListe.jourwe.find(element => {
        return element.code.replace(",", ".") == code.replace(",", ".");
      });
    }
    if (typeAct == undefined) {
      console.log("CODE introuvable : " + code);
    } else {
      travaille = typeAct.valeur;
    }

    return parseFloat(travaille);
  }

  /**
  * On appelle le service pour récupérer les éléments suivants :
  *  - liste des Types Action et leurs libellés
  *  - Liste des jours de CP posés dans le mois
  * @return {Promise} On renvoie un tableau Promise.all, où chaque élément correspond à un retour de webservice
  */
  getServiceGeneralData(year, month) {
    let fetchObj = {
      method: "GET",
      headers: this.state.fetchHeaders,
    };

    let webServiceTypesActivites =
		configurationAppli.apiURL + "CRA/typesactivites",
		webServiceDemandeConges =
		configurationAppli.apiURL +
		"conges" +
		"/" +
		configurationAppli.userID +
		"/" +
		year +
		"/" +
		month;

    return Promise.all([
      // Liste des typesAction
      fetch(webServiceTypesActivites, fetchObj).then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          return Promise.resolve({
            jourouvre: [],
            jourwe: [],
          });
        }
      }),
      // Liste des conges
      fetch(webServiceDemandeConges, fetchObj).then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          return Promise.resolve([]);
        }
      }),
    ]).catch(reason => {
      showToast("Une erreur est survenue.");
      this.props.navigation.dispatch(NavigationActions.back());
    });
  }

  /**
  * Surcharge de la méthode appelé à la création du composant dans le cycle de vie de ce dernier
  */
  componentWillMount() {
	  
    let that = this;
    //Récupération des paramètres de navigation
    const { params } = this.props.navigation.state;
	
    // Récupération des infos générales
    Promise.resolve(
      this.getServiceGeneralData(
        this.state.yearSelected,
        this.state.monthSelected
      )
    ).then(result => {
      let [typesActions, conges] = result;

      if (params.idMulti != null) {
        // Récupération du CRA
        this.getCRAInfosByID(params.idMulti, typesActions, conges);
      } else if (this.state.newCra) {
        // Initialisation des jours avec les valeurs par défaut						
        this.initCra(
          this.state.yearSelected,
          this.state.monthSelected,
          typesActions,
          conges
        );
      } else {
        that.setState({
          data: [],
          isReady: true,
          activitesListe: typesAction,
        });
      }
    });
  }

  /**
  * fonction pour savoir si il y a deja un cra multi pour le mois choisi
  */
  initCra(year, month, typesActions, conges)
  {
	const idMulti = "" + configurationAppli.userID + year + month;				  
	let that = this;
	  	  
	fetch(this.state.WSLinkCRA + "/isMulti/" + idMulti, {
		method: "GET",
		headers: this.state.fetchHeaders,
	})
	.then(response => {	  
        return Promise.all([Promise.resolve(response.status), response.json()]);
      })
	.then(function(response){		
		let [status, body] = response;		
		if(body){			
			that.getCRAInfosByID(idMulti, typesActions, conges);		
			console.log("picker value after get : " + that.state.pickerNewCraValue);
			
		}else{		
			that.initDefaultCra(year, month, typesActions, conges);
		}
	});	
  }
  
  /**
  * @param date
  */
  reloadNewCra(date) {	  
    let year = moment(date, "YYYY-MM").year(),
    month = moment(date, "YYYY-MM").month() + 1;
    showLoading("Chargement des informations...");
	
    this.getServiceGeneralData(year, month)
    .then(result => {
      let [typesActions, conges] = result;
      this.setState({
        yearSelected: year,
        monthSelected: month,
      });
	  
      this.initCra(year, month, typesActions, conges);
    })
    .catch(error => {
      showToast("Une erreur est survenue.");
      this.props.navigation.dispatch(NavigationActions.back());
    })
    .finally(() => {
      hideLoading();
    });
  }
  
  /**
  * Initialise un CRA avec les valeurs par défaut
  * Jours ouvrés : "1.0"
  * WE et jours fériés : "0.0"
  * On tient également compte des congés
  * @param  {int} year     Année du CRA
  * @param  {int} month    Mois du CRA
  * @return {[type]}       [description]
  */
  initDefaultCra(year, month, typesActions, conges) {
	  	  
    let data = {
      idRA: null,
      mois: month,
      annee: year,
      libelle: "Nouveau",
      NbJOuvres: 0,
      nbJourTravailles: 0,
      nbJourAbs: 0,
      client: [],
      responsable: "",
      projet: "",
      commentaire: "",
      valeursSaisies: [],
      pickerNewCraValue: moment().format("YYYY-MM"),
    }; // Objet à peupler pour créer un nouveau CRA

    let date = moment(year + "-" + month, "YYYY-M");
    let nbJours = date.daysInMonth();	

    let valeurSaisie = null;
    for (let i = 1; i <= nbJours; i++) {
      date.set("date", i);

      valeurSaisie = {
        startDate: date.format("DD/MM/YYYY"),
        disabled: false,
        actType: "1.0",
      };

      // On verifie si le jour est férié
      if (date.isFerie()) {
        valeurSaisie.isFerie = true;
        valeurSaisie.actType = "0.0";
        valeurSaisie.disabled = true;
      } else if (date.day() == 0 || date.day() == 6) {
        // On vérifie si le jour est un samedi ou un dimanche
        valeurSaisie.isWE = true;
        valeurSaisie.actType = "0.0";
      } else {
        // On vérifie si le jour correspond à une demande de congé
        data.NbJOuvres++;
        let congeData = conges.find(item => item.jour == i);
        if (congeData != undefined &&congeData != null) {
          if (congeData.code != "1,0" && congeData.code != "1.0") {
            valeurSaisie.actType = congeData.code;
            valeurSaisie.disabled = true; // ??? à vérifier.
          }
        }
      }

      data.valeursSaisies.push(valeurSaisie);
    }

    data.NbJOuvres = data.NbJOuvres.toFixed(1);
    this.setState({
      isReady: true,
      data: data,
      statusId: null,
      listItemsCRA: data.valeursSaisies,
      Clients: [],
      Responsables: [],
      Projets: [],
      CalendarClient: [],
	  idCraMono: [],
	  delClient: [],
      TextComment: "",
      activitesListe: typesActions,
	  nombreClients: 1,
    });
  }
  
  /**
  * Demande à l'API pour récupérer tous les CRA Mono correspondant au même CRA Multi
  * @param idMulti			id du cra multi
  * @param typesActions		types d'actions possible pour un jour
  * @param conges 			liste des congés posés par le collaborateur
  */
  getCRAInfosByID(idMulti, typesActions, conges) 
  {		
    let that = this;
    fetch(this.state.WSLinkCRA + "/Multi/" + idMulti, {
      method: "GET",
      headers: this.state.fetchHeaders,
    })
    .then(function(response) {
      if (response.status >= 400) {
        that.setState(
          {
            data: [],
            idReady: true,
          },
          () => {
            throw new Error("Bad response from server");
          }
        );
      } else {
        return response.json();
      }
    })
    .then(function(craMulti) {
		
		craMulti.NbJOuvres = parseFloat(craMulti[0].NbJOuvres);
		craMulti.libelle = craMulti[0].libelle;
				
		let nbClient = 0;
		let clientArray = [];
		let responsableArray = [];
		let projetsArray = [];
		let calendarClientArray = [];
		let listItemsCRAArray = [];
		
		let idCraMonoArray = [];
		
		
		that.setState({
			statusId: craMulti[0].etat,
		});
		
		for(let numClient=0; numClient<craMulti.length; numClient++) {
			nbClient++;
			clientArray[numClient] = craMulti[numClient].client;
			responsableArray[numClient] = craMulti[numClient].responsable;
			projetsArray[numClient] = craMulti[numClient].projet;			
			
			calendarClientArray[numClient] = that.getClientJourTravaille(craMulti[numClient].valeursSaisies, conges);			
			listItemsCRAArray[numClient] = that.getItemsCRA(craMulti[numClient].valeursSaisies, conges);

			idCraMonoArray[numClient] = craMulti[numClient].idRA;
		}
		
		let joinItemCRA = that.getJoinItemCRAFunction(listItemsCRAArray, conges);
		
		const month = craMulti[0].mois.startsWith('1') ? craMulti[0].mois : '0' + craMulti[0].mois			
		
		let pickerValue = craMulti[0].annee + "-" + month;
				
		that.setState({
			isReady: true,
			data: craMulti,
			statusId: craMulti[0].etat,
			title: "",
			nombreClients: nbClient,
			Clients: clientArray,
			Responsables: responsableArray,
			Projets: projetsArray,
			CalendarClient: calendarClientArray,
			idCraMono: idCraMonoArray,
			listItemsCRA: joinItemCRA,
			activitesListe: typesActions,
			TextComment: craMulti[0].commentaires,
			userId: configurationAppli.userID,
			pickerNewCraValue: pickerValue,		
		});			
				  
    });
  }

	/**
		@param valeursSaisies contient la liste des jours travaillés au format jour/mois/année
		@return la liste des jours où l'utilisateur a travaillé pendant le mois, pour un client
	*/	
	getClientJourTravaille(valeursSaisies, conges){	 
		let tabRet = [];   
				
		let i = 0;		
		for(const val of valeursSaisies){	
			
			if( (this.state.statusId == 1 || this.state.statusId == null || this.state.statusId == 4) ){ //si edition
			
				if (conges.length == 0 || conges[i].etat == "" || conges[i].code.startsWith("0,5") || conges[i].code.startsWith("0.5")) {			
					if(val.activité == '1.0' || val.activité.startsWith('0.5') || val.activité.startsWith('0,5') ) {					
					  tabRet.push(parseInt(val.date.split('/')[0]) - 1);
					}
				}				
			}else{ //si consultation				
			
				if(val.activité == '1.0' || val.activité.startsWith('0.5') || val.activité.startsWith('0,5') ) {					
				  tabRet.push(parseInt(val.date.split('/')[0]) - 1);
				}				
			}
			i++;
		}		
		
		return tabRet;
	}
  
	/**		
		@param listItemsCRAArray tableau avec les activité des jours du mois pour chaque client
		@return le tableau d'activité des jours du mois
	*/	
	getJoinItemCRAFunction(listItemsCRAArray, conges){				
							
		let itemCraAll = [];
				
		for(const client of listItemsCRAArray){
			
			let i = 0;
			for(const item of client){				
			
				if(conges.length != 0 && (conges[i].etat == 1 || conges[i].etat == 2) && (this.state.statusId == 1 ||
				this.state.statusId == null || this.state.statusId == 4) ){
					
					itemCraAll[i] = item;
					itemCraAll[i].actType = conges[i].code;
					itemCraAll[i].disabled = true;
				}else{

					const vacationItems = ["CP", "CA", "CS", "AE", "RTT", "CPA", "CMA", "DLG", "FER", "JC", "JFM"];
					
					let itemCraAllRightValue = null;
					let itemCraDayRightValue = null;
									
					if(itemCraAll[i] != null && (itemCraAll[i].actType.startsWith("0.5") || itemCraAll[i].actType.startsWith("0,5"))){
						itemCraAllRightValue = itemCraAll[i].actType.split('+')[1];
					}
					
					if(item.actType.startsWith("0.5") || item.actType.startsWith("0,5")){
						itemCraDayRightValue = item.actType.split('+')[1];
					} 
							  
					if(itemCraAll[i] != null && vacationItems.includes(itemCraAllRightValue) || vacationItems.includes(itemCraDayRightValue) 
						&& (this.state.statusId == 2 ||	this.state.statusId == 3 || this.state.statusId == 5) ){			
						itemCraAll[i].disabled = true;
					}
										
				
					if(itemCraAll[i] == null){ 	
						itemCraAll[i] = item;		
					}else if(itemCraAll[i].actType == "0.0" && item.actType != "0.0"){
						itemCraAll[i].actType = item.actType;
					}else if(itemCraAll[i].actType == "AB" && item.actType != "0.0"){
						itemCraAll[i].actType = item.actType;
					}else if(itemCraAll[i].actType == "0.5+AB" && item.actType == "0.5+AB"){
						itemCraAll[i].actType = "1.0";
					}else if(itemCraAll[i].actType == "AB" && item.actType == "1.0"){
						itemCraAll[i].actType = "1.0";
					}else if(itemCraAll[i].actType == "1.0" && item.actType == "AB"){
						itemCraAll[i].actType = "1.0";
					}else if(itemCraAll[i].actType == "0.0" && item.actType == "0.5+AB"){
						itemCraAll[i].actType = "0.5+AB";
					}
					
				}				
				i++;
			}			
			
		}
				
		return itemCraAll;
	}
	
	/**
	* @return les jours du mois avec leurs activités associées
	* @param valeurSaisies est tableau de tableau de valeurs saisies pour un client
	* @conges est un tableau contenant la liste des congés de l'utilisateur
	*/
  getItemsCRA(valeursSaisies, conges) {
	 		
    return valeursSaisies.map(item => {
      let actType = item.activité;
      let disabled = false;
      let date = moment(item.date, "DD/MM/YYYY");
	  
	  const vacationItems = ["CP", "CA", "CS", "AE", "RTT", "CPA", "CMA", "DLG", "FER", "JC", "JFM"];
	  
      if (date.isFerie()) {
        disabled = true;
        actType = "0.0";
      } else {
        if (date.day() > 0 && date.day() < 6) {
          // On vérifie qu'on est un jour en semaine
          let congeData = conges.find(item => item.jour == date.date()); // On récupère la ligne de congé pour vérifier si un CP a été posé ou pas
		  		  
          if (
            congeData != null &&
            congeData != undefined &&
            congeData.code != "1,0" &&
            congeData.code != "1.0" && (this.state.statusId == 1 ||
				this.state.statusId == null || this.state.statusId == 4)
          ) {
            disabled = true;
            actType = congeData.code;
          }
        }
		
		let isConge = actType;
		if(actType.startsWith("0.5") || actType.startsWith("0,5")){
			isConge = actType.split('+')[1];
		}
		  		  
		if(vacationItems.includes(isConge) && (this.state.statusId == 2 ||
        this.state.statusId == 3 || this.state.statusId == 5) ){			
			disabled = true;
		}	
		
      }
	  
      return {
        startDate: item.date,
        actType: actType,
        disabled: disabled,
        //valeur: item.valeur,
      };
    });
  }

  /**
  * Supprime le CRA via un appel API
  * @return {[type]} [description]
  */
  deleteCra() {
    let idMulti = this.props.navigation.state.params.idMulti,
    parent = this.props.navigation.state.params.parent,
    annee = this.state.yearSelected;

    let that = this;

    showLoading("Suppression en cours...");

    fetch(this.state.WSLinkCRA + "/Multi/" + idMulti, {
      method: "DELETE",
      headers: this.state.fetchHeaders,
    })
    .then(response => {
      return Promise.all([response.status, response.json()]);
    })
    .then(res => {
      hideLoading();
      let [status, body] = res;

      let success = status == 200;
      showToast((success ? "Succès" : "Erreur") + "\n" + body.message);

      // On redirige vers la page précédente uniquement en cas de succès
      if (success) {
        parent.getDemandesByUserAndYear(annee);
        that.props.navigation.dispatch(NavigationActions.back());
      }
    })
    .catch(err => console.log(err));
  }

  /**
  * Enregistre un CRA en fonction du statusId choisi :
  *   - 1 : Enregistre un brouillon
  *   - 2 : Enregistre en demande de validation
  *
  * @param  {int} statusId [description]
  * @return {void}      La méthode affiche une notification, et redirige vers la page de liste en cas de succès
  */
  saveCra(statusId) {
	  
    let allCalendarClient = this.state.CalendarClient;
    let itemsCRA = this.state.listItemsCRA;
	let succesAll = true;

    //const vacationItems = ["RT","CS","AM","CPA"];
	const vacationItems = ["CP", "CA", "CS", "AE", "RTT", "CPA", "CMA", "DLG", "FER", "JC", "JFM"];

    if (statusId != 1 && statusId != 2) {
      showToast("Une erreur est survenue.");
      return;
    }

    // Vérification des donnéees obligatoires client et responsable : Si le nom du client comporte "Client" alors le collaborateur n'a pas indiqué le nom de son client
    let errMsg = "";
    this.state.Clients.forEach(function(client){
      if(client.includes("Client")){
        console.log("Veuillez renseigner le nom de tous les clients.")
        errMsg += "Veuillez renseigner les données du " + client + "\n";
      }
    })
    if (errMsg != "") {
      showToast(errMsg);
      return;
    }
    //Verification que tous les jours dit "travaillé" sont bien indiqué dans au moins un CRA et au max 2 cra
    let i = 0;
    itemsCRA.forEach(function(day)
    {
		//Code pour les 0.5 + absences, problemes enregistrements
		if(day.actType.startsWith("0.5") || day.actType.startsWith("0,5") ){
		  let nbCalendrierContenant = 0
		   allCalendarClient.forEach(calendar => {
            if(calendar.includes(i)) {
              nbCalendrierContenant++
            }
          }
        )
		
		if(nbCalendrierContenant != 1){
			errMsg += (errMsg != "" ? "\n" : "") + "Le Jour " + (i+1) + " recquiert 1 seul client";
		}
		
	  }
	
		
      if(day.actType == "1.0")
      {
        let nbCalendrierContenant = 0
        allCalendarClient.forEach(calendar => {
            if(calendar.includes(i)) {
              nbCalendrierContenant++
            }
          }
        )
        if(nbCalendrierContenant<1) {
          errMsg += (errMsg != "" ? "\n" : "") + "Le Jour " + (i+1) + " n'a pas de client attribué alors qu'il est indiqué comme travaillé";
        }
        else if(nbCalendrierContenant>2) {
          errMsg += (errMsg != "" ? "\n" : "") + "Le Jour " + (i+1) + "est  travaillé pour plus de 2 clients";
        }
        if(nbCalendrierContenant==2) {
          day.actType = "0.5+AB"
        }
      }
	  
      i++
    })
    if (errMsg != "") {
      showToast(errMsg);
      return;
    }
	
	const idMulti = "" + configurationAppli.userID + this.state.yearSelected + this.state.monthSelected;
	
	showLoading("sauvegarde en cours...");
	
	for(let numClient=0; numClient<this.state.delClient.length; numClient++){	
	
		fetch(this.state.WSLinkCRA + "/" + this.state.delClient[numClient], {
			method: "DELETE",
			headers: this.state.fetchHeaders,
		})
		.catch(err => console.log(err));			
	}
		
    //Pour chaque client : on transforme le CRA multi-clients en CRA client unique
    for(let numClient=0; numClient<this.state.nombreClients; numClient++) {	
	
      let that = this;
	  
	  let method = this.state.idCraMono[numClient] == null ? "POST" : "PUT",
	  url = this.state.idCraMono[numClient] == null 
	  ? this.state.WSLinkCRA
	  : this.state.WSLinkCRA + "/" + this.state.idCraMono[numClient];
	  
	  (annee = this.state.yearSelected),
      (parent = this.props.navigation.state.params.parent);	  
	 	  
      let body = {
        idUser: configurationAppli.userID,
		idMulti: idMulti,
        mois: this.state.monthSelected,
        annee: annee,
        etat: statusId,
        nbJourTravailles: this.getNbJoursTravailles().toFixed(1),
        nbJourAbs: this.getNbJoursAbsence().toFixed(1),
        client: this.state.Clients[numClient],
        responsable: this.state.Responsables[numClient],
        projet: this.state.Projets[numClient],
        commentaires: this.state.TextComment,
        valeursSaisies: itemsCRA.map(item => {
          return { date: item.startDate, activité: item.actType };
        }),
      };
	  
      let i = 0;
      //Modification des éléments pour qu'ils corréspondent au client
      body.valeursSaisies.forEach( elements => {
		  		  
          if (vacationItems.includes(elements.activité)) {
            //L'element fait parti des activités à inclure dans tous les CRA : donc à ne pas modifier
          }
          else if(!allCalendarClient[numClient].includes(i)) {
            //L'element n'a pas ete selectioné par le collaborateur
            elements.activité = "AB"
          }
          else {
            //L'element a été séléctionné par ce collab
            elements.activité = itemsCRA[i].actType
          }
          i++
        }
      )
	  	  
      fetch(url, {
        method: method,
        headers: this.state.fetchHeaders,
        body: JSON.stringify(body),
      })
      .then(response => {	  
        hideLoading();
        return Promise.all([Promise.resolve(response.status), response.json()]);
      })
      .then(res => {
        let [status, body] = res;
				
        let success = status == 200;
        showToast((success ? "Succès" : "Erreur") + "\n" + body.message);	
		
		succesAll = (succesAll && success)? true : false;		
        	
      })
      .catch(err => {
        console.log("ERREUR : \n" + err);
      });		  
    }	

	// On redirige vers la page précédente uniquement en cas de succès
	if (succesAll) {		
	  parent.getDemandesByUserAndYear(annee);
	  this.props.navigation.dispatch(NavigationActions.back());
	}		
	
  }
  
  
  componentWillUnmount() {
	() => this.props.navigation.state.params.onBack();
  }
  
  
  /**
  * Fonction appelé pour changer la valeur d'un jour sur le calendrier global du cra
  */
  modifyItemCRA(l, startDate, actType, labelAct, valeur) {	  
    this.props.navigation.navigate("ActivitesDetail", {
      line: l,
      date: startDate,
      activite: actType,
      activiteLabel: labelAct,
      activiteValeur: valeur,
      parent: this,
    });
  }

  /**
  * Fonction appelé pour editer une période, cela amène simplement à la page Activité détail
  */
  modifyPeriodeCRA() {
	  this.props.navigation.navigate("ActivitesDetail", {
      line: null,
      date: null,
      parent: this,
    });
  }

  /**
  * Modifie le client numeroClient
  * Change la page de l'application et lui envoie les données qui lui sont nécéssaires
  */
  modifyClientCRA(numeroClient) {	  	  	  
    let calendarClient = []
    if(this.state.nombreClients == 1) {
      calendarClient[0] = []
      this.state.listItemsCRA.forEach(function(day, index) {
        if(day.actType == "1.0") {
           calendarClient[0].push(index)
          }
        }
      )
    }

    this.props.navigation.navigate("ClientsDetail", {
      line: null,
      date: null,
      parent: this,
      idClient : numeroClient,
      clientText : this.state.Clients[numeroClient],
      responsableText : this.state.Responsables[numeroClient],
      projetText : this.state.Projets[numeroClient],
      ActualCalendar :( this.state.nombreClients == 1) ? calendarClient : this.state.CalendarClient,
      listItem : this.state.listItemsCRA,
    });
  }


  /**
  * Supprime le client numeroClient
  * Change la page de l'application et lui envoie les données qui lui sont nécéssaires
  */
  deleteClientCRA(numeroClient) {	  
    
	if(this.state.idCraMono[numeroClient] != null){ //c'est un client déjà en base			
		this.setState({
			delClient: [...this.state.delClient, this.state.idCraMono[numeroClient]],
		});				
	}	
	
	//a faire dans tous les cas 
    this.setState({ nombreClients: this.state.nombreClients - 1 })
    this.state.CalendarClient.splice(numeroClient,1);
    this.state.Clients.splice(numeroClient,1);
    this.state.Projets.splice(numeroClient,1);
	this.state.idCraMono.splice(numeroClient,1);
    this.state.Responsables.splice(numeroClient,1);

    for(let i = numeroClient; i<this.state.nombreClients; i++)
    {
      if(this.state.Clients[i])
      {
        if(this.state.Clients[i] && this.state.Clients[i].includes("Client"))
        {
          this.state.Clients[i]= "Client " + (i+1)
          this.state.Projets[i]= "Projet " + (i+1)
          this.state.Responsables[i]= "Responsable " + (i+1)
        }
      }
    }
	
  }

  /**
  * Fonction du bouton demandant la suppression du relevé d'activié
  * Si validation, appelle la méthode deleteCra() supprimant les CRAs en base
  */
  showDeleteButton() {
    if (this.state.statusId == 1 || this.state.statusId == 4) {
    return (
      <Button
      text="SUPPRIMER"
      buttonStyles={style.deleteButton}
      onPress={() =>
        Alert.alert(
          "Suppression",
          "Etes-vous sûr de vouloir supprimer le relevé d'activité ?",
          [
            { text: "Non", onPress: () => console.log("Cancel Pressed!") },
            { text: "Oui", onPress: () => this.deleteCra() },
          ]
        )}
        />
      );
    }
    }

	/**
	* Fonction du bouton d'enregistrement en brouillon d'un CRA
	*/
    showDraftButton() {
      if (
        this.state.statusId == 1 ||
        this.state.statusId == null ||
        this.state.statusId == 4
      )
      return (
        <Button
			buttonStyles={style.draftButton}
			text="BROUILLON"
			onPress={() => this.saveCra(1)}
        />
      );
    }

	/**
	* Fonction du bouton d'enregistrement définitif d'un CRA
	*/
    showValidateButton() {
      if (
        this.state.statusId == 1 ||
        this.state.statusId == null ||
        this.state.statusId == 4
      )
      return ( <Button
           text="VALIDER"
            onPress={() =>
              Alert.alert(
               "! ATTENTION !",
               "Votre saisie est-elle cohérente avec la saisie chez le client ?",
               [
                 { text: "Non" , onPress: () => console.log("Cancel Pressed!") },
                 { text: "Oui", onPress: () => this.saveCra(2)},
               ]
             )}
         />);
    }

    /**
     * Affiche un bouton pour chaque client
     * @return {boutonsClients} On renvoie les boutons à afficher
     */
    afficherClients()
    {
      if(parseInt(this.state.nombreClients) > 0 ) {
        //Si jamais le nombre de clients est réduit : Alors on supprime les clients "en trop"
        this.state.Clients.length = this.state.nombreClients;
        this.state.Projets.length = this.state.nombreClients;
        this.state.Responsables.length = this.state.nombreClients;
		
        //On associe le nom "Client 1, Client 2, ..." pour chaque client dont les valeurs ne sont pas encore rentrées
        for (let i = 0; i < this.state.nombreClients; i++) {
						
          if(this.state.Clients[i] == null) {
			  			  
            this.state.Clients[i] = "Client " + (i+1)
            this.state.Projets[i] = "Projet " + (i+1)
            this.state.Responsables[i] = "Responsable " + (i+1)
          }
        }
		
        //On stocke les "boutons Clients" dans une variable
        const boutonsClients = this.state.Clients.map((client, index) =>
        <View key={client.toString()} onPress={() => this.modifyClientCRA(index)} style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent:"space-between", borderBottomWidth: 1, borderBottomColor: 'grey', marginBottom: 5, width: "100%"}}>
          <View style={{flexDirection: 'row',alignItems:"center",}}>
            <View>
            <Icon name="user" size={30} color="black" onPress={() => this.modifyClientCRA(index)} style={{marginRight: 15, marginBottom: 5}}/>
            </View>
            <View>
            <Text style={{marginRight: 10, marginBottom: 5, color: "black", textDecorationLine:"underline", fontSize: 15,}}  onPress={() => this.modifyClientCRA(index)}>{client}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems:"center",justifyContent:"space-around"}} >
            <Text style={{ marginRight: 60,marginBottom: 5, color: "grey"}}  onPress={() => this.modifyClientCRA(index)}>{this.calculerNombreJours(index)} jrs</Text>
            <Icon name="trash-o" size={25} color="black" onPress={() => this.deleteClientCRA(index)} style={{borderRadius: 5}} />
          </View>
        </View>
      );
      //On reourne la variable contenant l'ensemble des boutons clients
      return boutonsClients
    }
  }

  /**
  * Calcul le nombre de jour travaillé chez un client
  * @param idClient indice du client souhaité dans le tableau Clients
  * @return le nombre de jour travaillé dans le mois chez le client correspondant à idClient
  */ 
  calculerNombreJours(idClient)
  {
    nombreJours = (this.state.CalendarClient[idClient])?this.state.CalendarClient[idClient].length:0 ;
    if(this.state.CalendarClient[idClient])
    {
      let Cal = this.state.CalendarClient[idClient]
      this.state.CalendarClient.forEach(function(Calendrier, index){
        if(index != idClient)
        {
          Calendrier.forEach(day=>{
            if(Cal && Cal.includes(day))
            {
              nombreJours = nombreJours - 0.5;
            }
          })
        }
      })
    }
    return nombreJours
  }

  /**
  * Fonction d'affichage des clients et du calendrier global pour le mois
  */
  afficherRows() {
    let dataClient = [];
    let i = 0;
    for(i = 0; i<31; i++)
    {
      let Clients = this.state.Clients
	  	  
      this.state.CalendarClient.forEach(function(Cal,index) { 
		  		  				  
        if(Cal && Cal.includes(i))
        {
          dataClient[i] = (dataClient[i])? dataClient[i] + ", " + Clients[index] : Clients[index];
        }
      })
    }
	
    return this.state.listItemsCRA.map((row, i) => (
      <TouchableOpacity
      key={i}
      onPress={() =>
        this.modifyItemCRA(
          i,
          row.startDate,
          row.actType,
          row.labelAct,
          row.valeur
        )}
        disabled={row.disabled}
        >
          <Row
          style={[
            style.row,
            i % 2 && { backgroundColor: "#FFFFFF" },
            // Colorier samedi (6) et dimanche (0)
            (moment(row.startDate, "DD/MM").day() == 0 ||
            moment(row.startDate, "DD/MM").day() == 6) && {
              backgroundColor: "#b4deea",
            },
            (row.disabled == true) && {
              backgroundColor: "#ffb2b2",
            },
          ]}
          borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
          textStyle={style.rowText}
          data={[
            moment(row.startDate, "DD/MM").format("dddd DD/MM"),
            dataClient[i],
            row.actType,
          ]}
          />
        </TouchableOpacity>
      ));
    
	}

	/**
	* Fonction de retour à la page mère
	*/
    handleValidate = () => {
      //TODO Retourne sur la page des CRA
      this.props.navigation.navigate("ActivitesListe"); //navigate back
    };


    /**
    * Affiche les items du picker pour un ajout de CRA.
    * On affiche le mois en cours et les 2 mois précédents
    * @return {[type]} [description]
    */
    newCraPicker() {
		
      const now = moment();
      let pickerArray = [];

      for (let i = -1; i < 3; i++) {
        let currentDate = now.clone().subtract(i, "months");
				
        pickerArray.push(
          <Picker.Item
          label={currentDate.format("MMMM YYYY")}
          value={currentDate.format("YYYY-MM")}
          key={currentDate.format("YYYY-MM")}		  
          />
        );		
      }
      return pickerArray;
    }
	
	addClientFunction(){		
		this.setState({
			idCraMono: [...this.state.idCraMono, null],
			nombreClients: this.state.nombreClients + 1
		});				
	}

	/**
	* Fonction d'affichage du composant
	*/
    render() {
		
      //Décralation du params transmis à l'écran courante.
      const { params } = this.props.navigation.state;

      let title = this.state.newCra
      ? "Nouveau CRA"
      : moment(
        this.state.yearSelected + "-" + this.state.monthSelected,
        "YYYY-M"
      ).format("MMMM YYYY");

      if (!this.state.isReady) {
        return (
        <View>
          <ContainerTitre title={title}>
            <ActivityIndicator
              color={"#8b008b"}
              size={"large"}
              style={StyleGeneral.loader}
            />
            <Text style={StyleGeneral.texteLoader}>
              Récupération des données. Veuillez patienter...
            </Text>
          </ContainerTitre>
        </View>
        );
      } else {		  
        return (
        <View>
          <ContainerTitre popup={
			  
			  (
				this.state.statusId == 1 ||
				this.state.statusId == null ||
				this.state.statusId == 4
			 )
			  
		  } title={title} navigation={this.props.navigation}>
            <View style={style.container}>
              {this.state.newCra && (
                <View style={style.container1}>
                  <View style={style.containerPicker}>				  
                    <Picker
                      style={{ width: 160 }}
                      selectedValue={this.state.pickerNewCraValue}					  
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({ pickerNewCraValue: itemValue });
                        this.reloadNewCra(itemValue);
                      }}
                    >
                      {this.newCraPicker()}
                    </Picker>
                  </View>
                </View>
              )}
			  
              <View style={style.container1}>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => 
				  Linking.openURL(configurationAppli.lienAideCRA)}
                >
                  <View>
                    <View style={style.containerHelpLine}>
                      <Text style={StyleGeneral.texteLien}>
                        Aide pour remplir son CRA
                      </Text>
                      <Icon
                        style={{ marginLeft: 4 }}
                        name="question-circle-o"
                        size={20}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={style.container1}>
                <View style={style.containerFirstLine}>
					<Text style={style.text}>
						État : {this.state.data.libelle}
					</Text>
                </View>
              </View>

              <View style={style.container1}>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>
                    Jours ouvrés :{" "}
                    {this.state.data.NbJOuvres ? this.state.data.NbJOuvres : "0"} j
                  </Text>
                </View>
              </View>

              <View style={style.container1}>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>
                    Travaillés : {this.getNbJoursTravailles().toFixed(1)} j
                  </Text>
                </View>
                <View style={style.containerThirdLine}>
                  <Text style={style.text}>
                    Absences : {this.getNbJoursAbsence().toFixed(1)} j
                  </Text>
                </View>
              </View>

              <Panel
                title="Information mission *"
                toggle="false"
                containerStyle={{ backgroundColor: "transparent"}}
              >
                <View style={style.containerInformation}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 15,
                    }}
                  >
                    {this.afficherClients()}
                  </View>
                    <View style={{marginLeft:4,marginBottom:10,marginTop:10}}>
                        <Icon size={22} name="plus-circle" onPress={() => this.addClientFunction()}>
							<Text style={{fontSize: 15}}>AJOUTER UN CLIENT</Text> 
						</Icon>
                    </View>
                  </View>
              </Panel>

              <View style={style.containerButtonPeriod}>
                <Button
                  text="ÉDITER UNE PÉRIODE"
                  disabled={
                    this.state.statusId == 2 ||
                    this.state.statusId == 3 ||
                    this.state.statusId == 5
                      ? true
                      : false
                  }
                  buttonStyles={
                    this.state.statusId == 2 ||
                    this.state.statusId == 3 ||
                    this.state.statusId == 5
                      ? style.disabledButton
                      : ""
                  }
                  onPress={() => this.modifyPeriodeCRA()}
                >
                  {" "}
                  Periode
                </Button>
              </View>

              <View style={style.container3}>
                <Table
                  style={style.table}
                  borderStyle={{ borderWidth: 1, borderColor: "#EEEEEE" }}
                >
                  <Row
                    data={this.state.header}
                    style={style.header}
                    textStyle={style.headerText}
                  />
                  {this.afficherRows()}
                </Table>
              </View>


              <Panel
                title="Commentaire"
                containerStyle={{ backgroundColor: "transparent", margin: 0 }}
              >
                <View style={style.containerCommentaire}>
                  <TextInput
                    style={style.textInputComment}
                    multiline={true}
                    editable={true}
                    numberOfLines={8}
                    onChangeText={TextComment => this.setState({ TextComment })}
                    placeholderTextColor="#000000"
                    value={this.state.TextComment}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </Panel>
              <View style={style.containerButton}>
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
      }

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation = StackNavigator({
	AjoutCraMulti: {
		screen: AjoutCraMulti,
		navigationOptions: { header: null },
	},
ActivitesDetail: {
		screen: ActivitesDetail,
		navigationOptions: { header: null },
	},
ClientsDetail: {
		screen: ClientsDetail,
		navigationOptions: { header: null },
	},
});

// EXPORT DE LA NAVIGATION
export default navigation;

