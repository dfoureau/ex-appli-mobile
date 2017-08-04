import React from 'react';
import { Dimensions, View, Text, Button, TouchableHighlight, Image } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation'

import style from '../Style.js'

import CRA from './CRA'
import NDF from './NDF'
import DC from './DC'
import INFO from './Informations'
import COG from './Reglages'
import NOTIF from './Notifications'
import Fonctions from './Fonctions'

var {height, width} = Dimensions.get('window')

class Accueil extends React.Component {
	
	logOut() {
		this.props.navigation.dispatch(NavigationActions.back())
	}
	
	launchCRA() {
		this.props.navigation.navigate('CRA')
	}
	
	launchNDF() {
		this.props.navigation.navigate('NDF')
	}
	
	launchDC() {
		this.props.navigation.navigate('DC')
	}
	
	launchINFO() {
		this.props.navigation.navigate('INFO')
	}
	
	launchNOTIF() {
		this.props.navigation.navigate('NOTIF')
	}
	
	launchCOG() {
		this.props.navigation.navigate('COG')
	}
	
  render() {
    return (
		<View style={style.containerMenu}>
			<Image style={style.imageMenu} source={require('./img/logo.png')}/>
			<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
				<Image style={style.logo} source={require('./icons/user.png')}/>
				<Text style={style.menuMail}>{this.props.navigation.state.params.eMail}</Text>
				<TouchableHighlight
					onPress={() => this.logOut()}>
					<Image style={style.logo} source={require('./icons/logout.png')}/>
				</TouchableHighlight>
			</View>
			<TouchableHighlight
				style={[style.menu, {backgroundColor:'#E0D9FE'}]}
				onPress={() => this.launchCRA()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/time.png')}/>
					<Text style={style.titreMenu} >CR Activités</Text>
				</View>
			</TouchableHighlight>
			<TouchableHighlight
				style={[style.menu, {backgroundColor:'#E1E2FE'}]}
				onPress={() => this.launchNDF()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/euro.png')}/>
					<Text style={style.titreMenu} >Notes de frais</Text>
				</View>
			</TouchableHighlight>
			<TouchableHighlight
				style={[style.menu, {backgroundColor:'#E1EBFE'}]}
				onPress={() => this.launchDC()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/sun.png')}/>
					<Text style={style.titreMenu} >Demande de congés</Text>
				</View>
			</TouchableHighlight>
			<TouchableHighlight
				style={[style.menu, {backgroundColor:'#E1F5FF'}]}
				onPress={() => this.launchINFO()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/info.png')}/>
					<Text style={style.titreMenu} >Informations</Text>
				</View>
			</TouchableHighlight><TouchableHighlight
				style={[style.menu, {backgroundColor:'#DADFD9'}]}
				onPress={() => this.launchNOTIF()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/alarm.png')}/>
					<Text style={style.titreMenu} >Notifications</Text>
				</View>
			</TouchableHighlight>
			<TouchableHighlight
				style={[style.menu, {backgroundColor:'#E1EAE1'}]}
				onPress={() => this.launchCOG()}>
				<View style={style.divMenu}>
					<Image style={style.divLogo} source={require('./icons/cog.png')}/>
					<Text style={style.titreMenu} >Réglages</Text>
				</View>
			</TouchableHighlight>
		</View>
    );
  }
}

export default StackNavigator({
	Accueil: {
	screen: Accueil,
		navigationOptions: {
			header: null
		}
	},
	
	CRA: {
		screen: Fonctions,
		navigationOptions: {
			header: null
		}
	},
	
	NDF: {
		screen: Fonctions,
		navigationOptions: {
			header: null
		}
	},
	
	DC: {
		screen: Fonctions,
		navigationOptions: {
			header: null
		}
	},
	
	INFO: {
		screen: INFO,
		navigationOptions: {
			header: null
		}
	},
	
	NOTIF: {
		screen: NOTIF,
		navigationOptions: {
			headerStyle: style.headerVert,
			headerTitleStyle: style.headerTitle
		}
	},
	
	COG: {
		screen: COG,
		navigationOptions: {
			headerStyle: style.headerOrange,
			headerTitleStyle: style.headerTitle
		}
	}
})