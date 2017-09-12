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
//import Style from './Styles';

import ContainerTitre from '../../components/containerTitre/ContainerTitre';


var {height, width} = Dimensions.get('window');

class Vierge3 extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
                        //Titre avec variable dynamique entrée dans le Header
                        title : `v3 `,
                        //fonction pour paramétrer une icône
        }
    }

	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
    }
    
    retourVierge(){
        const backAction = NavigationActions.back({
            key: 'Vierge'
          })
          this.props.navigation.dispatch(backAction);
    }

	render() {

		return (
            <ContainerTitre  afficherEcran={this.afficherEcranParent.bind(this)}  >
                <View style={{height: 100, }}>
                    <Text style={{fontSize:40,}}>PAGE VIERGE</Text>

                </View>
            </ContainerTitre>
        
		);
	}
}

const navigation=StackNavigator({

	Vierge3:{
		screen:Vierge3,
		navigationOptions: {
			Title:'Vierge 3',
		}
	}
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 

//export default Vierge3;
