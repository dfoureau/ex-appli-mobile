import React from 'react'
import { Calendar } from 'react-native-calendars';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Style from '../../../styles/Styles';
import styles from './styles';
import CheckBox from 'react-native-check-box'

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button } from '../../../components/Buttons';

class FraisDetail extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { 
			title:'Note de frais',
			status: this.setStatus(),
			selectedDatesArray: [],
			factureClientChecked: false,
			nomClient: '',
			lieuDeplacement: '',
			nbKm: '',
			indemKm: 0.333,
			forfait: '',
			sncf: '',
			peages: '',
			essence: '',
			taxi: '',
			nbZones: '',
			pourcent: '',
			hotel: '',
			repas: '',
			invitation: '',
			divers: '',
			libelleDivers: ''
		}
	}

	setStatus() {
		if (this.props.navigation.state.params == undefined) return 'nouveau';
		else return 'modifié';
	}

	onDateSelected(day) {
		
		let date = day.dateString;
		let index = this.state.selectedDatesArray.indexOf(date);
		if (index <= -1) {
			//Ajout d'une date dans le tableau
			console.log('add');
			this.setState(prevState => ({
				selectedDatesArray: [...prevState.selectedDatesArray, date]
			}))
		}
		else if (index > -1){
			//Suppression d'une date du tableau
			this.setState((prevState) => ({
				selectedDatesArray: [...prevState.selectedDatesArray.slice(0,index), ...prevState.selectedDatesArray.slice(index+1)]
			}))
		}

	}
	
	//Inputs handle
	handleChecked() {
		this.setState(prevState => ({
				factureClientChecked: !prevState.factureClientChecked
			}))
    }
    handleValidate() {
		//Params:
		//	dates -> array de strings
		this.props.navigation.navigate('FraisAjout', {dates: this.state.selectedDatesArray});
    }
    handleDelete() {
        this.props.navigation.navigate('FraisAjout');
    }

	/** Au chargement **/
	convertDates() {
		//Converti les dates selectionnees stockees sous forme de tableau en objet
		let datesObject = {};
		this.state.selectedDatesArray.forEach((date) => {
			datesObject[date] = [{startingDay: true, color: '#355A86'}, {endingDay: true, color: '#355A86',textColor: '#ffff'}];
		} );
		return datesObject;
	}

	render() {

		return (

            <View style={styles.mainContainer}>
                <ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                </ContainerTitre>
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>

                        <View style={styles.containerEtat}>
                            <Text style={styles.text}>État: {this.state.status}</Text>
                        </View>

                        <View style={styles.containerCalendar}>
                            <Calendar
                                markedDates={this.convertDates()}
                                markingType={'interactive'}
                                onDayPress={(day) => this.onDateSelected(day)}
                            />
                        </View>
                        
                        <View style={styles.containerDetails}>

                            <View style={styles.containerInput}>
                                <Text style={styles.inputTitle}>Informations client*</Text>

								<View style={styles.inputView}>
									<CheckBox	
										onClick={() => this.handleChecked()}
										isChecked={this.state.factureClientChecked}
										rightText='Facture client ?'
										rightTextStyle={{color:'black', fontSize: 16}}
										style={styles.checkbox}
									/>
									<View>
										<Text style={styles.text}>Client/Object* :</Text>
										<TextInput
											style={styles.inputComponent}
											value={this.state.nomClient}
											onChangeText={(text) => this.setState({nomClient: text})}
											editable={true}
											underlineColorAndroid='transparent'
										/>	 
									</View>
									<View>
										<Text style={styles.text}>Lieu de déplacement* :</Text>
										<TextInput
											style={styles.inputComponent}
											value={this.state.lieuDeplacement}
											placeholderTextColor='#000000'
											onChangeText={(text) => this.setState({lieuDeplacement: text})}
											editable={true}
											underlineColorAndroid='transparent'
										/>	 
									</View>
								</View>
                            </View>

                            <View style={styles.containerInput}>
                                <Text style={styles.inputTitle}>Transport</Text>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Nombre de km :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.nbKm}
											onChangeText={(text) => this.setState({nbKm: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Forfait :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.forfait}
											onChangeText={(text) => this.setState({forfait: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View> 
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>SNCF :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.sncf}
											onChangeText={(text) => this.setState({sncf: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Péages :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.peages}
											onChangeText={(text) => this.setState({peages: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Essence :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.essence}
											onChangeText={(text) => this.setState({essence: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Taxi :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.taxi}
											onChangeText={(text) => this.setState({taxi: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
								</View>
							</View>

							<View style={styles.containerInput}>
								<Text style={styles.inputTitle}>Abonnements</Text>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Nb de zones :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.nbZones}
											onChangeText={(text) => this.setState({nbZones: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>50% :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.pourcent}
											onChangeText={(text) => this.setState({pourcent: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View> 
								</View>
                            </View>

                            <View style={styles.containerInput}>
								<Text style={styles.inputTitle}>Frais de réception</Text>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Hôtel :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.hotel}
											onChangeText={(text) => this.setState({hotel: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Repas :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.repas}
											onChangeText={(text) => this.setState({repas: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View> 
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Invitation :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.invitation}
											onChangeText={(text) => this.setState({invitation: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>
									</View> 
								</View>
							</View>

                            <View style={styles.containerInput}>
								<Text style={styles.inputTitle}>Divers</Text>

								<View style={styles.inputView}>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText]}>Divers :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow]}
											value={this.state.divers}
											onChangeText={(text) => this.setState({divers: text})}
											editable={true}
											underlineColorAndroid='transparent'
											keyboardType="numeric"
										/>	 
									</View>
									<View style={styles.inputGroup}>
										<Text style={[styles.text,styles.inputText, styles.inputTextSmall]}>Libellé frais divers :</Text>
										<TextInput
											style={[styles.inputComponent, styles.inputComponentRow, styles.inputComponentSmall]}
											value={this.state.libelleDivers}
											onChangeText={(text) => this.setState({libelleDivers: text})}
											editable={true}
											underlineColorAndroid='transparent'
										/>
									</View> 
								</View>
							</View>

                        </View>
                        
                    </View>
                </ScrollView>
                
                <View style={styles.containerButton}>
                    <Button 
                        buttonStyles={styles.deleteButton} 
                        text="SUPPRIMER"
                        onPress={() =>
                           Alert.alert(
                           'Suppression',
                           'Etes-vous sûr de vouloir supprimer la période ?',
                           [{text: 'Non', onPress: () => console.log('Cancel!')},{text: 'Oui', onPress: () => this.handleDelete()},]
                        )}/>
					<Button onPress={() => this.handleValidate()} text="VALIDER"/>
                </View>
            </View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({
	FraisDetail: {
		screen: FraisDetail,
		navigationOptions: { header: null }
	},
});


// EXPORT DE LA NAVIGATION
export default navigation; 
