import React from 'react';
import { View, Picker, Image, FlatList, Text, TouchableHighlight, TouchableOpacity  } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import Style from '../../../styles/Styles';
import style from './styles';

class AjoutCra extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = { title:'Septembre 2017'}
	                    }

	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	};

     handleValidate = () => {
     //TODO Retourne sur la page des CRA
      this.props.navigation.navigate('ActivitesListe');
      };

	render() {

	 const tableHead = ['Date du ', 'Date au', 'Imputation*', 'NB.jours'];

     const tableData = [
                         ['01/09/2017', '13/09/2017', '1.0', '9'],
                         ['14/09/2017', '14/09/2017', '0.5+RT', '1'],
                         ['15/09/2017', '30/07/2017', '1.0', '11'],
                       ];

		return (

			<View>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
                  <View style={style.container}>

                    <View style={style.container1}>
                       <View style={style.containerFirstLine}>
                          <Text style={style.text}>Etat : nouveau</Text>
                        </View>
                        <View style={style.containerFirstLine}>
                          <Text style={style.textCRA}>Nouvelle CRA</Text>
                        </View>
                    </View>

                    <View style={style.containerSecondLine}>
                       <Text style={style.text}>Jours ouvrés : 21</Text>
                    </View>

                     <View style={style.container1}>
                         <View style={style.containerThirdLine}>
                           <Text style={style.text}>Travaillés : 20 j</Text>
                         </View>
                         <View style={style.containerThirdLine}>
                            <Text style={style.textAbsences}>Absences : 0 j</Text>
                         </View>
                         <View style={style.containerThirdLine}>
                            <View style={style.containerPicker}>
                                 <Picker
                           			style={{
                           			width: 80 }}
                           			selectedValue={this.state.month}
                           			onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}>
                           					<Picker.Item label="Mois" value="0"/>
                           					<Picker.Item label="Janvier" value="1"/>
                           					<Picker.Item label="Février" value="2"/>
                           					<Picker.Item label="Mars" value="3"/>
                           				    <Picker.Item label="Avril" value="4"/>
                           					<Picker.Item label="Mai" value="5"/>
                           				    <Picker.Item label="Juin" value="6"/>
                           					<Picker.Item label="Juillet" value="7"/>
                           					<Picker.Item label="Août" value="8"/>
                           					<Picker.Item label="Septembre" value="9"/>
                           					<Picker.Item label="Octobre" value="10"/>
                           					<Picker.Item label="Novembre" value="11"/>
                           					<Picker.Item label="Décembre" value="12"/>
                           	     </Picker>
                            </View>
                         </View>
                     </View>

                     <View>
                          <Table style={style.table} borderStyle={{borderWidth: 0.5, borderColor: '#c8e1ff'}}>
                               <Row data={tableHead}  style={style.headTable} textStyle={style.textHead} flexArr={[1.4, 1.4,1.5, 1]}/>
                               <Rows data={tableData} style={style.rowTable}   textStyle={style.textRow} flexArr={[1.4, 1.4,1.5, 1]}/>

                               </Table>
                     </View>

                  </View>
				</ContainerTitre>
			</View>
        
		);
	}
}


// NAVIGATION AUTORISEE A PARTIR DE CE LAYOUT
const navigation=StackNavigator({

	AjoutCra: {
		screen: AjoutCra,
		navigationOptions: { header: null }
	},
	
});


// EXPORT DE LA NAVIGATION
export default navigation; 
