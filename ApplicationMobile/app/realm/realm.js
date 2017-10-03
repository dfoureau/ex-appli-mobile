import Realm from 'realm';

// Définition des modèles et de leurs propriétés

// Période
class Period extends Realm.Object{}

Period.schema = {
    name:'Period',
    primaryKey:'id',
    properties: {
        id:'int',    // primary key
        startDate:'string',
        startPeriod:'string',
        endDate:'string',
        endPeriod:'string',
        absTypeId:'string',
        absTypeLabel:'string'
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

export default new Realm({ schema: [Period, Setting] })
