import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');
export default StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 16,
    padding: 2,
    margin: 2
  },

  textInputYear: {
    borderWidth: 1,
    color: 'black',
    height: 25, 
    width: 70,
    padding: 2,
    margin: 4,
    textAlign: 'center',
    textAlignVertical: 'center'
  },

  textInputCounter: {
    borderWidth: 1,
    color: 'black',
    height: 25, 
    width: 40,
    padding: 2,
    margin: 4,
    textAlign: 'center',
    textAlignVertical: 'center'
  },

  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  container1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },

  containerInfoElement: {
    flexDirection: 'row'
  },

  container2: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },

  containerAdd: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems : 'center',
    marginRight: 4
  },

  container3: {
    display: 'flex',
    marginRight: 10,
    marginLeft: 10,
    padding: 5,
    borderWidth: 1
  },

  containerList: {
    flex:1,
    marginBottom: 25
  },

  containerPeriod: {
    flexDirection: 'row'
  },

  containerIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  periodText: {
    color: 'black',
    fontSize: 16
  },

  dayNumberText: {
    color: 'gray',
    fontSize: 14
  },

  statusText: {
    color: 'gray',
    fontSize: 14
  },

  // addText: {
  //   color: 'black',
  //   fontSize: 16,
  // },

  // addBtn: {
  //   height: 20, 
  //   width: 20
  // },

  listIcon: {
    height: 15, 
    width: 15
  },

  btnAdd: {
    borderWidth: 1,
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 15
    // },
    // shadowOpacity: 20
  },
});