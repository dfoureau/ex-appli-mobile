import React from 'react';
import { View } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../components/containerFilters';
import { SearchFilter } from '../../components/searchFilter';
import { OptionFilter } from '../../components/optionFilter';
import Accueil from '../accueil/Accueil'


class FraisListe extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Notes de Frais' }
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	render() {
		return (

			<View>

				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}/>
				
				<ContainerFilters>

				</ContainerFilters>	

			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	FraisListe: {
		screen: FraisListe,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 