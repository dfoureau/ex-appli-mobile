var configurationAppli = {
  userID: null,
  userToken: null,
  idAgence: null,
  apiURL: "http://185.57.13.103/rest/web/app_dev.php/",
  lienMdpOublie:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/connexion.php",
  lienSupportJira:
    "http://jira.svc.cat-amania.com/servicedesk/customer/portal/6",
  lienAideCRA:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/upload/aide/synthese_CRA.pdf?v=1.2",
  lienAideConges:
    "https://espacecollaborateur.cat-amania.com/espacecollaborateur/upload/aide/synthese_conges.pdf?v=1.2",
  clean() {
    configurationAppli.userID = null;
    configurationAppli.userToken = null;
    configurationAppli.idAgence = null;
  },
};

export default configurationAppli;
