import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import PropTypes from "prop-types";
import DatePicker from "react-native-datepicker";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
    };
  }

  changeDate(date) {
    this.setState({ date: date });
    this.props.onValueChange(date);
  }

  render() {
    return (
      <DatePicker
        style={{ width: 130 }}
        date={this.state.date}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        mode="date"
        placeholder=" /    / "
        format="DD/MM/YYYY"
        confirmBtnText="Valider"
        cancelBtnText="Annuler"
        customStyles={{
          dateInput: {
            backgroundColor: "#f9f9f9",
          },
        }}
        onDateChange={date => this.changeDate(date)}
      />
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.string,
  onValueChange: PropTypes.func,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

export default Calendar;
