import React from 'react';
import { Image, View, Text } from 'react-native';

import { TabNavigator } from 'react-navigation';

import CRA from './CRA'
import NDF from './NDF'
import DC from './DC'

const Tabs = TabNavigator({
	CRA: { screen: CRA },
	NDF: { screen: NDF },
	DC: { screen: DC }
}, {
	tabBarPosition: 'bottom',
	tabBarOptions: {
		showIcon: true,
		showLabel: false,
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

export default class Fonctions extends React.Component {
	
	render(){
		
		return(
			
			<View style={{flex: 1}}>
				<Tabs/>
			</View>
		);
	}
}