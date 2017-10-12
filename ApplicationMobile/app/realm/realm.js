import Realm from 'realm';

// Définition des modèles et de leurs propriétés

// Période
class Period extends Realm.Object { }

Period.schema = {
    name: 'Period',
    primaryKey: 'id',
    properties: {
        id: 'int',    // primary key
        idConge: { type: 'int', default: 0 },
        startDate: 'string',
        startPeriod: 'string',
        endDate: 'string',
        endPeriod: 'string',
        absTypeId: 'string',
        nbJoursOuvres: 'float'
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

export default new Realm({ schema: [Period, Frais, Setting] })
