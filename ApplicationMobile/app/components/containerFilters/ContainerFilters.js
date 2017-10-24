import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import styles from "./styles";

const ContainerFilters = ({ children }) => (
  <View style={styles.ContainerFilters}>{children}</View>
);

ContainerFilters.propTypes = {
  children: PropTypes.any,
};

export default ContainerFilters;
