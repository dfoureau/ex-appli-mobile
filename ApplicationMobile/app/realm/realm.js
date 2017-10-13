import Realm from 'realm';

// Définition des modèles et de leurs propriétés

// Période de congé
class Period extends Realm.Object{}
Period.schema = {
    name: 'Period',
    primaryKey: 'id',
    properties: {
        id: 'int',    // primary key
        idConge: {type: 'int', default: 0},
        startDate: 'string',
        startPeriod: 'string',
        endDate: 'string',
        endPeriod: 'string',
        absTypeId: 'string',
        workingDays: 'float'
        // TODO : add primary key server database
    }
};

// Frais
class Frais extends Realm.Object { }

Frais.schema = {
    name: 'Frais',
    primaryKey: 'id',
    properties: {
        id: 'string',    // primary key
        idUser: 'int',
        jour: 'int',
        mois: 'int',
        annee: 'int',
        indemKM: 'float',
        client: 'string',
        facturable: 'int',
        lieu: 'string',
        nbKMS: 'int',
        peages: 'float',
        forfait: 'float',
        sncf: 'float',
        nbZones: 'int',
        pourcentage: 'float',
        hotel: 'float',
        repas: 'float',
        invit: 'float',
        essence: 'float',
        taxi: 'float',
        parking: 'float',
        divers: 'float',
        libelle: 'string'
    }
};

// Item d'un CRA
class ItemCRA extends Realm.Object{}
ItemCRA.schema = {
    name:'ItemCRA',
    primaryKey:'id',
    properties: {
        id:'int',    // primary key in realm
        idItem:'int', // primary key server database
        idCRA: {type: 'int', default: 0},
        startDate:'string',
        endDate:'string',
        actType:'string',
        workingDays:'float'
    }
};

// Réglage
class Setting extends Realm.Object { }
Setting.schema = {
    name: 'Setting',
    primaryKey: 'key',
    properties: {
        key: 'string',
        value: { type: 'bool', default: false }
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

export default new Realm({ schema: [Period, Setting, Frais, ItemCRA, ConnexionParams] })
