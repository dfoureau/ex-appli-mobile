var configurationAppli = {
  userID: null,
  userToken: null,
  expirationToken: null,
  idAgence: null,
  //apiURL: "http://185.57.13.103/rest/web/",
  apiURL: "http://192.168.1.20/prj-appli-mobile/ServicesREST/Symfony/web/",
  //apiURL: "https://test.cat-amania.com/rest/web/",
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
    configurationAppli.expirationToken = null;
  },
};

export default configurationAppli;
