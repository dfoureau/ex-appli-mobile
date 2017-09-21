import React from 'react'
import { View, Text, TextInput, TouchableOpacity,Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import style from './styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil'
import CongesPeriode from '../congesPeriode/CongesPeriode';
import CongesConfirmation from '../congesConfirmation/CongesConfirmation';

class CongesAjout extends React.Component {
    constructor (props) {
		super(props)
        this.state = { 
            title:'Demande de congés',
            statusId: 1, 
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
    
    addNewConge(){
		this.props.navigation.navigate('CongesPeriode');
    }
    
    modifyConge(id){
        this.props.navigation.navigate('CongesPeriode',{idConge: id});
    }

    deleteConge(){
    this.props.navigation.navigate('CongesConfirmation');
    }
        
    saveDraft(){
        this.setState({statusId: 2, status: 'brouillon', statusLabel: 'DC en brouillon'});
        this.props.navigation.navigate('CongesConfirmation');
    }

    validateConge(){
        this.setState({statusId: 3, status: 'validé', statusLabel: 'Modifications interdites'});
        this.props.navigation.navigate('CongesConfirmation');
    }

    afficherRow(){
        return (this.state.listConges.map((row, i) => (
            <TouchableOpacity key={i} onPress={() => this.modifyConge(row.id)}>
                <Row 
                style={[style.row, i%2 && {backgroundColor: '#FFFFFF'}]}
                borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
                textStyle={style.rowText}
                data={[row.startDate, row.endDate, row.absType, row.dayNumber]}/> 
            </TouchableOpacity>   
        )));
    }

    showDeleteButton()
    {
        // if(this.state.statusId == 2)
            return <Button 
                        buttonStyles={style.deleteButton} 
                        text="SUPPRIMER"
                        onPress={() =>
                           Alert.alert(
                           'Suppression',
                           'Etes-vous sûr de vouloir supprimer le relevé d activité ?',
                           [
                           {text: 'Non', onPress: () => console.log('Cancel!')},
                           {text: 'Oui', onPress: () => this.deleteConge()},
                           ]
                           )
                           }/>

    }

    showDraftButton()
    {
        // if(this.state.statusId == 1 || this.state.statusId == 2)
            return <Button 
                        buttonStyles={style.draftButton}
                        text="BROUILLON" 
                        onPress={() => this.saveDraft()} />
    }

    showValidateButton()
    {
        // if(this.state.statusId == 1 || this.state.statusId == 2)
            return <Button 
                        text="VALIDER" 
                        onPress={() => this.validateConge()} />
    }

    render() {         
        return (
            <ContainerTitre title={this.state.title} navigation={this.props.navigation}>
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
                                onPress={() => this.addNewConge()}/>
                        </View>
                    </View>
                    <View style={style.container4}>
                        {this.showDeleteButton()}
                        {this.showDraftButton()}
                        {this.showValidateButton()}
                    </View>
                </View>
            </ContainerTitre>
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
        },

        CongesConfirmation: {
            screen: CongesConfirmation,
            navigationOptions: { header: null }
        }
    });
    
    
    // EXPORT DE LA NAVIGATION
    export default navigation; 