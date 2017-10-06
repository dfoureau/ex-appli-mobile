import React from 'react'
import { View, Text, TextInput, Picker, Image, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import style from './styles';


// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import { ContainerFilters } from '../../../components/containerFilters';
import { SearchFilter } from '../../../components/searchFilter';
import { OptionFilter } from '../../../components/optionFilter';
import { Button } from '../../../components/Buttons';
import Accueil from '../../accueil/Accueil';
import FraisAjout from '../fraisAjout/FraisAjout';


class FraisListe extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Note de frais' }
	}
	
	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}

	addNDF(){
		this.props.navigation.navigate('FraisAjout', { idNDF: null, month: null, year: null });
	}

	getNDF(id, month, year){
		this.props.navigation.navigate('FraisAjout', { idNDF: id, month: month, year: year });
	}

	render() {
		/*status => 1: validé, 2: brouillon, 3: en attente de validation */
        const data = [
            {
				key: 0,
				id: 0,
				month: 'Août',
				year: '2017',
				amount: 75,
				statusId: 3,
				status: 'en attente de validation'
            }, {
				key: 1,
				id: 1,
				month: 'Juillet',
				year: '2017',
				amount: 203,
				statusId: 1,
				status: 'validé',
				userValidation: 'Anne Edythe',
				dateValidation: '02/08/2017'
            }, {
				key:2,
				id: 2,
				month: 'Mars',
				year: '2017',
				amount: 512,
				statusId: 1,
				status: 'validé',
				userValidation: 'Anne Edythe',
				dateValidation: '04/04/2017'
			},
		];

		return (

			<View>
				<ContainerAccueil title={this.state.title} afficherEcran={this.afficherEcranParent.bind(this)}>
					<View style={style.container}>
						{/* Container filtre et ajout de NDF*/}
						<View style={style.container1}>
								<View style={style.containerPicker}>
									<Picker
											style={{width:110}}
											selectedValue={this.state.year}
											onValueChange={(itemValue, itemIndex) => this.setState({year: itemValue})}>
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
										onPress={() => this.addNDF()}
									/>
								</View>
							</View>
					</View>
					{/* Container liste des NDF */}
					<View style={style.container2}>
							<FlatList 
							data={data}
							renderItem={({item}) => 
								<View style={style.containerList}>
									<TouchableOpacity key={item.id} onPress = {() => this.getNDF(item.id, item.month, item.year)}>
										<View style={style.containerPeriod}>
											<Text style={style.periodText}>{item.month} {item.year}</Text>
											<View style={style.containerIcon}>
												<Image style={style.listIcon} source= { item.statusId == 1 ? require('../../../images/icons/check2.png') : null}/>
											</View>
										</View>
										<View>
											<Text style={style.amountText}>Montant : {item.amount} €</Text>
											<Text style={style.statusText}>Etat : {item.status}{ item.statusId == 1 ? <Text> par {item.userValidation} le {item.dateValidation}</Text> : null}</Text>	
										</View>
									</TouchableOpacity>
								</View>}/>
					</View>
				</ContainerAccueil>
			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	FraisListe: {
		screen: FraisListe,
		navigationOptions: { header: null }
	},
	FraisAjout: {
		screen: FraisAjout,
		navigationOptions: { header: null }
	},

	
});


// EXPORT DE LA NAVIGATION
export default navigation; 