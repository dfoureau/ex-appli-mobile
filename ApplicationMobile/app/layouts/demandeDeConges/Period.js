import Realm from 'realm';

export class Period extends Realm.Object {}

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

export default new Realm({ schema: [Period] });





