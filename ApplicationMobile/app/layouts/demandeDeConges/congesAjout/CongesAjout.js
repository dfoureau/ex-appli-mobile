import React from 'react'
import { View, Text, TextInput, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import style from './styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil'

class CongesAjout extends React.Component {
    constructor (props) {
		super(props)
		this.state = { title:'Demande de congés', status:'nouveau', statusLabel:'Nouvelle DC' }
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
    }
    
    addNewPeriod(){
		
    }
    
    deleteConge(){

    }
        
    saveDraft(){

    }

    validateConge(){
        
    }

    //Renvoie l'en-tête du tableau
    renderHeader = () => (
           <View style={style.containerRow}>
                <View style={style.containerHeader}><Text style={style.text}>Date du</Text></View>
                <View style={style.containerHeader}><Text style={style.text}>Date au</Text></View>
                <View style={style.containerHeader}><Text style={style.text}>Type d'abs</Text></View>
                <View style={style.containerHeader}><Text style={style.text}>Nb. jours</Text></View>
           </View>
        
   );

   //Renvoie un élément du tableau
   renderItem = ({item}) => (
       <View style={style.containerRows}>
            <View style={style.containerRow}>
                <Text style={style.text}>{item.startDate}</Text>
                <Text style={style.text}>{item.endDate}</Text>
                <Text style={style.text}>{item.absType}</Text>
                <Text style={style.text}>{item.dayNumber}</Text>
           </View>
           </View>
   );

    render() {
        const data = [
            {
                key: 0,
				startDate: '30/10/2017',
                endDate: '31/10/2017',
                absType : 'CP',
				dayNumber: 2
            }, {
				key: 1,
				startDate: '02/11/2017',
				endDate: '03/11/2017',
				absType : 'RTT',
				dayNumber: 2
            }, {
				key: 2,
				startDate: '02/12/2017',
				endDate: '02/12/2017',
				absType : 'CP',
				dayNumber: 1
            }, {
				key: 3,
				startDate: '02/12/2017',
				endDate: '02/12/2017',
				absType : 'CP',
				dayNumber: 1
            }
        ];

        return (
            <ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
                <View style={style.container}>
                    <View style={style.container1}>
                        <View style={style.containerStatus}>
                            <Text style={style.text}>Etat : {this.state.status}</Text>
                        </View>
                        <View style={style.containerStatusLabel}>
                            <Text style={style.statusLabel}>{this.state.statusLabel}</Text>
                        </View>
                    </View>
                    <View style={style.container2}>
                            <View style={style.containerInfoElement}>
								<Text style={style.text}>Au :</Text>
								<TextInput 
									style={style.textInputYear}
									value={'09/2017'}
									editable={false}
									underlineColorAndroid='transparent'/>
							</View>
							<View style={style.containerInfoElement}>
								<Text style={style.text}>RTT :</Text>
								<TextInput 
									style={style.textInputCounter}
									value='11.0'
									editable={false}
									underlineColorAndroid='transparent'/>
							</View>
							<View style={style.containerInfoElement}>
								<Text style={style.text}>CP :</Text>
								<TextInput 
									style={style.textInputCounter}
									value={'25.0'}
									editable={false}
									underlineColorAndroid='transparent'/>
							</View> 
                    </View>
                    <View style={style.container3}>
                        <FlatList 
							data={data}
                            horizontal={false}
                            numColumns={4}
                            columnWrapperStyle={{ alignItems: 'center'}}
							renderItem={this.renderItem} />
                        <Button 
                            text="AJOUTER NOUVELLE PERIODE"
                            onPress={() => this.addNewPeriod()}/>
                    </View>
                    <View style={style.container4}>
                        <Button 
                            text="SUPPRIMER"
                            onPress={() => this.deleteConge()}
                        />
                        <Button 
                            text="BROUILLON"
                            onPress={() => this.saveDraft()}
                        />
                        <Button 
                            text="VALIDER"
                            onPress={() => this.validateConge()}
                        />
                    </View>
                </View>
            </ContainerAccueil>
    );
    }
}

// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({
    
        CongesAjout: {
            screen: CongesAjout,
            navigationOptions: { header: null }
        },
        
    });
    
    
    // EXPORT DE LA NAVIGATION
    export default navigation; 