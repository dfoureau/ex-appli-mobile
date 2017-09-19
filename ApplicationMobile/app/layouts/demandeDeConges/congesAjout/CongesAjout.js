import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import style from './styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil'
import CongesPeriode from '../congesPeriode/CongesPeriode';

class CongesAjout extends React.Component {
    constructor (props) {
		super(props)
        this.state = { 
            title:'Demande de congés', 
            status:'nouveau', 
            statusLabel:'Nouvelle DC',
            header: ['Date du', 'Date au', 'Type d\'abs', 'Nb. jours'],
            listConges: [ 
                {
                    id:8,
                    startDate: '30/10/2017',
                    endDate: '31/10/2017',
                    absType : 'CP',
                    dayNumber: 2
                }, {
                    id: 9,
                    startDate: '02/11/2017',
                    endDate: '03/11/2017',
                    absType : 'RTT',
                    dayNumber: 2
                }, {
                    id: 10,
                    startDate: '02/12/2017',
                    endDate: '02/12/2017',
                    absType : 'CP',
                    dayNumber: 1
                }
            ]
        } 
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
    }
    
    addNewPeriod(){
		this.props.navigation.navigate('CongesPeriode');
    }
    
    modifyPeriod(id){
        alert('bla:'+ id);
    }

    deleteConge(){

    }
        
    saveDraft(){

    }

    validateConge(){
        
    }

    afficherRow(){
        return (this.state.listConges.map((row, i) => (
            <TouchableOpacity key={i} onPress={() => this.modifyPeriod(row.id)}>
                <Row 
                style={[style.row, i%2 && {backgroundColor: '#FFFFFF'}]}
                borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
                textStyle={style.rowText}
                data={[row.startDate, row.endDate, row.absType, row.dayNumber]}/> 
            </TouchableOpacity>   
        )));
    }

    render() {         
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
                        <View style={style.containerTable}>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}>
                                <Row data={this.state.header} style={style.header} textStyle={style.headerText} />
                                {this.afficherRow()}
                            </Table>
                        </View>
                        <View>    
                            <Button
                                text="AJOUTER NOUVELLE PERIODE"
                                onPress={() => this.addNewPeriod()}/>
                        </View>
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
        
        CongesPeriode: {
            screen: CongesPeriode,
            navigationOptions: { header: null }
        }
    });
    
    
    // EXPORT DE LA NAVIGATION
    export default navigation; 