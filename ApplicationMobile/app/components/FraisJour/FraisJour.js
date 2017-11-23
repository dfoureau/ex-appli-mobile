class FraisJour {

  /**
   * Initialise une note de frais pour un jour donné
   * @param  {String} date date au format YYYY-MM-DD
   * @return {[type]}      [description]
   */
  constructor(date) {
      this.date = date;
      this.totalAReglerFrais = 0;
      this.totalClientFrais = 0;
      this.detail = {
        facturable: false,
        indemKM: 0,
        client: "",
        lieu: "",
        nbKMS: 0,
        peages: 0,
        forfait: 0,
        sncf: 0,
        nbZones: 0,
        pourcentage: 0,
        hotel: 0,
        repas: 0,
        invit: 0,
        essence: 0,
        taxi: 0,
        parking: 0,
        divers: 0,
        libelle: ""
      };
      this.montants = {
        forfait: 0,
        transport: 0,
        abonnements: 0,
        reception: 0,
        divers: 0
      }
    }

  /**
   * Renseigne le détail de l'objet à partir du résultat d'une requête GET
   * On met à jour les montants totaux une fois l'opération effectuée
   * @param  {Object} data Objet data à mapper dans le this.detail
   * @return {[type]}      [description]
   */
  mapperDonnees(data) {
    this.detail = {
      facturable: Boolean(parseInt(data["facturable"])),
      indemKM: parseFloat(data["indemKM"]) || 0,
      client: data["client"],
      lieu: data["lieu"],
      nbKMS: parseInt(data["nbKM"]) || 0,
      peages: parseFloat(data["montantPeages"]) || 0,
      forfait: parseFloat(data["montantForfait"]) || 0,
      sncf: parseFloat(data["montantFraisSNCF"]) || 0,
      nbZones: parseInt(data["montantNbZone"]) || 0,
      pourcentage: parseFloat(data["montantPourcentage"]) || 0,
      hotel: parseFloat(data["montantHotel"]) || 0,
      repas: parseFloat(data["montantRepas"]) || 0,
      invit: parseFloat(data["montantInvitation"]) || 0,
      essence: parseFloat(data["montantEssence"]) || 0,
      taxi: parseFloat(data["montantTaxi"]) || 0,
      parking: parseFloat(data["montantParking"]) || 0,
      divers: parseFloat(data["montantDivers"]) || 0,
      libelle: data["libelleDivers"]
    }

    this.updateMontants();

  }

  /**
   * Met à jour le détail à partir d'un objet donné.
   * On met à jour les montants totaux une fois l'opération effectuée
   * @param  {Object} fraisData L'objet à utiliser pour mettre à jour le détail. Tous les champs du détail sont optionnels.
   * @return {[type]}            [description]
   */
  updateDetail(fraisData) {

    if (fraisData.facturable !== undefined ) {
      this.detail.facturable = Boolean(fraisData.facturable);
    }

    // if (fraisData.indemKM !== undefined ) {
    //   this.detail.indemKM = parseFloat(fraisData.indemKM)
    // }

    if (fraisData.client !== undefined ) {
      this.detail.client = fraisData.client
    }

    if (fraisData.lieu !== undefined ) {
      this.detail.lieu = fraisData.lieu
    }

    if (fraisData.nbKMS !== undefined ) {
      this.detail.nbKMS = parseInt(fraisData.nbKMS) || 0
    }

    if (fraisData.peages !== undefined ) {
      this.detail.peages = parseFloat(fraisData.peages) || 0
    }

    if (fraisData.forfait !== undefined ) {
      this.detail.forfait = parseFloat(fraisData.forfait) || 0
    }

    if (fraisData.sncf !== undefined ) {
      this.detail.sncf = parseFloat(fraisData.sncf) || 0
    }

    if (fraisData.nbZones !== undefined ) {
      this.detail.nbZones = parseInt(fraisData.nbZones) || 0
    }

    if (fraisData.pourcentage !== undefined ) {
      this.detail.pourcentage = parseFloat(fraisData.pourcentage) || 0
    }

    if (fraisData.hotel !== undefined ) {
      this.detail.hotel = parseFloat(fraisData.hotel) || 0
    }

    if (fraisData.repas !== undefined ) {
      this.detail.repas = parseFloat(fraisData.repas) || 0
    }

    if (fraisData.invit !== undefined ) {
      this.detail.invit = parseFloat(fraisData.invit) || 0
    }

    if (fraisData.essence !== undefined ) {
      this.detail.essence = parseFloat(fraisData.essence) || 0
    }

    if (fraisData.taxi !== undefined ) {
      this.detail.taxi = parseFloat(fraisData.taxi) || 0
    }

    if (fraisData.parking !== undefined ) {
      this.detail.parking = parseFloat(fraisData.parking) || 0
    }

    if (fraisData.divers !== undefined ) {
      this.detail.divers = parseFloat(fraisData.divers) || 0
    }

    if (fraisData.libelle !== undefined ) {
      this.detail.libelle = fraisData.libelle
    }

    this.updateMontants();
  }

  /**
   * Met à jour les montants de la note de Frais
   * @return {[type]} [description]
   */
  updateMontants() {
    let total = (
          this.detail.indemKM * this.detail.nbKMS +
          this.detail.forfait +
          this.detail.sncf +
          this.detail.pourcentage +
          this.detail.hotel +
          this.detail.repas +
          this.detail.invit +
          this.detail.peages +
          this.detail.essence +
          this.detail.taxi +
          this.detail.parking +
          this.detail.divers
        );

      this.totalAReglerFrais = parseFloat(total);
      this.totalClientFrais = this.detail.facturable ? parseFloat(total) : 0;
  }


}

export default FraisJour;
