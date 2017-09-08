import React, { Component } from 'react';
import { View, TextInput, Image } from 'react-native';

import styles from './styles';

class SearchFilter extends Component {
    
    render(){
        return (

            <View>
                <TextInput style={styles.SearchFilter}
                    placeholder="Rechercher dans la liste"
                    placeholderTextColor='#000000'
                    underlineColorAndroid={'transparent'} 
                    onChangeText={(text)=>this.filtreNom(text)}
                />
                <Image style={styles.SearchIcon} source={require('../../images/icons/SearchIcon.png')} />
            </View>

        );  
    }
}

export default SearchFilter;