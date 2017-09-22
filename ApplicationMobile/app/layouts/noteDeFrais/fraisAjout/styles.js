import { StyleSheet, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');
export default StyleSheet.create({
    text: {
        color: 'black',
        fontSize: 16,
      },

      statusLabel: {
        color: 'purple',
        fontSize: 16
      },
 
    container: {
        flexDirection: 'column',
        height:height,
        width:width
      },
    
      container1: {
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 10
      },

      containerStatus: {
        flexDirection: 'row',
        alignItems : 'center'
      },

      containerStatusLabel : {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems : 'center'
      },

      container2: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 8
      },

      containerInfoElement: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'flex-start',
        flexDirection: 'column'
      },

      containerPicker:{
        flexDirection: 'row',
        borderWidth:1,
        width:160,
        height:29,
        alignItems : 'center',
        backgroundColor: '#f4f4f4',
      },
      containerButton: {
        marginTop: 8
      },

      container3: {
        flex:0.75,
        marginTop:20,
        marginHorizontal: 10,
        flexDirection: 'column'
      },

      containerTable: {
        marginBottom:20
      },

      container4: {
        flexDirection:'row', 
        justifyContent:'flex-end',
        marginHorizontal: 10,
        marginTop: 20,
      },

      header: {
        height: 25, 
        backgroundColor: '#CCCCCC' 
      },

      headerText: {
        fontSize: 14,
        color:'#000000',
        textAlign: 'center'
      },

      row: {
        height: 30,
        backgroundColor: '#EEEEEE'
      },

      rowText: {
        fontSize: 12,
        color:'#000000',
        textAlign: 'center'
      },
      //Boutons
        deleteButton: {
            backgroundColor: '#FF0000'
        },
        draftButton: {
            backgroundColor: '#808080'
        },
        addButton: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
        },
  

});
