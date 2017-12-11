import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Image,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import propTypes from "prop-types";
import styles from "./styles";

import configurationAppli from "../../configuration/Configuration";
import configAccueil from "../../configuration/ConfigAccueil";
import configNews from "../../configuration/ConfigNews";
import configAnnuaire from "../../configuration/ConfigAnnuaire";

var { height, width } = Dimensions.get("window");

class ContainerHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({ x: -width, y: 0, }),
      isOpen: false,
      navigationParent: null,
      nbNews: 8, //Necessite de mettre une variable globale
    };
  }

  afficherEcran(ecran) {
    this.props.afficherEcran(ecran);
  }

  afficherCloseMenu() {
    if (this.state.isOpen) {
      this.closeView();
    } else {
      this.openView();
    }
    this.state.isOpen = !this.state.isOpen;
  }
  closeView() {
    Animated.timing(this.state.pan, {
      toValue: { x: -width, y: 0 },
      //easing: Easing.back,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  openView() {
    Animated.timing(this.state.pan, {
      toValue: { x: 0, y: 0 },
      //easing: Easing.back,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  fermerMenu() {
    this.props.fermerMenu();
  }

  afficherNews(news) {
    return news > 0 ? (
      <Text
        style={styles.TextItemNews}
        onLayout={event => console.log(event.nativeEvent.layout.height)}
      >
        {news}
      </Text>
    ) : null;
  }

  deconnexion() {
    configurationAppli.clean();
    configNews.clean();
    configAccueil.clean();
    configAnnuaire.clean();
    this.afficherEcran("Connexion");
  }

  render() {
    return (
      <View>
        <View style={styles.ContainerMenu}>
          <View style={styles.ContainerTop}>
            <Image
              style={styles.Logo}
              source={require("../../images/logoMenu.png")}
            />
            <TouchableOpacity
              style={styles.CloseMenuButton}
              onPress={() => this.fermerMenu()}
            >
              <Image
                style={styles.CloseIcon}
                source={require("../../images/icons/CloseIcon.png")}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("Accueil")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="home" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Accueil</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("ActivitesListe")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="briefcase" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Relevés d'Activité</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("FraisListe")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="cutlery" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Notes de Frais</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("CongesListe")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="sun-o" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Congés</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("AnnuaireListe")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="users" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Annuaire</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("News")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="calendar" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>News</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.afficherEcran("BugReport")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="bug" size={30} color="#000" />
              <Text style={styles.TextItemMenu}>Rapporter une {"\n"}anomalie</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ItemMenu}
            onPress={() => this.deconnexion()}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="sign-out" size={30} color="#000"></Icon>
              <Text style={styles.TextItemMenu}>Déconnexion</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ItemMenu, styles.LastItemMenuLeft]}
            onPress={() => this.afficherEcran("APropos")}
          >
            <View style={styles.ItemMenuView}>
              <Icon name="info" size={30} color="#000"></Icon>
              <Text style={styles.TextItemMenu}>À Propos</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.ItemMenu, styles.LastItemMenuRight]} onPress={()=>this.afficherEcran('Reglages')}>
						<Image style={styles.LastItemMenuIcon}
            source={require('../../images/icons/CogIcon.png')}
							/>
					</TouchableOpacity> */}
        </View>

        <View style={styles.ContainerOpaque}>
          <TouchableOpacity
            style={styles.buttonOpaque}
            onPress={() => this.fermerMenu()}
          />
        </View>
      </View>
    );
  }
}

export default ContainerHeader;
