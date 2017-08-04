import React from 'react';
import { View, StatusBar, Text } from 'react-native';

import Connexion from './components/Connexion'
import Accueil from './components/Accueil'
import Fonctions from './components/Fonctions'
import Informations from './components/Informations'


export default class App extends React.Component {
  
  render() {
    return (
	<View style={{flex:1}}>
		<StatusBar hidden={true}/>
		<Connexion/>
	</View>
    );
  }
}