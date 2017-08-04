import React from 'react';
import { Image, View, Text } from 'react-native';

import { Table, TableWraper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import style from '../Style.js'

export default class DC extends React.Component {
	
	static navigationOptions = {
		title: 'Demande de Congés',
		tabBarIcon : () => {
			return <Image source={require('./icons/sun.png')} style={{width: 20, height: 20}}/>
		}
	}
	
	render(){
		
		const tableHead = ['Date', 'Nbre Jour', 'Etat', 'Options'];
		const tableData =
		[
			['20/07/2017', '2.0', 'En attente', ''],
			['12/05/2017', '0.5', 'Refusée', ''],
			['05/03/2017', '3.0', 'Acceptée', ''],
			['27/02/2017', '4.0', 'Acceptée', ''],
			['28/01/2017', '1.0', 'Acceptée', ''],
			['02/01/2017', '10.0', 'Acceptée', ''],
			['05/03/2017', '3.0', 'Acceptée', ''],
			['27/02/2017', '4.0', 'Acceptée', ''],
			['28/01/2017', '1.0', 'Acceptée', ''],
			['02/01/2017', '10.0', 'Acceptée', ''],
			['05/03/2017', '3.0', 'Acceptée', ''],
			['27/02/2017', '4.0', 'Acceptée', ''],
			['28/01/2017', '1.0', 'Acceptée', ''],
			['02/01/2017', '10.0', 'Acceptée', ''],
			['05/03/2017', '3.0', 'Acceptée', ''],
			['27/02/2017', '4.0', 'Acceptée', ''],
			['28/01/2017', '1.0', 'Acceptée', ''],
			['02/01/2017', '10.0', 'Acceptée', '']
		];
		
		return(
			
			<View>
				<Text style={style.titreV}> GESTION CONGES </Text>
				<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 75, borderBottomWidth: 1, paddingBottom: 10, marginBottom: 10}}>
					<Text style={{fontSize: 18, fontWeight: 'bold'}}> Demande de congés </Text>
					<Image source={require('./icons/add.png')} style={{width: 20, height: 20}}/>
				</View>
				<View style={{marginHorizontal: 40, marginTop: 20}}>
					<Table>
						<Row data={tableHead} style={{height: 30}} textStyle={{textAlign: 'center', fontWeight: 'bold'}}/>
						<Rows data={tableData} style={{height: 20}} textStyle={{textAlign: 'center'}}/>
					</Table>
				</View>
				<View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 75, borderBottomWidth: 1, paddingBottom: 10, marginBottom: 20}}>
					<Text style={{fontSize: 18, fontWeight: 'bold'}}> Congés restants </Text>
				</View>
				<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 100}}>
					<Text style={{fontSize: 20, fontWeight: 'bold', borderWidth: 2, padding: 20, textAlign: 'center', backgroundColor: '#4B5C84', color: 'white'}}> 24.0 </Text>
					<Text style={{fontSize: 20, fontWeight: 'bold', borderWidth: 2, padding: 20, textAlign: 'center', backgroundColor: '#6C879B', color: 'white'}}> 15.5 </Text>
				</View>
			</View>
		);
	}
}