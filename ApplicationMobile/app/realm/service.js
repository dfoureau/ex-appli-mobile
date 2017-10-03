import React from 'react'
import realm from '../realm/realm';
import RealmQuery from 'realm-query';

export default class service extends React.Component {
    constructor (props) {
        super(props) 
    } 
    
    // Récupère tous les éléments d'un schéma
    static get(schemaName) { 
        return realm.objects(schemaName); 
    }

    // Récupère un élément du schéma par sa clé primaire
    static getById(schemaName, id){
        return realm.objectForPrimaryKey(schemaName, id);
    }

    // Insertion d'un élément dans un schéma
    static insert(schemaName, item)
    {
        realm.write(() => {
            realm.create(schemaName, item)
        });
    }

    // Mise à jour d'un élément du schéma
    static update(schemaName, item)
    {
        realm.write(() => {
            realm.create(schemaName, item, true);
        })
    }

    // Suppression d'un élément d'un schéma 
    static delete(schemaName, id)
    {
        var item = this.getById(schemaName, id);
        realm.write(() => {
            realm.delete(item);
        });
    }

    // Suppression de tous les éléments d'un schéma
    static deleteAll(schemaName)
    {
        realm.write(() => {
            realm.deleteAll();
        });
    }

    static getNextKey(schemaName) { 
        let numbers = RealmQuery
                        .where(realm.objects(schemaName))
                        .count();
        if (numbers > 0) {
            let number = RealmQuery
                            .where(realm.objects(schemaName))
                            .max('id').id;
            return parseInt(number) + 1;
        } 
        else 
            return 1;
    }
}