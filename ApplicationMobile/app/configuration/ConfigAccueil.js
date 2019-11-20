let configAccueil = {
  user: null,
  conges: null,
  news: null,
  messinfo: null,
  clean() {
    configAccueil.user = null;
    configAccueil.conges = null;
    configAccueil.news = null;
	configAccueil.messinfo = null;
  },
};

export default configAccueil;
