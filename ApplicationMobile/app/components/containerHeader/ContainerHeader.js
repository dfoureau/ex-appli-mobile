import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight, Dimensions, Animated } from 'react-native';

import Menu from '../menu/Menu'

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

    render(){
        return (
<View>
                <View style={styles.ContainerHeader}>
                    <TouchableHighlight style={styles.MenuIconLink} onPress={()=>this.afficherCloseMenu()}>
                        <Image style={styles.MenuIcon}
                            source={require('../../images/icons/MenuIcon.png')}
                            onPress={()=>this.afficherCloseMenu()}
                        />
                    </TouchableHighlight>
                    <Text style={styles.TextHeader}>Annuaire</Text>
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

export default ContainerHeader;