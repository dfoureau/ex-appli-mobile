import React from 'react'
import Button from '../components/Button'
import {
    Text,
    View,
    StyleSheet
  } from 'react-native';
const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
      },
      text: {
        textAlignVertical: 'center',
        textAlign : 'center'
      }
})

 class HelloWorld2 extends React.Component {     
    render(){
        return (
            <View >
                <Text style={styles.text}> { this.props.navigation.state.params.data } {"\n"} </Text>
                
                <Text style={styles.text}> { this.props.navigation.state.params.user }</Text>
            </View>
        );
    }
}

export default HelloWorld2;