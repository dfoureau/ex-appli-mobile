import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import DatePicker from 'react-native-datepicker';

class Calendar extends Component {

    constructor(props){
        super(props)
        this.state = {
          date: this.props.date,
        }
      }

      render(){
        return (
          <DatePicker
            style={{width: 160}}
            date={this.state.date}
            mode="date"
            placeholder="Selectionner une date"
            format="DD/MM/YYYY"
            confirmBtnText="Valider"
            cancelBtnText="Annuler"
            customStyles={{
              dateInput: {
                marginLeft: 26,
                backgroundColor: '#f9f9f9',
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
          />
        );
    }
}

export default Calendar;
