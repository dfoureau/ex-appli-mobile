import React from 'react'
import { View, Text, TextInput, Picker, Image, TouchableHighlight, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import style from './styles';
import styleButton from '../../../components/Buttons/styles';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil';
import CongesAjout from '../congesAjout/CongesAjout';
import CongesConfirmation from '../congesConfirmation/CongesConfirmation';

class CongesListe extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Demande de congés' }
	}

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
	
	addDemandeConge(){
		this.props.navigation.navigate('CongesAjout');
	}

	render() {

		/*status => 1: validé, 2: brouillon, 3: en attente de validation */
        const data = [
            {
                key: 1,
				startDate: '28/11/2017',
				endDate: '28/11/2017',
				dayNumber: 0.5,
				statusId: 2,
				status: 'brouillon'
            }, {
				key: 2,
				startDate: '18/08/2017',
				endDate: '25/08/2017',
				dayNumber: 6,
				statusId: 3,
				status: 'en attente de validation'
            }, {
                key:3,
				startDate: '06/09/2017',
				endDate: '12/09/2017',
				dayNumber: 6,
				statusId: 1,
				status: 'validé',
				userValidation: 'Anne Edythe',
				dateValidation: '03/09/2017'
			},
		];

		return (
			<View>
				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
					<View style={style.container}>
						{/* Container avec compteurs des congés*/}
						<View style={style.container1}>
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
						{/* Container filtre et ajout de congés*/}
						<View style={style.container2}>
							<View style={style.containerPicker}>
								<Picker
										style={{width:110}}
										selectedValue={this.state.month}
										onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}>
										<Picker.Item label="Année" value="0"/>
										<Picker.Item label="2017" value="1"/>
										<Picker.Item label="2016" value="2"/>
										<Picker.Item label="2015" value="3"/>
										<Picker.Item label="2014" value="4"/>
										<Picker.Item label="2013" value="5"/>
										<Picker.Item label="2012" value="6"/>
										<Picker.Item label="2011" value="7"/>
								</Picker>
							</View>
							<View style={style.containerButton}>
								<Button 
									text="AJOUTER"
									onPress={() => this.addDemandeConge()}
								/>
							</View>
						</View>
						{/* Container liste des congés */}
						<View style={style.container3}>
							<FlatList 
							data={data}
							renderItem={({item}) => 
								<View style={style.containerList}>
									<View style={style.containerPeriod}>
										<Text style={style.periodText}>{item.startDate} au {item.endDate}</Text>
										<View style={style.containerIcon}>
											<Image style={style.listIcon} source= { item.statusId == 1 ? require('../../../images/icons/check2.png') : null}/>
										</View>
									</View>
									<View>
										<Text style={style.dayNumberText}>Nb jours : {item.dayNumber}</Text>
										<Text style={style.statusText}>Etat : {item.status}{ item.statusId == 1 ? <Text> par {item.userValidation} le {item.dateValidation}</Text> : null}</Text>	
									</View>
								</View>}/>
						</View>
					</View>
				</ContainerAccueil>				
			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	CongesListe: {
		screen: CongesListe,
		navigationOptions: { header: null }
	},
	CongesAjout: {
		screen: CongesAjout,
		navigationOptions: { header: null }
	},
	CongesConfirmation: {
		screen: CongesConfirmation,
		navigationOptions: { header: null }
	}
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 