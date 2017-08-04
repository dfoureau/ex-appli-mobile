import React from 'react';
import { Image, View, Text, Picker } from 'react-native';

import { Table, TableWraper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import style from '../Style.js'

export default class NDF extends React.Component {
	
	static navigationOptions = {
		title: 'Notes de Frais',
		tabBarIcon : () => {
			return <Image source={require('./icons/euro.png')} style={{width: 20, height: 20}}/>
		}
	}
	
	constructor (props) {
		super(props)
		this.state = {
			month: '0'
		}
	}
	
	render(){
		
		const tableHead = ['#00', 'DATE', 'TITRE', '€', 'Options'];
		const tableData =
		[
			['#01', '20/07/2017', 'Essence', '254 €', ''],
			['#02', '12/05/2017', 'Resto', '254 €', ''],
			['#03', '05/03/2017', 'Avance', '254 €', ''],
			['#04', '27/02/2017', 'Essence', '254 €', ''],
			['#05', '28/01/2017', 'Resto', '254 €', ''],
			['#06', '02/01/2017', 'Essence', '254 €', ''],
			['#07', '28/01/2017', 'Resto', '254 €', ''],
			['#08', '02/01/2017', 'Essence', '254 €', ''],
			['#09', '28/01/2017', 'Resto', '254 €', ''],
			['#10', '02/01/2017', 'Essence', '254 €', ''],
			['#11', '28/01/2017', 'Resto', '254 €', ''],
			['#12', '02/01/2017', 'Essence', '254 €', ''],
			['#13', '02/01/2017', 'Essence', '254 €', ''],
			['#14', '28/01/2017', 'Resto', '254 €', ''],
			['#15', '02/01/2017', 'Essence', '254 €', ''],
			['#16', '28/01/2017', 'Resto', '254 €', ''],
			['#17', '02/01/2017', 'Essence', '254 €', ''],
			['#18', '02/01/2017', 'Essence', '254 €', ''],
			['#19', '28/01/2017', 'Resto', '254 €', '']
		];
		return(
			
			<View>
				<Text style={style.titreO}> NOTES DE FRAIS </Text>
				<View style={style.styleViewPicker}>
					<Image source={require('./icons/calendar.png')} style={{width: 25, height: 25}}/>
					<Picker
						style={style.selectMonth}
						selectedValue={this.state.month}
						onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}>
						<Picker.Item label="Janvier" value="0" />
						<Picker.Item label="Fevrier" value="1" />
						<Picker.Item label="Mars" value="2" />
						<Picker.Item label="Avril" value="3" />
						<Picker.Item label="Mai" value="4" />
					</Picker>
					<Image source={require('./icons/add.png')} style={{width: 20, height: 20}}/>
				</View>
				<View style={{marginHorizontal: 40, marginTop: 20}}>
					<Table>
						<Row data={tableHead} style={{height: 30}} textStyle={{textAlign: 'center', fontWeight: 'bold'}}/>
						<Rows data={tableData} style={{height: 20}} textStyle={{textAlign: 'center'}}/>
					</Table>
				</View>
				<View style={{marginTop: 50, borderWidth: 2, borderColor: 'black', backgroundColor: '#6C879B', padding: 20, marginHorizontal: 125}}>
					<Text style={{fontSize: 20, borderBottomWidth: 1, paddingBottom: 10, marginBottom: 20, fontWeight: 'bold', textAlign: 'center'}}> Janvier 2017 </Text>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Text style={{fontWeight: 'bold'}}> Total : </Text>
						<Text> 1024 € </Text>
					</View>
				</View>
			</View>
		);
	}
}