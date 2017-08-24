import React from 'react'
import Button from '../components/Button'
import {
    Text,
    View,
    StyleSheet,
	AppRegistry,
  } from 'react-native';
import {StackNavigator} from 'react-navigation'; 
import helloworld2 from './helloworld2';

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
      },
})




 class HelloWorldA extends React.Component {
	 
	seConnecter(){
			this.props.navigation.navigate('Helloworld2', { data: 'données transférées depuis la page HelloWorld', user: 'Zakaria'});
	}
    render(){
        return (
            <View style={styles.buttons}>
                <Button text="Clic for Second Screen" onPress={()=>this.seConnecter()} />
            </View>
        );
    }
}

const navigation=StackNavigator({
    HelloWorld:{
        screen:HelloWorldA,
        navigationOptions: {
            header: null
        }
    },
    Helloworld2:{
        screen:helloworld2,
        navigationOptions: {
            header: null
        }
    }
});
export default navigation;
//AppRegistry.registerComponent('prjMobile3', () => navigation);