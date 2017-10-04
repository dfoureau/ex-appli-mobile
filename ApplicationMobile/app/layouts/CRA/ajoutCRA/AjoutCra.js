import React from 'react';
import { View,Text,TextInput,Picker, TouchableOpacity,ScrollView ,Alert} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button,} from '../../../components/Buttons';
import ActivitesDetail from '../activitesDetail/ActivitesDetail';
import CraConfirmation from '../craConfirmation/CraConfirmation';
import Style from '../../../styles/Styles';
import style from './styles';
import Panel from '../../../components/Panel/Panel';

 class AjoutCra extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
		   title: '',
            statusId: 1,
            TextClient : ' ',
            TextResponsable :' ',
            TextProjet : ' ',
            TextComment : ' ',
            status:'nouveau',
            statusLabel:'Nouveau CRA',
            header: ['Date du', 'Date au', 'Type d\'abs', 'Nb. jours'],
            listCRA: [
                            {
                                id:8,
                                startDate: '01/09/2017',
                                endDate: '13/09/2017',
                                absType : '1.0',
                                dayNumber: 9
                            }, {
                                id: 9,
                                startDate: '14/09/2017',
                                endDate: '14/09/2017',
                                absType : '0.5+RT',
                                dayNumber: 1
                            }, {
                                id: 10,
                                startDate: '15/09/2017',
                                endDate: '30/07/2017',
                                absType : '1.0',
                                dayNumber: 11
                            }
            ]
		}
	}


	//Permet d'afficher l'ecran choisi dans le menu
	afficherEcranParent(ecran){
		this.props.navigation.navigate(ecran);
	}
    deleteCr(){

    }

    validatePressDelete(){
      this.props.navigation.navigate('CraConfirmation');
    }

    saveDraft(){
            this.setState({statusId: 2, status: 'brouillon', statusLabel: 'DC en brouillon'});
            this.props.navigation.navigate('CraConfirmation');
    }


    validate(){
              this.setState({statusId: 3, status: 'validé', statusLabel: 'Modifications interdites'});
              this.props.navigation.navigate('CraConfirmation');
    }

     modifyCRA(id,startDate,endDate,absType){
            this.props.navigation.navigate('ActivitesDetail',{idCRA: id,startDate:startDate,endDate:endDate,
              absType:absType});
         }

     showDeleteButton()
     {
             //if(this.state.statusId == 1 || this.state.statusId == 2)
                 return <Button text="SUPPRIMER" buttonStyles={style.deleteButton}  onPress={() =>
                 Alert.alert(
                 'Suppression',
                  'Etes-vous sûr de vouloir supprimer le relevé d activité ?',
                  [
                  {text: 'Non', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'Oui', onPress: () => this.validatePressDelete()},
                  ]
                  )
                  }/>
     }

     showDraftButton()
     {
           // if(this.state.statusId == 1 || this.state.statusId == 2)
                return <Button buttonStyles={style.draftButton} text="BROUILLON" onPress={() => this.saveDraft()} />
     }

     showValidateButton()
     {
            //if(this.state.statusId == 1 || this.state.statusId == 2)
                return <Button text="VALIDER"  onPress={() => this.validate()} />
     }


      afficherRow(){
            return (this.state.listCRA.map((row, i) => (
                <TouchableOpacity key={i} onPress={() => this.modifyCRA(row.id,row.startDate,row.endDate,row.absType)}>
                    <Row
                    style={[style.row, i%2 && {backgroundColor: '#FFFFFF'}]}
                    borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}
                    textStyle={style.rowText}
                    data={[row.startDate, row.endDate, row.absType, row.dayNumber]}/>
                </TouchableOpacity>
            )));
       }

     handleValidate = () => {
     //TODO Retourne sur la page des CRA
      this.props.navigation.navigate('ActivitesListe');
      };

     //i.e this.props.navigation.state.params.Idate,
     static navigationOptions = ({ navigation }) => ({
              Idate:navigation.state.params.Idate, });

	render() {
       //Décralation du params transmis à l'écran courante.
       const { params } = this.props.navigation.state;

		return (
			<View>
				<ContainerTitre title={params.Idate} navigation={this.props.navigation}>
                  <View style={style.container}>

                    <View style={style.container1}>
                       <View style={style.containerFirstLine}>
                          <Text style={style.text}>Etat : {this.state.status}</Text>
                        </View>
                        <View style={style.containerFirstLine}>
                          <Text style={style.textCRA}>{this.state.statusLabel}</Text>
                        </View>
                    </View>

                    <View style={style.containerSecondLine}>
                       <Text style={style.text}>Jours ouvrés : 21 j</Text>
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
                           			width: 162 }}
                           			selectedValue={this.state.month}
                           			onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}>
                           					<Picker.Item label={params.Idate} value="0"/>
                           					<Picker.Item label="Janvier 2017" value="1"/>
                           					<Picker.Item label="Février 2017" value="2"/>
                           					<Picker.Item label="Mars 2017" value="3"/>
                           				    <Picker.Item label="Avril 2017" value="4"/>
                           					<Picker.Item label="Mai 2017" value="5"/>
                           				    <Picker.Item label="Juin 2017" value="6"/>
                           					<Picker.Item label="Juillet 2017" value="7"/>
                           					<Picker.Item label="Août 2017 " value="8"/>
                           					<Picker.Item label="Septembre 2017 " value="9"/>
                           					<Picker.Item label="Octobre 2017 " value="10"/>
                           					<Picker.Item label="Novembre 2017 " value="11"/>
                           					<Picker.Item label="Décembre 2017" value="12"/>
                           	     </Picker>
                            </View>
                         </View>
                     </View>

                     <View style={style.container3}>
                          <Table style={style.table} borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}>
                               <Row data={this.state.header} style={style.header} textStyle={style.headerText} />
                                {this.afficherRow()}
                          </Table>
                     </View>

                    <Panel  title="Information mission *"  containerStyle={{backgroundColor:"transparent", margin:0}}>

                    <View style={style.containerInformation}>
                        <View style={style.containerFirstLine}>
                          <Text style={style.text}>Client * : </Text>
                        </View>
                        <View style={style.containerInfoClt}>
                             <TextInput
                             style={style.textInputInfos}
                             value={this.state.TextClient}
                             editable={true}
                             placeholderTextColor='#000000'
                             onChangeText={(TextClient) => this.setState({TextClient})}
                             underlineColorAndroid='transparent' />
                        </View>

                        <View style={style.containerFirstLine}>
                              <Text style={style.textResponsable}>   Responsable * : </Text>
                        </View>

                        <View style={style.containerInfoResp}>
                               <TextInput
                                style={style.textInputInfos}
                                value={this.state.TextResponsable}
                                editable={true}
                                placeholderTextColor='#000000'
                                onChangeText={(TextResponsable) => this.setState({TextResponsable})}
                                underlineColorAndroid='transparent' />
                        </View>

                        <View style={style.containerFirstLine}>
                               <Text style={style.textProjet}>   Projet : </Text>
                        </View>

                        <View style={style.containerInfoPrj}>
                               <TextInput
                               style={style.textInputInfos}
                               value={this.state.TextProjet}
                               placeholderTextColor='#000000'
                               onChangeText={(TextProjet) => this.setState({TextProjet})}
                               editable={true}
                               underlineColorAndroid='transparent' />
                        </View>
                    </View>
                    </Panel>

                    <Panel  title="Commentaire"  containerStyle={{backgroundColor:"transparent", margin:0}}>
                         <View style={style.containerCommentaire}>
                           <TextInput
                             style={style.textInputComment}
                             multiline = {true}
                             editable={true}
                             numberOfLines = {4}
                             onChangeText={(textComment) => this.setState({textComment})}
                             placeholderTextColor='#000000'
                             value={this.state.textComment}
                             underlineColorAndroid='transparent'
                           />
                         </View>
                     </Panel>
                      <View style={style.containerButton}>
                         {this.showDeleteButton()}
                         {this.showDraftButton()}
                         {this.showValidateButton()}
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
    ActivitesDetail: {
        screen: ActivitesDetail,
        navigationOptions: { header: null }
    },

    CraConfirmation: {
                screen: CraConfirmation,
                navigationOptions: { header: null }
            }
	
});




// EXPORT DE LA NAVIGATION
export default navigation;
