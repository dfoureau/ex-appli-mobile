import React from 'react';
import { Image, View, Text } from 'react-native';

import { TabNavigator } from 'react-navigation';

import InformationsAnnee from './InformationsAnnee'
import InformationsMois from './InformationsMois'

const Tabs = TabNavigator({
	Mois: { screen: InformationsMois },
	Année: { screen: InformationsAnnee }
}, {
	tabBarPosition: 'bottom',
	tabBarOptions: {
		showIcon: false,
		showLabel: true,
		indicatorStyle: {
			height: 2,
			backgroundColor: '#FFF'
		},
		style: {
			backgroundColor: '#00B8D8',
			borderTopWidth: 1,
			borderColor: '#3F101C'
		}
	}

})

export default class Informations extends React.Component {
	
	static navigationOptions = {
		title: 'Informations',
	}
	
	render(){
		
		return(
			
			<View style={{flex: 1}}>
				<Tabs/>
			</View>
		);
	}
}