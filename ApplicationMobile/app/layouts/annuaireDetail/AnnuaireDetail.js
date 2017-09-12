import React, { Component } from 'react'
import { 
  AppRegistry,
  StyleSheet,
  Dimensions, 
  View, 
  TextInput, 
  Button, 
  Image, 
  TouchableHighlight, 
  Text,
Alert,
ScrollView  } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
import StyleGlobal from '../../styles/Styles';

import ContainerAccueil from '../../components/containerAccueil/ContainerAccueil';
import { ContainerHeader } from '../../components/containerHeader';


var {height, width} = Dimensions.get('window');

class AnnuaireDetail extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
            titre:"Annuaire Detail",
			//On définit les différentes variables
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
    
    /**Retour vers la page précédente */
    retour(){
        const backAction = NavigationActions.back()
          this.props.navigation.dispatch(backAction);
    }
    

	render() {

		return (
            
            <View>
                <ContainerAccueil title={this.state.titre} afficherEcran={this.afficherEcranParent.bind(this)}>
                <ScrollView>


                </ScrollView>
                </ContainerAccueil>

            </View>
        
		);
	}
}



// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	AnnuaireDetail: {
		screen: AnnuaireDetail,
		navigationOptions: { header: null }
    },
    
});

// EXPORT DE LA NAVIGATION
export default navigation; 