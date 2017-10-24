import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import Style from "../../../styles/Styles";
import styles from "./styles";

// IMPORT DES COMPOSANTS EXOTIQUES
import ContainerTitre from "../../../components/containerTitre/ContainerTitre";
import { Button } from "../../../components/Buttons";

class FraisConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Note de frais",
    };
  }
  handleValidate() {
    this.props.navigation.navigate("FraisListe");
  }

  render() {
    return (
      <View>
        <ContainerTitre
          title={this.state.title}
          navigation={this.props.navigation}
        >
          <View style={Style.firstView}>
            <View style={styles.container}>
              <View style={styles.containerText}>
                <Text style={styles.confirmationText}>
                  Votre demande a été sauvegardée en brouillon.
                </Text>
              </View>
              <View style={styles.containerButton}>
                <Button
                  buttonStyles={styles.OkButton}
                  text="OK"
                  onPress={() => this.handleValidate()}
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
const navigation = StackNavigator({
  FraisConfirmation: {
    screen: FraisConfirmation,
    navigationOptions: { header: null },
  },
});

// EXPORT DE LA NAVIGATION
export default navigation;
