let configurationAppli = {
  userID: null,
  userToken: null,
  expirationToken: null,
  idAgence: null,
  indemKM: 0.0,
  appversion: null,
  // apiURL: "https://espacecollaborateur.cat-amania.com/espacecollaborateur/rest/api/v1/web/app.php/", // API PROD
  apiURL: "http://172.16.177.31/espacecollaborateur/rest/api/v1/web/app_dev.php/", // API TEST
  lienMdpOublie:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/connexion.php",
  lienSupportJira:
    "http://jira.svc.cat-amania.com/servicedesk/customer/portal/6",
  lienAideCRA:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/upload/aide/synthese_CRA.pdf?v=1.2",
  lienAideConges:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/upload/aide/synthese_conges.pdf?v=1.2",
  lienEspaceCollaborateur: "https://espacecollaborateur.cat-amania.com",
  clean() {
    configurationAppli.userID = null;
    configurationAppli.userToken = null;
    configurationAppli.idAgence = null;
    configurationAppli.expirationToken = null;
    configurationAppli.appversion = null;
    indemKM = 0.0;
  },
};

export default configurationAppli;
