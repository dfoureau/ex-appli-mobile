/**
 * Localisation pour le composant Calendar de react-native-calendars
 */
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi', 'Dimanche'],
  dayNamesShort: ['Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.', 'Dim.']
};

LocaleConfig.defaultLocale = 'fr';
