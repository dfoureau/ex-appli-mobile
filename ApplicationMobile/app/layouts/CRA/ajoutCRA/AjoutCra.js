import React from 'react';
import { View,Text,TextInput,Picker, TouchableOpacity,ScrollView ,Alert} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerAccueil from '../../../components/containerAccueil/ContainerAccueil';
import ContainerTitre from '../../../components/containerTitre/ContainerTitre';
import { Button,} from '../../../components/Buttons';
import ActivitesDetail from '../activitesDetail/ActivitesDetail';
import Style from '../../../styles/Styles';
import style from './styles';

class AjoutCra extends React.Component {
	 
	constructor (props) {
		super(props)
		this.state = {
		    title:'Septembre 2017',
            statusId: 1,
            TextClient : 'La Banque Postale',
            TextResponsable :'J DOE',
            TextProjet : ' ',
            TextComment : ' ',
            status:'nouveau',
            statusLabel:'Nouvelle CRA',
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
    validate(){

    }

    saveDraft()
    {

    }

     modifyCRA(id){
            this.props.navigation.navigate('ActivitesDetail',{idCRA: id});
         }


     showDeleteButton()
     {
             if(this.state.statusId == 1 || this.state.statusId == 2)
                 return <Button text="SUPPRIMER" style={style.btnDelete} onPress={() =>
                 Alert.alert(
                 'Suppression',
                  'Etes-vous sûr de vouloir supprimer le relevé d activité ?',
                  [
                  {text: 'Non', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'Oui', onPress: () => console.log('OK Pressed!')},
                  ]
                  )}/>
     }

     showDraftButton()
     {
            if(this.state.statusId == 1 || this.state.statusId == 2)
                return <Button text="BROUILLON" onPress={() => this.saveDraft()} />
     }

     showValidateButton()
     {
            if(this.state.statusId == 1 || this.state.statusId == 2)
                return <Button text="VALIDER"  onPress={() => this.validate()} />
     }



      afficherRow(){
            return (this.state.listCRA.map((row, i) => (
                <TouchableOpacity key={i} onPress={() => this.modifyCRA(row.id)}>
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

	render() {


		return (
          <ScrollView>
			<View>
				<ContainerTitre title={this.state.title} navigation={this.props.navigation}>
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
                           			width: 140 }}
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

                     <View style={style.container3}>
                          <Table style={style.table} borderStyle={{borderWidth: 1, borderColor: '#EEEEEE'}}>
                               <Row data={this.state.header} style={style.header} textStyle={style.headerText} />
                                {this.afficherRow()}
                          </Table>
                     </View>

                     <View>
                          <Text style={style.textInformation}>Information mission *</Text>
                     </View>

                    <View style={style.containerInformation}>
                        <View style={style.containerFirstLine}>
                          <Text style={style.text}>   Client * : </Text>
                        </View>
                        <View style={style.containerInfoClt}>
                             <TextInput
                             style={style.textInputInfos}
                             value={this.state.TextClient}
                             editable={true}
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
                                onChangeText={(TextResponsable) => this.setState({TextResponsable})}
                                underlineColorAndroid='transparent' />
                        </View>

                        <View style={style.containerFirstLine}>
                               <Text style={style.textProjet}>   Projet : </Text>
                        </View>

                        <View style={style.containerInfoPrj}>
                               <TextInput
                               style={style.textInputProjet}
                               value={this.state.TextProjet}
                               onChangeText={(TextProjet) => this.setState({TextProjet})}
                               editable={true}
                               underlineColorAndroid='transparent' />
                        </View>
                    </View>
                       <View>
                            <Text style={style.textCommentaire}>Commentaire</Text>
                       </View>
                         <View>
                           <TextInput
                             style={style.textInputComment}
                             multiline = {true}
                             editable={true}
                             numberOfLines = {4}
                             onChangeText={(textComment) => this.setState({textComment})}
                             value={this.state.textComment}
                             underlineColorAndroid='transparent'
                           />
                         </View>

                       <View>
                          <View style={style.vueButtonValidate}>
                           {this.showValidateButton()}
                          </View>

                          <View style={style.vueButtonBr}>
                          {this.showDraftButton()}
                          </View>

                          <View style={style.vueButtonDelete}>
                          {this.showDeleteButton()}
                          </View>
                       </View>

                  </View>
				</ContainerTitre>
			</View>
          </ScrollView>
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


	
});


// EXPORT DE LA NAVIGATION
export default navigation; 
