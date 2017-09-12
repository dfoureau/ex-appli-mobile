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
import styles from './styles';

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
	
    //Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
    
    /**Retour vers la page précédente */
    retour(){
        const backAction = NavigationActions.back()
          this.props.navigation.dispatch(backAction);
    }

	render() {

		return (
        <View>
            <View style={styles.ContainerHeader}>
            <TouchableHighlight style={styles.MenuIconLink} onPress={()=>this.retour()}>
                <Image style={styles.MenuIcon}
                    source={require('../../images/icons/retour.png')}
                />
            </TouchableHighlight>
            <Text style={styles.TextHeader}>{this.props.title}</Text>
        </View>
            
            <Animated.View style={{
            //...this.props.style,
                position:'absolute', 
                width:width,
                height:height,
                transform: this.state.pan.getTranslateTransform(),         // Bind opacity to animated value
            }}
            
            >
<<<<<<< HEAD
                <Menu   afficherEcran={this.afficherEcranContainer.bind(this)}  fermerMenu={this.afficherCloseMenu.bind(this)}    />
=======
                <Menu   afficherEcran={this.afficherEcranContainer.bind(this)} fermerMenu={this.afficherCloseMenu.bind(this)} />
>>>>>>> feature/annuaireList
            </Animated.View>

        </View>
		);
	}
}


//Il faut exporteer la na vigation ou bien la classe
//export default ContainerAccueil; 