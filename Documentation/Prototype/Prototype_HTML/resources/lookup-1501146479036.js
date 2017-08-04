(function(window, undefined) {
  var dictionary = {
    "dd591de1-30ae-497c-87df-216dc4ce4fcf": "appPhotoJustif",
    "cba66832-27a6-4127-b70c-53e5385f76e9": "AccueilScreen",
    "3c272164-ca5e-4436-b2f5-00785cd572a9": "AddingCraScreen",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "ConnexionScreen",
    "1522da3a-bb07-421b-b3f4-6e583979dd71": "NotificationsScreen",
    "2f2847ce-da27-4b69-8227-5a14a6999820": "InfoScreenMois",
    "23e84970-aaa2-49b2-a653-64cb60057a1c": "DCScreen",
    "dcae204b-fb70-4e65-92f4-105031f74115": "AddDCScreen",
    "1a423485-e384-4d2c-9cf8-222707548415": "InfoScreenAnnee",
    "3e885786-21d5-47dc-8dd4-7b7ab2f55d34": "AddNDFScreen",
    "625d9050-c1ce-41e8-bc65-0521d6153aef": "CRAScreen",
    "4d07fa8e-484a-4afb-8878-387ae93d5f47": "AccueilV2",
    "b090b0f0-7ba9-44f4-adad-d3806ce8c38c": "NDFScreen",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);