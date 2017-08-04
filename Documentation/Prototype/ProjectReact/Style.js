import React from 'react'
import { Dimensions } from 'react-native'

const fondCat = '#1F262F'
const fondBleuCat = '#00B8D8'
const vertCat = '#88CD37'
const bleuCat = '#0D8CCF'
const orangeCat = '#E58129'

var {height, width} = Dimensions.get('window')

export default {
		
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 20,
		paddingHorizontal: 20,
		backgroundColor: 'white'
	},

	container: {
		backgroundColor: '#677082',
		height: height,
		paddingHorizontal: 40
	},
	
	containerMenu: {
		backgroundColor: '#999999',
		height: height
	},
	
	image: {
		marginHorizontal: width*0.2-40,
		width: width*0.6,
		height: (width*0.6*77)/260,
		marginTop: height*0.2,
		marginBottom: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	
	imageMenu: {
		marginHorizontal: width*0.2,
		height: (width*0.6*77)/260,
		width: width*0.6,
		marginVertical: 20
	},
	
	menuMail: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20
	},
	
	menu: {
		height: ((height-80-(width*0.6*77/260))/6),
		borderWidth:1,
		borderColor: 'black'
	},
	
	divMenu: {
		flexDirection: 'row',
		paddingTop: ((height-80-(width*0.6*77/260))/16)
	},
	
	divLogo: {
		width: 20,
		height: 20,
		marginRight: 50,
		marginLeft: 30
	},
	
	logo: {
		width: 20,
		height: 20
	},
	
	titreMenu: {
		fontWeight: 'bold',
		fontSize: 15
	},
	
	headerTitle: {
		color: fondCat
	},
	
	headerBleu: {
		backgroundColor: bleuCat
	},
	
	headerVert: {
		backgroundColor: vertCat
	},
	
	headerOrange: {
		backgroundColor: orangeCat
	},
	
	titreB: {
		backgroundColor: fondCat,
		color: bleuCat,
		textAlign: 'center',
		paddingVertical: 20,
		fontSize: 25,
		fontWeight: 'bold'
	},
	
	titreV: {
		backgroundColor: fondCat,
		color: vertCat,
		textAlign: 'center',
		paddingVertical: 20,
		fontSize: 25,
		fontWeight: 'bold'
	},
	
	titreO: {
		backgroundColor: fondCat,
		color: orangeCat,
		textAlign: 'center',
		paddingVertical: 20,
		fontSize: 25,
		fontWeight: 'bold'
	},
	
	selectMonth: {
		backgroundColor: 'transparent',
		width: 200
	},
	
	styleViewPicker: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 2,
		borderColor: 'gray'
	},
	
	forgottenMDP: {
		textAlign: 'center',
		color: '#FFAAAA',
		marginTop: 20,
		fontStyle: 'italic'
	}
}
