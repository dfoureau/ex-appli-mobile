import React from 'react';
import { View, Text, Picker, Image } from 'react-native';

import style from '../Style.js'

const date = new Date()
const moisActuel = date.getMonth()

const tab_mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");

export default class InformationsAnnee extends React.Component {
	
	constructor (props) {
		super(props)
		this.state = {
			month: {moisActuel}
		}
	}
	
	render(){
		
		return(
			
			<View>
				<Text style={style.titreB}> Informations sur l'année </Text>
				<View style={[style.styleViewPicker, {marginTop: 20, borderTopWidth: 2}]}>
					<Image source={require('./icons/calendar.png')} style={{width: 25, height: 25}}/>
					<Picker
						style={style.selectMonth}
						selectedValue={this.state.month}
						onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}>
						<Picker.Item label={tab_mois[0]} value="0" />
						<Picker.Item label={tab_mois[1]} value="1" />
						<Picker.Item label={tab_mois[2]} value="2" />
						<Picker.Item label={tab_mois[3]} value="3" />
						<Picker.Item label={tab_mois[4]} value="4" />
						<Picker.Item label={tab_mois[5]} value="5" />
						<Picker.Item label={tab_mois[6]} value="6" />
						<Picker.Item label={tab_mois[7]} value="7" />
						<Picker.Item label={tab_mois[8]} value="8" />
						<Picker.Item label={tab_mois[9]} value="9" />
						<Picker.Item label={tab_mois[10]} value="10" />
						<Picker.Item label={tab_mois[11]} value="11" />
					</Picker>
				</View>
				<Text style={{textAlign: 'center', marginTop: 50, borderBottomWidth: 1, borderColor: 'gray', paddingBottom: 10, marginHorizontal: 75}}> {"Congés pris depuis le début de l'année"} </Text>
				<View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 50}}>
					<View style={{flexDirection: 'column'}}>
						<Text style={{borderWidth: 2, paddingHorizontal: 30, paddingVertical: 35, backgroundColor: '#4B5C84', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}> 8.0 </Text>
						<Text style={{marginTop: 20, fontWeight: 'bold', textAlign: 'center'}}> RTT </Text>
					</View>
					<View style={{flexDirection: 'column'}}>
						<Text style={{borderWidth: 2, paddingHorizontal: 30, paddingVertical: 35, backgroundColor: '#6C879B', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}> 5.0 </Text>
						<Text style={{marginTop: 20, fontWeight: 'bold', textAlign: 'center'}}> Congés payés </Text>
					</View>
				</View>
				<Text style={{textAlign: 'center', marginTop: 50, borderBottomWidth: 1, borderColor: 'gray', paddingBottom: 10, marginHorizontal: 75}}> {"Congés restants à prendre"} </Text>
				<View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 50}}>
					<View style={{flexDirection: 'column'}}>
						<Text style={{borderWidth: 2, paddingHorizontal: 30, paddingVertical: 35, backgroundColor: '#4B5C84', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}> 24.0 </Text>
						<Text style={{marginTop: 20, fontWeight: 'bold', textAlign: 'center'}}> RTT </Text>
					</View>
					<View style={{flexDirection: 'column'}}>
						<Text style={{borderWidth: 2, paddingHorizontal: 30, paddingVertical: 35, backgroundColor: '#6C879B', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}> 1.5 </Text>
						<Text style={{marginTop: 20, fontWeight: 'bold', textAlign: 'center'}}> Congés payés </Text>
					</View>
				</View>
			</View>
		);
	}
}