let configurationAppli = {
  userID: null,
  userToken: null,
  expirationToken: null,
  idAgence: null,
  apiURL: "https://test.cat-amania.com/rest8/web/",
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
  },
};

export default configurationAppli;
