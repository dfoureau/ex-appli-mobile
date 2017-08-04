import React from 'react';
import { Image, View, Text } from 'react-native';

export default class NOTIF extends React.Component {
	
	static navigationOptions = {
		title: 'Notifications',
	}
	
	render(){
		
		return(
			
			<View>
				<Text> Section Notifications </Text>
				<Text>Lorem ipsum..</Text>
			</View>
		);
	}
}