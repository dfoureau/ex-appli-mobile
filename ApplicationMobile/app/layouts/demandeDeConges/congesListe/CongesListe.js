import React from 'react';
import { View } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import Accueil from '../../accueil/Accueil'


class CongesListe extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Congés' }
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
	
	render() {
		return (

			<View>

				<ContainerAccueil title='Congés' afficherEcran={this.afficherEcranParent.bind(this)}/>

			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	CongesListe: {
		screen: CongesListe,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 