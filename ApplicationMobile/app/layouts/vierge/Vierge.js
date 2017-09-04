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
import Style from './Styles';
import Vierge2 from '../vierge2/Vierge2';

import ContainerTitre from '../../components/containerTitre/ContainerTitre';


var {height, width} = Dimensions.get('window');

class Vierge extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			title:'Page vierge',
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	render() {

		return (
            <ContainerTitre  afficherEcran={this.afficherEcranParent.bind(this)}  title={this.state.title}>
                <View style={{height: 100, }}>
                    <Text style={{fontSize:40,}}>PAGE VIERGE</Text>

                </View>
				<Button onPress={()=>this.afficherEcranParent("Vierge2")}  title="Page vierge2 "/>
            </ContainerTitre>
        
		);
	}
}

/**Navigation entre les pages */
const navigation=StackNavigator({

	Vierge:{
		screen:Vierge,
		navigationOptions: {
			header: null
		}
	},
	Vierge2:{
		screen:Vierge2,
		navigationOptions:  {
			header: null
		}
	}
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 