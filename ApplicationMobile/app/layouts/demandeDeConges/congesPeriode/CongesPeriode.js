import React from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from './styles';
import Realm from 'realm';
import RealmQuery from 'realm-query';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil';
import Calendar from '../../../components/calendar/Calendar';
import Period from '../Period';
import styles from './styles';

class CongesPeriode extends React.Component { 
	constructor (props) {
        super(props) 
        this.setInitialValues()
    }
    
    static navigationOptions = ({ navigation }) => ({
        idPeriod: navigation.state.params.idPeriod,
    });

    setInitialValues()
    {
        const { params } = this.props.navigation.state;

        if( params.idPeriod == null)
        {
            this.state = {
                title:'Détails période', 
                date1: '09/09/2017',
                moment1: '1',
                date2: '09/09/2017',
                moment2: '2',
                absence: ''
            }
        } 
        else
        {
            var period = Period.objectForPrimaryKey('Period', params.idPeriod);
            
            this.state = {
                title:'Détails période', 
                date1: period.startDate,
                moment1: period.startPeriod,
                date2: period.endDate,
                moment2: period.endPeriod,
                absence: period.absTypeId
            };
        }          
    }

    getNextKey() { 
        let number = new Number(RealmQuery
                        .where(Period.objects('Period'))
                        .max('id').id);
 
                        //alert('number:' + parseInt(number));
        if (number != null) {
            return parseInt(number) + 1;
        } else {
            return 1;
        }
    }
    
    savePeriod(idPeriod)
    {
        var period = {
            startDate: this.state.date1,
            startPeriod: this.state.moment1, 
            endDate: this.state.date2,
            endPeriod: this.state.moment2,
            absTypeId: this.state.absence,
            absTypeLabel: 'CP'
        }; 

        if(idPeriod == null)
        {
            // Création d'une période
            Period.write(() => {
                Period.create('Period', {  
                    id: this.getNextKey(),
                    startDate: period.startDate,
                    startPeriod: period.startPeriod,
                    endDate:  period.endDate,
                    endPeriod: period.endPeriod,
                    absTypeId: period.absTypeId,
                    absTypeLabel: period.absTypeLabel
                })
            })
        }
        else
        {
            // Mise à jour d'une période
            Period.write(() => {
                Period.create('Period', {  
                    id: id,
                    startDate: period.startDate,
                    startPeriod: period.startPeriod,
                    endDate:  period.endDate,
                    endPeriod: period.endPeriod,
                    absTypeId: period.absTypeId,
                    absTypeLabel: period.absTypeLabel
                }, true);
            })
        }
    }

    deletePeriod(idPeriod)
    {
        var period = Period.objectForPrimaryKey('Period', idPeriod);
        Period.write(() => {
            Period.delete(period);
        });
    }

    handleValidate() {
        // TODO : Verifier que toutes les valeurs sont remplies
        const { params } = this.props.navigation.state;
        this.savePeriod(params.idPeriod);
        // Retour à la page d'ajout
        this.props.navigation.navigate('CongesAjout');
    }

    handleSupprimer() {
        const { params } = this.props.navigation.state;
        this.deletePeriod(params.idPeriod);
        // Retour à la page d'ajout
        this.props.navigation.navigate('CongesAjout');
    }

	render() {
		return (
			<View>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                    <View style={Style.firstView}>
                        <View style={styles.container}>
                            <View style={styles.flexContainer}>
                                <Text style={styles.calendarText}>Du</Text>
                                <Calendar 
                                        style={styles.calendarComponent} 
                                        date={this.state.date1} 
                                        onValueChange={(newDate) => this.setState({date1:newDate})}/>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                            style={styles.picker}
                                            selectedValue={this.state.moment1}
                                            onValueChange={(itemValue, itemIndex) => this.setState({moment1: itemValue})}>
                                            <Picker.Item label="Matin" value="1"/>
                                            <Picker.Item label="Midi" value="2"/>
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.flexContainer}>
                                <Text style={styles.calendarText}>Au</Text>
                                <Calendar style={styles.calendarComponent} date={this.state.date2} onValueChange={(newDate) => this.setState({date2:newDate})}/>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                            style={styles.picker}
                                            selectedValue={this.state.moment2}
                                            onValueChange={(itemValue, itemIndex) => this.setState({moment2: itemValue})}>
                                            <Picker.Item label="Midi" value="1"/>
                                            <Picker.Item label="Soir" value="2"/>
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Style.firstView}>
                        <View style={[styles.container,styles.marginTop40]}>
                            <View style={styles.pickerContainer}>
                                <Picker
                                        style={[styles.picker, styles.pickerAbsences]}
                                        selectedValue={this.state.absence}
                                        onValueChange={(itemValue, itemIndex) => this.setState({absence: itemValue})}>
                                        <Picker.Item label="- Type d'absence -" value="0"/>
                                        <Picker.Item label="Congés payés" value="1"/>
                                        <Picker.Item label="Congés anticipés" value="2"/>
                                        <Picker.Item label="Congés sans solde" value="3"/>
                                        <Picker.Item label="Solde RTT" value="4"/>
                                        <Picker.Item label="Congés maternité" value="5"/>
                                        <Picker.Item label="Congés paternité" value="6"/>
                                        <Picker.Item label="Absence exceptionnelle" value="7"/>
                                </Picker>
                            </View>
                        </View>
                    </View >
                    <View style={Style.firstView}>
                        <View style={styles.containerButton}>
                            <View style={styles.button}>
                                <Button 
                                    buttonStyles={styles.deleteButton}
                                    text="Supprimer"
                                    onPress={() => this.handleSupprimer() }
                                />
                            </View>
                            <View style={styles.button}>
                                <Button
                                    buttonStyles={styles.validateButton} 
                                    text="Valider"
                                    onPress={() => this.handleValidate() }
                                />
                            </View>
                        </View>
                    </View>
				</ContainerTitre>				
			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	CongesPeriode: {
		screen: CongesPeriode,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 