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
ScrollView  } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation';
//import Style from './Styles';
import StyleGlobal from '../../styles/Styles';
import Vierge3 from '../vierge3/Vierge3';

import ContainerTitre from '../../components/containerTitre/ContainerTitre';


var {height, width} = Dimensions.get('window');

class Vierge2 extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
            titre:"Page vierge 2",
			//On définit les différentes variables
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
            <View  afficherEcran={this.afficherEcranParent.bind(this)}  >

                <View style={StyleGlobal.headerView}>
                    <View style={StyleGlobal.headerRetourView}>

                        <TouchableHighlight onPress={()=>this.retour()} 
                            style={StyleGlobal.headerBtnRetourStyle} >
                            <Image
                                style={StyleGlobal.headerBtnRetourImage}
                                source={require('../../images/icons/retour.png')}
                            />
                        </TouchableHighlight>
                    </View>
                    <View style={StyleGlobal.headerViewTitle}>
                        
                        <Text style={StyleGlobal.headerTitle}>{this.state.titre}</Text>
                    </View>
                </View>
                <ScrollView>


                </ScrollView>

            </View>
        
		);
	}
}

const navigation=StackNavigator({

	Vierge2:{
		screen:Vierge2,
		navigationOptions:  {
			header: null
		}
    },
    
	Vierge3:{
		screen:Vierge3,
		navigationOptions: {
			Title:'Vierge 3',
		}
	}
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 

//export default Vierge2;
