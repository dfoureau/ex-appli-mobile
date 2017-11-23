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
        facturable: 0,
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
    }

  hasId(id) {
    return this.synthese.id === id;
  }

  /**
   * Renseigne le détail de l'objet à partir du résultat d'une requête GET
   * On met à jour les montants totaux une fois l'opération effectuée
   * @param  {Object} data Objet data à mapper dans le this.detail
   * @return {[type]}      [description]
   */
  mapperDonnees(data) {
    this.detail = {
      facturable: parseInt(data["facturable"]),
      indemKM: parseFloat(data["indemKM"]),
      client: data["client"],
      lieu: data["lieu"],
      nbKMS: parseInt(data["nbKM"]),
      peages: parseFloat(data["montantPeages"]),
      forfait: parseFloat(data["montantForfait"]),
      sncf: parseFloat(data["montantFraisSNCF"]),
      nbZones: parseInt(data["montantNbZone"]),
      pourcentage: parseFloat(data["montantPourcentage"]),
      hotel: parseFloat(data["montantHotel"]),
      repas: parseFloat(data["montantRepas"]),
      invit: parseFloat(data["montantInvitation"]),
      essence: parseFloat(data["montantEssence"]),
      taxi: parseFloat(data["montantTaxi"]),
      parking: parseFloat(data["montantParking"]),
      divers: parseFloat(data["montantDivers"]),
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
      this.detail.facturable = parseInt(fraisData.facturable)
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
      this.detail.nbKMS = parseInt(fraisData.nbKMS)
    }

    if (fraisData.peages !== undefined ) {
      this.detail.peages = parseFloat(fraisData.peages)
    }

    if (fraisData.forfait !== undefined ) {
      this.detail.forfait = parseFloat(fraisData.forfait)
    }

    if (fraisData.sncf !== undefined ) {
      this.detail.sncf = parseFloat(fraisData.sncf)
    }

    if (fraisData.nbZones !== undefined ) {
      this.detail.nbZones = parseInt(fraisData.nbZones)
    }

    if (fraisData.pourcentage !== undefined ) {
      this.detail.pourcentage = parseFloat(fraisData.pourcentage)
    }

    if (fraisData.hotel !== undefined ) {
      this.detail.hotel = parseFloat(fraisData.hotel)
    }

    if (fraisData.repas !== undefined ) {
      this.detail.repas = parseFloat(fraisData.repas)
    }

    if (fraisData.invit !== undefined ) {
      this.detail.invit = parseFloat(fraisData.invit)
    }

    if (fraisData.essence !== undefined ) {
      this.detail.essence = parseFloat(fraisData.essence)
    }

    if (fraisData.taxi !== undefined ) {
      this.detail.taxi = parseFloat(fraisData.taxi)
    }

    if (fraisData.parking !== undefined ) {
      this.detail.parking = parseFloat(fraisData.parking)
    }

    if (fraisData.divers !== undefined ) {
      this.detail.divers = parseFloat(fraisData.divers)
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
        ).toFixed(2);

      this.totalAReglerFrais = parseFloat(total);
      this.totalClientFrais = this.detail.facturable == 1 ? parseFloat(total) : 0;
  }


}

export default FraisJour;
