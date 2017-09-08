import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';
import Accueil from '../accueil/Accueil'


class APropos extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'A Propos' }
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
	
	render() {
		return (

			<View>

				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}/>

                <View style={{paddingVertical: 20}}>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>2017 &copy; Cat-Amania</Text>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>Version : 1.0.0 </Text>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>Rapports de bugs ou demande d'aide : site de support sur Jira</Text>
                </View>

			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	APropos: {
		screen: APropos,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 