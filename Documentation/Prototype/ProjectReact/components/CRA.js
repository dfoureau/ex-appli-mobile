import React from 'react';
import { Image, View, Text, Picker } from 'react-native';

import { Calendar, CalendarList } from 'react-native-calendars';

import style from '../Style.js'

const date = new Date()
const moisActuel = date.getMonth()

const tab_mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");

console.log("Date actuelle : " + date);
console.log("Mois actuel : " + tab_mois[moisActuel]);

export default class CRA extends React.Component {
	
	static navigationOptions = {
		title: 'Compte-Rendu Activités',
		tabBarIcon : () => {
			return <Image source={require('./icons/calendar.png')} style={{width: 20, height: 20}}/>
		}
	}
	
	constructor (props) {
		super(props)
		this.state = {
			month: {moisActuel}
		}
	}
	
	render(){
		
		return(
			
			<View>
				<Text style={style.titreB}> CRA </Text>
				<View style={style.styleViewPicker}>
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
					<Image source={require('./icons/add.png')} style={{width: 20, height: 20}}/>
				</View>
				<Calendar
					theme={{
						calendarBackground: '#E9E9EF',
						selectedDayBackgroundColor: '#black',
						selectedDayTextColor: '#ffffff',
						todayTextColor: '#00adf5',
						dayTextColor: 'black',
						textDayFontFamily: 'monospace',
						textMonthFontFamily: 'monospace',
						textDayHeaderFontFamily: 'monospace',
						textDayFontSize: 16,
						textMonthFontSize: 16,
						textDayHeaderFontSize: 16
					}}
					markedDates={{
						'2017-08-05': [{startingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-06': [{endingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-12': [{startingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-13': [{endingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-19': [{startingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-20': [{endingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-26': [{startingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-27': [{endingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-07': [{startingDay: true, color: '#FFAA9F'}],
						'2017-08-08': [{color: '#FFAA9F'}],
						'2017-08-09': [{color: '#FFAA9F'}],
						'2017-08-10': [{color: '#FFAA9F'}],
						'2017-08-11': [{endingDay: true, color: '#FFAA9F'}],
						'2017-08-15': [{startingDay: true, color: 'gray'}, {endingDay: true, color: 'gray', textColor: 'white'}],
						'2017-08-14': [{startingDay: true, color: '#FFAA9F'}, {endingDay: true, color: '#FFAA9F'}],
						'2017-08-16': [{startingDay: true, color: '#FFAA9F'}],
						'2017-08-17': [{color: '#FFAA9F'}],
						'2017-08-18': [{endingDay: true, color: '#FFAA9F'}],
					}}
					markingType={'interactive'}
					style={{paddingBottom:0}}
					// Initially visible month. Default = Date()
					current={'2017-08-02'}
					// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
					minDate={'2017-08-01'}
					// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
					maxDate={'2017-08-31'}
					// Handler which gets executed on day press. Default = undefined
					onDayPress={(day) => {console.log('selected day', day)}}
					// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					monthFormat={'yyyy MMMM'}
					// Handler which gets executed when visible month changes in calendar. Default = undefined
					onMonthChange={(month) => {console.log('month changed', month)}}
					// Hide month navigation arrows. Default = false
					hideArrows={true}
					// Replace default arrows with custom ones (direction can be 'left' or 'right')
					renderArrow={(direction) => (<Arrow />)}
					// Do not show days of other months in month page. Default = false
					hideExtraDays={true}
					// If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
					// day from another month that is visible in calendar page. Default = false
					disableMonthChange={true}
					// If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
					firstDay={1}
				/>
				<View style={{borderWidth: 2, backgroundColor:'#6C879B', marginHorizontal: 50, height:230}}>
					<View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'black', marginHorizontal: 40, marginTop: 10}}>
						<Text style={{fontSize: 20}}> Total mois : </Text>
						<Image source={require('./icons/pencil.png')} style={{width: 30, height: 30}}/>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 40}}>
						<Text style={{fontSize: 15}}> Nombre de jours travaillés : </Text>
						<Text style={{fontSize: 15, fontWeight: 'bold'}}> 13 </Text>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
						<Text style={{fontSize: 15}}> Nombre de jours d'absence : </Text>
						<Text style={{fontSize: 15, fontWeight: 'bold'}}> 9 </Text>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
						<Text style={{fontSize: 15}}> Client : </Text>
						<Text style={{fontSize: 15, fontWeight: 'bold'}}> MAAF </Text>
					</View>
				</View>
				<CalendarList style={{opacity:0}}/>
			</View>
		);
	}
}