import React from 'react'
import { Dimensions, View, TextInput, Button, Image, TouchableHighlight, Text } from 'react-native'
import { StackNavigator } from 'react-navigation'
import style from '../Style.js'

import Accueil from './Accueil.js'

var {height, width} = Dimensions.get('window')

class Connexion extends React.Component {
	
	constructor (props) {
		super(props)
		this.state = {
			eMail: '@cat-amania.com',
			MDP: ''
		}
	}
		
	setEmail (eMail) {
		this.setState({
			eMail:eMail
		})
	}
	
	setMdp (MDP) {
		this.setState({
			MDP:MDP
		})
	}
	
	connect () {
		if (this.state.MDP === 'admin'){
			this.props.navigation.navigate('Accueil', {eMail: this.state.eMail})
		}

	}
   
	render() {
		return (
			<View style={style.container}>
				<Image source={require('./img/logo.png')} style={style.image}/>
				<TextInput
					onChangeText={(text) => this.setEmail(text)}
					underlineColorAndroid='transparent'
					style={[style.input]}
					placeholder="Identifiants"
					value={this.state.eMail}
				/>
				<TextInput
					onChangeText={(text) => this.setMdp(text)}
					secureTextEntry={true}
					underlineColorAndroid='transparent'
					style={style.input}
					placeholder="Mot de passe"
				/>
				<View style={{marginHorizontal: 60, marginTop: 40}}>
					<Button
					title="Connexion"
					onPress={() => this.connect()}/>
				</View>
				<TouchableHighlight>
					<Text style={style.forgottenMDP}>Mot de passe oublié</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

export default StackNavigator ({
	Connexion: {
		screen: Connexion,
		navigationOptions: {
			header: null
		}
	},
	
	Accueil: {
		screen: Accueil,
		navigationOptions: {
			header: null
		}
	}
})