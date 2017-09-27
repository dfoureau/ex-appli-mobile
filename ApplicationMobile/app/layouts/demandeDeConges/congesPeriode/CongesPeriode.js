import React from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from './styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil'
import Calendar from '../../../components/calendar/Calendar';

import styles from './styles';

var list = [];

class CongesPeriode extends React.Component { 
	constructor (props) {
        super(props)
        this.renderRow()

    }
    
    static navigationOptions = ({ navigation }) => ({
        idPeriod: navigation.state.params.idPeriod,
    });

    renderRow()
    {
        const { params } = this.props.navigation.state;
        // Nouvelle période
        if( params.idPeriod == null)
        {
            this.state = { 
                title:'Détails période', 
                date1: "09/09/2017",
                moment1: "2",
                date2: "12/12/2017",
                moment2: "2",
                absence: ""
            };   
        }         
    }
    
    savePeriod()
    {
        var period = {
            startDate: this.state.date1,
            startPeriod: this.state.moment1, 
            endDate: this.state.date2,
            endPeriod: this.state.moment2,
            absTypeId: this.state.absence,
            absTypeLabel: 'CP'
        };

        try {
            AsyncStorage.setItem('period', JSON.stringify(period));
        }
        catch(error){
            console.log(error.message);
        }
    }

    handleValidate() {
        // TODO : Verifier que toutes les valeurs sont remplies

        // Ajout et sauvegarde item dans la liste
        this.savePeriod();

        // Maj de l'item dans la liste
        // item = this.state.listConges.find(i => i.id === params.idConge);
        // item.startDate = this.state.date1;
        // item.startPeriod = this.state.moment1;
        // item.endDate = this.state.date2;
        // item.endPeriod = this.state.moment2;
        // item.absTypeId = this.state.absence;

        this.props.navigation.navigate('CongesAjout');
    }

    handleSupprimer() {
        
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