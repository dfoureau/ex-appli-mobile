import moment from "moment";
import { momentConfig } from "../../../configuration/MomentConfig";

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
      libelle: "",
    };
  }

  /**
   * Renseigne le détail de l'objet à partir du résultat d'une requête GET
   * On met à jour les montants totaux une fois l'opération effectuée
   * @param  {Object} data Objet data à mapper dans le this.detail
   * @return {[type]}      [description]
   */
  mapFromService(data) {
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
      libelle: data["libelleDivers"],
    };

    this.updateMontants();
  }

  /**
   * Renvoie un objet dont les champs correspondent à ce qui est attendu
   * en entrée de la méthode POST du service
   * @return {[type]} [description]
   */
  mapToService() {
    const output = {
      jour: moment(this.date).format("D"),
      client: this.detail.client,
      facturable: this.detail.facturable ? 1 : 0,
      lieu: this.detail.lieu,
      nbKM: this.detail.nbKMS,
      montantPeages: this.detail.peages,
      montantFraisSNCF: this.detail.sncf,
      montantForfait: this.detail.forfait,
      montantNbZone: this.detail.nbZones,
      montantPourcentage: this.detail.pourcentage,
      montantHotel: this.detail.hotel,
      montantRepas: this.detail.repas,
      montantInvitation: this.detail.invit,
      montantTaxi: this.detail.taxi,
      montantEssence: this.detail.essence,
      montantParking: this.detail.parking,
      montantDivers: this.detail.divers,
      libelleDivers: this.detail.libelle,
    };

    return output;
  }

  /**
   * Met à jour le détail à partir d'un objet donné.
   * On met à jour les montants totaux une fois l'opération effectuée
   * @param  {Object} fraisData L'objet à utiliser pour mettre à jour le détail. Tous les champs du détail sont optionnels.
   * @return {[type]}            [description]
   */
  updateDetail(fraisData) {
    if (fraisData.facturable !== undefined) {
      this.detail.facturable = Boolean(fraisData.facturable);
    }

    if (fraisData.indemKM !== undefined ) {
      this.detail.indemKM = parseFloat(fraisData.indemKM)
    }

    if (fraisData.client !== undefined) {
      this.detail.client = fraisData.client;
    }

    if (fraisData.lieu !== undefined) {
      this.detail.lieu = fraisData.lieu;
    }

    if (fraisData.nbKMS !== undefined) {
      this.detail.nbKMS = parseInt(fraisData.nbKMS) || 0;
    }

    if (fraisData.peages !== undefined) {
      this.detail.peages = parseFloat(fraisData.peages) || 0;
    }

    if (fraisData.forfait !== undefined) {
      this.detail.forfait = parseFloat(fraisData.forfait) || 0;
    }

    if (fraisData.sncf !== undefined) {
      this.detail.sncf = parseFloat(fraisData.sncf) || 0;
    }

    if (fraisData.nbZones !== undefined) {
      this.detail.nbZones = parseInt(fraisData.nbZones) || 0;
    }

    if (fraisData.pourcentage !== undefined) {
      this.detail.pourcentage = parseFloat(fraisData.pourcentage) || 0;
    }

    if (fraisData.hotel !== undefined) {
      this.detail.hotel = parseFloat(fraisData.hotel) || 0;
    }

    if (fraisData.repas !== undefined) {
      this.detail.repas = parseFloat(fraisData.repas) || 0;
    }

    if (fraisData.invit !== undefined) {
      this.detail.invit = parseFloat(fraisData.invit) || 0;
    }

    if (fraisData.essence !== undefined) {
      this.detail.essence = parseFloat(fraisData.essence) || 0;
    }

    if (fraisData.taxi !== undefined) {
      this.detail.taxi = parseFloat(fraisData.taxi) || 0;
    }

    if (fraisData.parking !== undefined) {
      this.detail.parking = parseFloat(fraisData.parking) || 0;
    }

    if (fraisData.divers !== undefined) {
      this.detail.divers = parseFloat(fraisData.divers) || 0;
    }

    if (fraisData.libelle !== undefined) {
      this.detail.libelle = fraisData.libelle;
    }

    this.updateMontants();
  }

  /**
   * Calcule le montant total d'un FraisJour à partir d'un objet de détail donné
   * @param  {[type]} detail [description]
   * @return {[type]}        [description]
   */
  static calculerTotal(detail) {
    let total =
      (parseFloat(detail.indemKM) || 0) * (parseFloat(detail.nbKMS) || 0) +
      (parseFloat(detail.forfait) || 0) +
      (parseFloat(detail.sncf) || 0) +
      (parseFloat(detail.pourcentage) || 0) +
      (parseFloat(detail.hotel) || 0) +
      (parseFloat(detail.repas) || 0) +
      (parseFloat(detail.invit) || 0) +
      (parseFloat(detail.peages) || 0) +
      (parseFloat(detail.essence) || 0) +
      (parseFloat(detail.taxi) || 0) +
      (parseFloat(detail.parking) || 0) +
      (parseFloat(detail.divers) || 0);
    return total;
  }
  /**
 * Vérifie si un FraisJour contient des données.
 * On renvoie true si le  FraisJour :
 *        - a un montant total > 0
 *   (ou) - a au moins un libellé non vide
 *   (ou) - a un nombre de kms > 0
 * @return {Boolean}
 */
  hasData() {
    return (
      this.totalClientFrais != 0 ||
      this.totalAReglerFrais != 0 ||
      this.detail.indemKM != 0 ||
      this.detail.client != "" ||
      this.detail.lieu != "" ||
      this.detail.libelle != ""
    );
  }

  /**
   * Met à jour les montants de la note de Frais
   * @return {[type]} [description]
   */
  updateMontants() {
    let total = FraisJour.calculerTotal(this.detail);

    this.totalAReglerFrais = parseFloat(total);
    this.totalClientFrais = this.detail.facturable ? parseFloat(total) : 0;
  }
}

export default FraisJour;
