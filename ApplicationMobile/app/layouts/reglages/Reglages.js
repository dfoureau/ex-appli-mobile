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
  Switch,
  ScrollView  } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
//import Style from './Styles';
import Apropos from '../apropos/Apropos';

import ContainerTitre from '../../components/containerTitre/ContainerTitre';


var {height, width} = Dimensions.get('window');

class Reglages extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			title:'Réglages',
			switchValue: false,
		}
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	render() {

		return (
            <ContainerTitre  afficherEcran={this.afficherEcranParent.bind(this)}  title={this.state.title}>
                <View style={{height: 100, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text style={{fontSize:20, marginBottom: 20,paddingVertical: 10, paddingHorizontal: 10}}>Recevoir les notifications ?</Text>
					<Switch
					style={{marginBottom: 20,paddingVertical: 10, paddingHorizontal: 40}}
					onValueChange={(value) => this.setState ({switchValue: value})}
					value={this.state.switchValue} />
                </View>
                <View>
                	<TouchableHighlight onPress={() =>this.afficherEcranParent("Apropos")}>
                		<Text style={{fontSize:20, marginBottom: 20,paddingVertical: 10, paddingHorizontal: 10}}>A propos de l'application</Text>
                	</TouchableHighlight>
                </View>

            </ContainerTitre>
        
		);
	}
}

/**Navigation entre les pages */
const navigation=StackNavigator({

	Reglages:{
		screen:Reglages,
		navigationOptions: {
			header: null
		}
	},
	Apropos:{
		screen:Apropos,
		navigationOptions:  {
			header: null
		}
	}
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 