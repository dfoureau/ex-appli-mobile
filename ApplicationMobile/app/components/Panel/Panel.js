import React, { Component } from "react";
import { Text, View, Image, TouchableHighlight, Animated } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export class Panel extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      up: require("../../images/icons/moins.png"),
      down: require("../../images/icons/plus.png"),
    };

    this.state = {
      title: props.title,
      expanded: true,
      animation: new Animated.Value(),
    };
  }

  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
    });
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }

  toggle() {
    let initialValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight;

    this.setState({
      expanded: !this.state.expanded,
    });

    this.state.animation.setValue(initialValue);
    Animated.spring(this.state.animation, {
      toValue: finalValue,
    }).start();
  }

  render() {
    let icon = this.icons["down"];

    if (this.state.expanded) {
      icon = this.icons["up"];
    }

    //Step 5
    return (
      <Animated.View
        style={[
          styles.container,
          { height: this.state.animation },
          this.props.containerStyle,
        ]}
      >
        <View
          style={styles.titleContainer}
          onLayout={this._setMinHeight.bind(this)}
        >
          <TouchableHighlight
            style={styles.button}
            onPress={this.toggle.bind(this)}
            underlayColor="white"
          >
            <View style={styles.buttonContainer}>
              <Text style={styles.title}>{this.state.title}</Text>
              <Image style={styles.buttonImage} source={icon} />
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

export default Panel;
