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
import Style from '../../../styles/Styles';
import styles from './styles';

import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { ContainerHeader } from '../../../components/containerHeader';


var {height, width} = Dimensions.get('window');

class AnnuaireDetail extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
            titre:"Alain AFFLELOU",
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
            
            <View>
                <ContainerTitre title={this.state.titre} navigation={this.props.navigation}>
                <ScrollView style={styles.scrollView}>

                    {/*DESCRIPTION PROFILE*/}
                    <View style={Style.firstView}>
                        <View style={Style.secondView}>
                            <View style={styles.container}>
                                <View style={styles.containerRow}>
                                    <Text style={styles.text}>Entité: CAT-AMANIA</Text>
                                    <Text style={styles.text}>Fonction: Directeur d'agence</Text>
                                    <Text style={styles.text}>Agence: Nantes</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerIcon}>
                            <Image style={styles.iconProfile} source={require('../../../images/imageProfilDefault.png')}/>
                        </View>
                    </View>
                        
                    {/*TELEPHONE 1*/}
                    <View style={[Style.firstView, styles.firstSection]}>
                        <View style={Style.secondView}>
                            <View style={styles.container}>
                                <View style={styles.containerRow}>
                                    <Text style={styles.text}>06.06.06.06.06</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/tel.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/bulles.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                    {/*TELEPHONE 2*/}
                    <View style={[Style.firstView, styles.secondSection]}>
                        <View style={Style.secondView}>
                            <View style={styles.container}>
                                <View style={styles.containerRow}>
                                    <Text style={styles.text}>06.06.06.06.06</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/tel.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/bulles.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                    {/*EMAIL 1 */}
                    <View style={[Style.firstView, styles.firstSection]}>
                        <View style={Style.secondView}>
                            <View style={styles.container}>
                                <View style={styles.containerRow}>
                                    <Text style={styles.text}>a.afflelou@email.cat.com</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/email.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                    {/*EMAIL 2*/}
                    <View style={[Style.firstView, styles.secondSection]}>
                        <View style={Style.secondView}>
                            <View style={styles.container}>
                                <View style={styles.containerRow}>
                                    <Text style={styles.text}>a.afflelou@email.cat.client.com</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerIcon}>
                            <TouchableHighlight onPress={null}>
                                <View>
                                    <Image style={styles.icon} source={require('../../../images/icons/email.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                </ScrollView>
                </ContainerTitre>

            </View>
        
		);
	}
}



// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	AnnuaireDetail: {
		screen: AnnuaireDetail,
		navigationOptions: { header: null }
    },
    
});

// EXPORT DE LA NAVIGATION
export default navigation; 