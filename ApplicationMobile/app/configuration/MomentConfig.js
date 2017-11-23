/**
 * Configuration de la localisation pour moment.js
 */

 import moment from "moment";
 import "moment/locale/fr";

// Localisation FR par défaut
 moment.locale("fr");

// Surcharge de la fonction months pour avoir la première lettre en majuscules

moment.updateLocale('fr', {
    months: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
});
