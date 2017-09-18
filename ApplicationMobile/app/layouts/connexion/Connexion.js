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
import Accueil from '../accueil/Accueil'

var {height, width} = Dimensions.get('window')

  class Connexion extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			identifiant: '',
			MDP: ''
		}
	}
	
	//Modification des variables
	setMDP(text){
		this.state.MDP=text;
	}
	setIdentifiant(text){
		this.state.identifiant=text;
	}
	mdpOublie(text){
		
	}
	
	seConnecter(){
		//Alert.alert('Se connecter');
			this.props.navigation.navigate('Accueil');
			//Alert.alert('MDP 1')
		if(this.state.MDP=="admin"){
			this.props.navigation.navigate('Accueil');
			//Alert.alert('MDP bon');
		}else{
			//Alert.alert('MDP erreur');
		}
	}


	render() {

		return (
		<ScrollView style={Style.scrollView}>
			<View style={{flex: 1, }}>
				<View style={Style.viewContainer}>
					<Image source={require('../../images/logo.png')}/>
				</View>
				<View style={Style.viewChamps}>
					<View style={{alignItems: 'center',}}>
						<View style={{width:320,}}>
							<View style={Style.inputContainer}>
								<TextInput
									placeholder="Email"
									style={Style.input}
									onChangeText={(text)=>this.setIdentifiant(text)}
								/>
							</View>
							<View style={Style.inputContainer}>
								<TextInput
									placeholder="Mot de passe" 
									secureTextEntry={true}
									style={Style.input}
									onChangeText={(text)=>this.setMDP(text)}
								/>
							</View>
						</View>
						<View style={Style.viewSeConnecter}>
							<Button title="Se connecter" onPress={()=>this.seConnecter()} style={Style.btnSeconnecter}/>
						</View>
						<View style={Style.viewMdpOublie}>
							<TouchableHighlight onPress={()=>this.mdpOublie()} style={Style.touchMdpOublie}>
								<Text style={Style.txtMdpOublie}>Mot de passe oublié</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	Connexion: {
		screen:Connexion,
		navigationOptions: { header: null }
	},
	Accueil: {
		screen:Accueil,
		navigationOptions: { header: null }
	}

});


// EXPORT DE LA NAVIGATION
AppRegistry.registerComponent('CatAmania', () => navigation);