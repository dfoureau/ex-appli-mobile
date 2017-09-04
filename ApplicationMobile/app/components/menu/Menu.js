
import React, { Component } from 'react';
import {View, TouchableHighlight, Text, Dimensions, StyleSheet, Image,ScrollView,
Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
/*
import Accueil from './Accueil';

import CRA from './CRA';
*/
var {height, width} = Dimensions.get('window')
export default class Menu extends Component{
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
			navigationParent: null,
		}
	}

	afficherEcran(ecran){
		 this.props.afficherEcran(ecran);
	}
	
	render(){	
		return (
		<View style={{position:'absolute', width:width,height:height,backgroundColor:"#BFAA8F69"}} >
			<ScrollView style={{width:300, backgroundColor:"#fff"/*'#2298AA'*/, 
								height:height,
								borderRightColor:"#000",borderRightWidth:2,
								borderTopColor:"#000",borderRightWidth:1}}>
				<View style={{height: 60,backgroundColor:'#2224AA',
                                    justifyContent: 'center',}}>
					<Text style={{fontSize:30,color:"#fff",marginLeft:15,}}>Menu</Text>
				</View>
				<TouchableHighlight onPress={()=>this.afficherEcran('Accueil')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >ACCUEIL</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
					
				<TouchableHighlight onPress={()=>this.afficherEcran('Vierge')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >VIERGE</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>

				<TouchableHighlight onPress={()=>this.afficherEcran('CRA')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >CRA</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
					
				<TouchableHighlight onPress={()=>this.afficherEcran('Conges')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >CONGES</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
				
				<TouchableHighlight onPress={()=>this.afficherEcran('NoteDeFrais')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >NOTE DE FRAIS</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
					
				<TouchableHighlight onPress={()=>this.afficherEcran('Annuaire')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >ANNUAIRE</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
					
					
				<TouchableHighlight onPress={()=>this.afficherEcran('Reglages')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >REGLAGES</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>

					
				<TouchableHighlight onPress={()=>this.afficherEcran('Deconnexion')} 
					style={style.vue} >
					<View style={style.view}>
						<Image
							style={style.icone}
							source={require('../../images/icons/calendar.png')}
						/>
						<Text style={style.libelle} >DECONNEXION</Text>
					</View>
				</TouchableHighlight>
				
				<View style={style.separateur}></View>
			</ScrollView>
		</View>
		)
	};
}

const style=StyleSheet.create({
	vue:{height:60, 
		justifyContent: 'center',
	},
	view:{flex:1,
		  flexDirection:'row',
		  marginLeft:15,
		  alignItems:'center',
	},
	libelle:{
		fontSize: 20,
		marginLeft: 10,
	},
	icone:{
		height:30, 
		width:30,
	},
	separateur:{
		width:width, height:1, backgroundColor:'#000',
	},
});



//export default navigation;
