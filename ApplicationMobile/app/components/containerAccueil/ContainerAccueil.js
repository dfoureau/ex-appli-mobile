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
//import style from './Style.js'

import Menu from '../menu/Menu'

var {height, width} = Dimensions.get('window');

export default class ContainerAccueil extends React.Component {

	constructor(props){
		super(props);
		this.state={
            
			pan: new Animated.ValueXY({x:-width, y:0}),
			isOpen:false,
			navigationParent: null,
		}
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
    

	afficherEcranContainer(ecran){
        this.props.afficherEcran(ecran);
   }

	render() {

		return (
        <View>
            <View style={{height:height,}}>
                <View style={{flexDirection:'row',backgroundColor:'#2224AA',}}>
                    <View style={{width:70,}}>

                        <TouchableHighlight onPress={()=>this.afficherCloseMenu()} 
                            style={{height:50, width:50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop:20,}} >
                            <Image
                                style={{height:30, width:30}}
                                source={require('../../images/icons/menu.png')}
                            />
                        </TouchableHighlight>
                    </View>
                    <View style={{flex:1,paddingTop:20, height:170,}}>
                        <View>
                            <Image source={require('../../images/logo.png')}/>
                        </View>
                        <View style={{paddingTop:20}}>
                            <Text style={{fontSize:22, color:'#fff'}}>Bonjour Rhony LANDRY</Text>
                        </View>
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
                <Menu   afficherEcran={this.afficherEcranContainer.bind(this)}  fermerMenu={this.afficherCloseMenu.bind(this)}  />
            </Animated.View>

        </View>
		);
	}
}


//Il faut exporteer la na vigation ou bien la classe
//export default ContainerAccueil; 