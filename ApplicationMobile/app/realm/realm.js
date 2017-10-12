import Realm from 'realm';

// Définition des modèles et de leurs propriétés

// Période
class Period extends Realm.Object{}

Period.schema = {
    name:'Period',
    primaryKey:'id',
    properties: {
        id:'int',    // primary key
        idConge: {type: 'int', default: 0},
        startDate:'string',
        startPeriod:'string',
        endDate:'string',
        endPeriod:'string',
        absTypeId:'string',
        nbJoursOuvres:'float'
    }
  };

// Réglage
class Setting extends Realm.Object{}
Setting.schema = {
    name:'Setting',
    primaryKey:'key',
    properties: {
        key: 'string',
        value: {type: 'bool', default: false}
    }
  };

// Paramètres de connexion
class ConnexionParams extends Realm.Object{}
ConnexionParams.schema = {
    name:'ConnexionParams',
    primaryKey:'login',
    properties: {
        login: 'string',
        mdp: 'string',
        tokenREST: 'string'
    }
  };

export default new Realm({ schema: [Period, Setting, ConnexionParams] })
