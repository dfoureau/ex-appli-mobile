import React from "react";
import {
  Picker
} from "react-native";



const PickerRange = (start, end) => {

    start = parseInt(start);
    end = parseInt(end);

    // Construction du range entre start et end
    // On compare start et end pour savoir quelle boucle for il faut utiliser
    // pour peupler l'intervalle
    let range = [];
    if (start <= end) {
      for (i = start; i<= end; i++) {
        range.push('' + i + '');
      }
    }
    else {
      for (i=start; i >= end; i--) {
        range.push('' + i + '');
      }
    }

    console.log("Range is : " + range);

    // On boucle sur chaque élément du range
    let pickerItems = range.map((i) => {
      return <Picker.Item key={i} label={i} value ={i} />
    });

    return(pickerItems);
}

export default PickerRange;
