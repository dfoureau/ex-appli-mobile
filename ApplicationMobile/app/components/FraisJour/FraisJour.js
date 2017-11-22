class FraisJour {

  constructor(date) {
      this.date = date;
      this.id = date.format('DD-MM-YYYY');
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

  updateData()


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
