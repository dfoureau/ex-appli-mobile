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

import ContainerTitre from '../../components/containerTitre/ContainerTitre';


var {height, width} = Dimensions.get('window');

class Apropos extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
            titre:"À propos",
			//On définit les différentes variables
		}
	}

  /*static navigationOptions = {
    //Icones
    tabBarIcon : () => {
      return(<Image source={require('../../images/icons/information.png')} />); //style= {{width: 20, height: 20}}
      }
    }*/
	
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
                    <View style={{width:60, alignItems: 'center'}}>
                        
                            <Image style={{height:40, width:40, marginTop: 20}}
                              source= {require('../../images/icons/information.png')} 
                            
                            
                            />
                    </View>
                </View>
                <View style={{paddingVertical: 20}}>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>2017 &copy; Cat-Amania</Text>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>Version : 1.0.0 </Text>
                  <Text style={{fontSize:16, paddingVertical: 10, paddingHorizontal: 10}}>Rapports de bugs ou demande d'aide : site de support sur Jira</Text>
                </View>
                <ScrollView>


                </ScrollView>

            </View>
        
		);
	}
}

const navigation=StackNavigator({

	Apropos:{
		screen:Apropos,
		navigationOptions:  {
			header: null
		}
    }
    
});

//Il faut exporteer la na vigation ou bien la classe
export default navigation; 