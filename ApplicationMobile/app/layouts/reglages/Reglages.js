import React from 'react';
import { View, Text, Switch, TouchableHighlight } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';
import Accueil from '../accueil/Accueil'


class Reglages extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Réglages' }
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
	
	render() {
		return (

			<View>

				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}/>

				<View style={{height: 100, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text style={{fontSize:20, marginBottom: 20,paddingVertical: 10, paddingHorizontal: 10}}>Recevoir les notifications ?</Text>
					<Switch
					style={{marginBottom: 20,paddingVertical: 10, paddingHorizontal: 20}}
					onValueChange={(value) => this.setState ({switchValue: value})}
					value={this.state.switchValue} />
                </View>

			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	Reglages: {
		screen: Reglages,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 