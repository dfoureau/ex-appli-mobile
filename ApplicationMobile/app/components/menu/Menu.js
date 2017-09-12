import React, { Component } from 'react';
<<<<<<< HEAD
import {View, TouchableHighlight, Text, Dimensions, StyleSheet, Image,ScrollView,
Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';

var {height, width} = Dimensions.get('window')
export default class Menu extends Component{
	constructor (props) {
		super(props)
		this.state = {
			//On définit les différentes variables
=======
import { View, Image, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';

import styles from './styles';

var {height, width} = Dimensions.get('window');

class ContainerHeader extends Component {

	constructor(props){
		super(props);
		this.state={
			pan: new Animated.ValueXY({x:-width, y:0}),
			isOpen:false,
>>>>>>> feature/annuaireList
			navigationParent: null,
		}
	}

	afficherEcran(ecran){
		 this.props.afficherEcran(ecran);
	}

	afficherCloseMenu(){
		
		if(this.state.isOpen){
			this.closeView();
		}else{
			this.openView();
		}
        this.state.isOpen=!this.state.isOpen;
    
	}
	closeView(){
		
		Animated.timing(
		  this.state.pan,
		  {
			toValue: {x:-width,y:0},
			//easing: Easing.back,
			duration: 1000,
		  }                              
        ).start();
        
	}
	openView (){
        
		Animated.timing(
		  this.state.pan,
		  {
			toValue: {x:0,y:0},
			//easing: Easing.back,
			duration: 1000,
		  }                              
        ).start();
        
	}
	
	fermerMenu(){
		this.props.fermerMenu();
}
	
<<<<<<< HEAD
	fermerMenu(){
			this.props.fermerMenu();
	}
	
	render(){	
		return (

			<TouchableHighlight onPress={()=>this.fermerMenu()} 
				style={{position:'absolute',flex:1, width:width,backgroundColor:"#BFAA8F00"}}  underlayColor='transparent' >
				<View style={{flex:1, width:300,backgroundColor:"#FFF"}}>
					<View style={{height: 60,backgroundColor:'#2224AA',
										justifyContent: 'center',width:300,flexDirection:'row',}}>
						<View style={{flex:1,}}>
							<Text style={{fontSize:30,color:"#fff",marginLeft:15,}}>Menu</Text>
						</View>
						<View style={{width:60,height:60,}}>
							<TouchableHighlight onPress={()=>this.fermerMenu()} 
								style={style.vue} underlayColor='#BFAA8F00'>
								
									<Image
										style={style.icone}
										source={require('../../images/icons/retour.png')}
									/>
								
							</TouchableHighlight>
						</View>
					</View>
					<ScrollView style={{width:300, backgroundColor:"#fff"/*'#2298AA'*/, 
					height:height-86,
										borderRightColor:"#000",borderRightWidth:2,
										borderTopColor:"#000",borderRightWidth:1}}>
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

						<TouchableHighlight onPress={()=>this.afficherEcran('ListCRA')} 
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

						<TouchableHighlight onPress={()=>this.afficherEcran('Notifications')} 
							style={style.vue} >
							<View style={style.view}>
								<Image
									style={style.icone}
									source={require('../../images/icons/calendar.png')}
								/>
								<Text style={style.libelle} >NOTIFICATIONS</Text>
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

						<TouchableHighlight onPress={()=>this.afficherEcran('Notifications')} 
							style={style.vue} >
							<View style={style.view}>
								<Image
									style={style.icone}
									source={require('../../images/icons/calendar.png')}
								/>
								<Text style={style.libelle} >NOTIFICATIONS</Text>
							</View>
						</TouchableHighlight>
						
						<View style={style.separateur}></View>
					</ScrollView>
				</View>

			</TouchableHighlight>
		)
	};
=======
	render(){
		return (

			<View>
	
				<View style={styles.ContainerMenu}>

					<TouchableOpacity style={styles.CloseMenuButton} onPress={()=>this.fermerMenu()}>
						<Image style={styles.CloseIcon}
							source={require('../../images/icons/CloseIcon.png')}
						/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('Accueil')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/calendar.png')}
							/>
							<Text style={styles.TextItemMenu}>Tableau de Bord</Text>   
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('ActivitesListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/ActiviteIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Relevés d'Activité</Text>   
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('FraisListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/FoodIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Notes de Frais</Text>   
						</View>
					</TouchableOpacity>	
					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('CongesListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/CongesIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Congés</Text>   
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('AnnuaireListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/AnnuaireIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Annuaire</Text>   
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={styles.ItemMenu} onPress={()=>this.afficherEcran('Notifications')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/calendar.png')}
							/>
							<Text style={styles.TextItemMenu}>Notifications</Text>   
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.ItemMenu, styles.LastItemMenuLeft]} onPress={()=>this.afficherEcran('APropos')}>						
							<Text>A Propos</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.ItemMenu, styles.LastItemMenuRight]} onPress={()=>this.afficherEcran('Reglages')}>							
						<Image style={styles.LastItemMenuIcon}
								source={require('../../images/icons/CogIcon.png')}
							/>   
					</TouchableOpacity>
				</View>
	
				<View style={styles.ContainerOpaque}>
				<TouchableOpacity style={styles.buttonOpaque} onPress={()=>this.fermerMenu()}>
				
				</TouchableOpacity>
				</View>
	
			</View>
	
		);
	}
>>>>>>> feature/annuaireList
}
	
export default ContainerHeader;