import React, { Component } from 'react'
import { 
  AppRegistry,
  StyleSheet,
  Dimensions, 
  View, 
  TextInput, 
  Button, 
  Image, 
  TouchableHighlight, 
  Text,
Alert,
ScrollView,
Animated,  } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
import StyleGlobal from '../../styles/Styles'

import Menu from '../menu/Menu'

var {height, width} = Dimensions.get('window');

export default class ContainerTitre extends React.Component {

    /**Parametres */
    static propTypes= {
        title: React.PropTypes.string,
    }

	constructor(props){
		super(props);
		this.state={
            
			pan: new Animated.ValueXY({x:-width, y:0}),
			isOpen:false,
			navigationParent: null,
		}
	}
	
    /**Determine s'il faut ouvrir ou fermer le menu */
	afficherCloseMenu(){
        
		if(this.state.isOpen){
			this.closeView();
		}else{
			this.openView();
		}
        this.state.isOpen=!this.state.isOpen;
    
    }
    /**Ferme le menu */
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
    /**Ouvre le menu */
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
    
    /**Affiche l'écran demandé */
	afficherEcranContainer(ecran){
        this.props.afficherEcran(ecran);
   }

	render() {

		return (
        <View>
            <View style={{height:height,}}>
                <View style={StyleGlobal.headerView}>
                    <View style={StyleGlobal.headerRetourView}>

                        <TouchableHighlight onPress={()=>this.afficherCloseMenu()} 
                            style={StyleGlobal.headerBtnRetourStyle}>
                            <Image
                                style={StyleGlobal.headerBtnRetourImage}
                                source={require('../../images/icons/menu.png')}
                            />
                        </TouchableHighlight>
                    </View>
                    <View style={StyleGlobal.headerViewTitle}>
                        
					    <Text style={StyleGlobal.headerTitle}>{this.props.title}</Text>
                    </View>
                </View>
                <ScrollView>
                    {/* On indique qu'on affiche les donnée de l'enfant */}
                    {this.props.children}
                </ScrollView>
            </View>
            
            <Animated.View style={{
            //...this.props.style,
                position:'absolute', 
                width:width,
                height:height,
                transform: this.state.pan.getTranslateTransform(),         // Bind opacity to animated value
            }}
            
            >
                <Menu   afficherEcran={this.afficherEcranContainer.bind(this)}    />
            </Animated.View>

        </View>
		);
	}
}


//Il faut exporteer la na vigation ou bien la classe
//export default ContainerAccueil; 