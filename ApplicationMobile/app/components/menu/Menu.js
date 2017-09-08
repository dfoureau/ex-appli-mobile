import React, { Component } from 'react';
import { View, TouchableHighlight, Image, Text, Animated, Dimensions } from 'react-native';

import styles from './styles';

var {height, width} = Dimensions.get('window');

class ContainerHeader extends Component {

	constructor(props){
		super(props);
		this.state={
            
			pan: new Animated.ValueXY({x:-width, y:0}),
			isOpen:false,
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
	
	render(){
		return (

			<View>
	
				<View style={styles.ContainerMenu}>

					<TouchableHighlight style={styles.CloseMenuButton} onPress={()=>this.afficherCloseMenu()}>
						<Image style={styles.CloseIcon}
							source={require('../../images/icons/CloseIcon.png')}
						/>
					</TouchableHighlight>

					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('Accueil')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/calendar.png')}
							/>
							<Text style={styles.TextItemMenu}>Tableau de Bord</Text>   
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('ActivitesListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/ActiviteIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Relevés d'Activité</Text>   
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('FraisListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/FoodIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Notes de Frais</Text>   
						</View>
					</TouchableHighlight>	
					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('CongesListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/CongesIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Congés</Text>   
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('AnnuaireListe')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/AnnuaireIcon.png')}
							/>
							<Text style={styles.TextItemMenu}>Annuaire</Text>   
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.ItemMenu} onPress={()=>this.afficherEcran('Notifications')}>						
						<View>
							<Image style={styles.IconItemMenu}
								source={require('../../images/icons/calendar.png')}
							/>
							<Text style={styles.TextItemMenu}>Notifications</Text>   
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={[styles.ItemMenu, styles.LastItemMenu]} onPress={()=>this.afficherEcran('Reglages')}>						
						<View>
							<Text>A Propos</Text>
							<Image style={styles.LastItemMenuIcon}
								source={require('../../images/icons/CogIcon.png')}
							/>   
						</View>
					</TouchableHighlight>

				</View>
	
				<View style={styles.ContainerOpaque}></View>
	
			</View>
	
		);
	}
}
	
export default ContainerHeader;