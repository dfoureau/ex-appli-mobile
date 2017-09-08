import React from 'react'
import { 
	AppRegistry,
	StyleSheet,
	Text,
	Button,
	Image,
	View,
	ActivityIndicator,
	Dimensions,
	TouchableHighlight, 
	SectionList,  
	Console,
	TextInput,
	Alert,
	} from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';

import { ContainerHeader } from '../../components/containerHeader';
import { ContainerFilters } from '../../components/containerFilters';
import { SearchFilter } from '../../components/searchFilter';
import { OptionFilter } from '../../components/optionFilter';


// IMPORT DES LAYOUTS NAVIGABLES
import { AnnuaireDetail } from '../annuaireDetail';







class AnnuaireListe extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			title:'Annuaire',
			sectionList: [ {key:'201707', title: 'A', 
			data: [{key:'2', nom:'ABEL', prenom:'Bologne'}, 
				   {key:'3', nom:'AFFELOU', prenom:'Bologne'},
				   {key:'2', nom:'Roger', prenom:'Bologne'}, 
				   {key:'2', nom:'Denise', prenom:'Bologne'}, 
				   {key:'2', nom:'Brigitte', prenom:'Bologne'}]},
		   {key:'201706', title: 'B', 
		   data: [{key:'4', nom:'BIREE', prenom:'Bologne'}, 
				  {key:'5', nom:'BONNEAU', prenom:'Bologne'},]},
		   {key:'201705', title: 'D', 
		   data: [{key:'6', nom:'DAMOIN', prenom:'Bologne'}, 
				  {key:'7', nom:'DUCOIN', prenom:'Bologne'},],
}]

		}
	}
	


	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	//Renvoie l'item
	_renderItemComponent= ({item}) => (
		
	<TouchableHighlight onPress={()=>this.afficherContact(item.key)} >
		<View style={styles.item}>
		  <View style={styles.itemRow}>
			  <Image style={styles.itemPhoto} source={require('../../images/imageProfilDefault.png')} />
			  <Text style={styles.itemText}>{item.nom} {item.prenom}</Text>
		  </View>
		  
		</View>
		</TouchableHighlight>
	  );
  
	   //Renvoie l'en-tete de la section
	   renderSectionHeader = ({section}) => (
		   
			  <View style={styles.sectionHeader}>
					  <Text style={styles.sectionHeaderText}>{section.title}</Text>
			  </View>
		   
	  );
	  
	  //Renvoie le séparateur des items
	  renderItemSeparator=()=>(
		  
		  <View style={styles.separateur}></View>
	  );
	  
	  
	  //Permet d'afficher la page d'un contact
	  afficherContact(cle){
		  this.props.navigation.navigate('AnnuaireDetail',{cle:cle});
	  }
	  
	  //Fonction qui permet de filtrer la liste des noms
	  filtreNom(text){
		  //Il faut modifier la variable sectionList du state afin de mettre à jour la liste 
		  this.setState( {
			  sectionList: [ 
										  {key:'201706', title: 'B', 
										  data: [{key:'4', nom:'BIREE', prenom:'Bologne'}, 
												 {key:'5', nom:'BONNEAU', prenom:'Bologne'},]},
										  {key:'201705', title: 'D', 
										  data: [{key:'6', nom:'DAMOIN', prenom:'Bologne'}, 
												 {key:'7', nom:'DUCOIN', prenom:'Bologne'},],
			  }]
		  })
	  }
  
	render() {
		return (

			<View>

				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}/>
				
				<ContainerFilters>
					<OptionFilter/>
					<SearchFilter/>
				</ContainerFilters>	

				<View style={styles.container}>
					<SectionList style={styles.sectionContain}
						sections={this.state.sectionList} 
						renderItem={this._renderItemComponent}
						renderSectionHeader={this.renderSectionHeader}
						ItemSeparatorComponent={this.renderItemSeparator}
					/>
				</View>

			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	AnnuaireListe: {
		screen: AnnuaireListe,
		navigationOptions: { header: null }
	},
	AnnuaireDetail: {
		screen: AnnuaireDetail,
		navigationOptions: { header: null }
	}
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 