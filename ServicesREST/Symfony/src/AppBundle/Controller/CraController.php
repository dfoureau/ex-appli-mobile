<?php

namespace TestApiBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Controller\UtilsController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use AppBundle\Security\LoginController;


class CraController extends Controller
{
    /**
    *@Route("/CRA/RA/{idRA}", name="getCra")
    *@Method("GET")
    */
    function getCra(Request $request,$idRA){

        //Vérification token
        $log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }
    
        // Requête SQL pour sélectionner les relevés activités en fonction de l'idRA
        $sql = 'SELECT r.idRA,r.mois,r.annee, e.libelle, r.nbJourTravailles, r.nbJourAbs, r.client, r.responsable, r.projet,r.commentaires, r.valeursSaisies FROM relevesactivites r INNER JOIN etatra e ON r.etat = e.id WHERE idRA = "'.$idRA.'";';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour= $stmt->fetchAll();

        if(count($retour) == 0){
            $message = array('message' => "Aucun CRA trouvé pour l'id: ".$idRA);
            return new JsonResponse($message,400);
        }

        //Récupération dans la réponse de la requête du mois et de l'année et suppression de ces valeurs non présentes dans le retour du service
        $mois = $retour[0]["mois"];
        unset($retour[0]["mois"]);
        $annee = $retour[0]["annee"];
        unset($retour[0]["annee"]);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////// Algorithme pour transformer la chaine de caractères de la BDD en période de CRA //////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $valeursSaisies = $retour[0]["valeursSaisies"];
        $tableauFinal = array();

        //Création d'un tableau à partir de le chaine récupérée en base
        $tabValeursSaisies = split(";", $valeursSaisies);

        $premierJourDuMois = UtilsController::joursem($annee,$mois,1);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if($premierJourDuMois == 0){
            $premierJourDuMois = 7;
        }
        //L'index commence à 0
        $indexPremierJourDuMois = $premierJourDuMois - 1;
        $dernierJourDuMois = UtilsController::dernierJourMois($mois,$annee);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if($dernierJourDuMois == 0){
            $dernierJourDuMois = 7;
        }
        // L'index du dernier jour est égal à l'index du premier jour du mois + le nb de jours
        $indexDernierJourDuMois = $indexPremierJourDuMois + $dernierJourDuMois;
      
        $chaineDateDebut = "";
        $chaineDateFin = "";
        $nbJours = 0;
        $imputation = "";
        //Boucle sur le tableau de valeurs saisies
        foreach ($tabValeursSaisies as $key => $value) {
            //Cas de la dernière imputation du mois
            if($key == $indexDernierJourDuMois){
                //On ferme la dernière période et récupération du jour précédent
                $chaineDateFin = "Date fin: ".$dernierJourDuMois."/".$mois."/".$annee;
                $tabNewPeriod = array();
                $tabNewPeriod["dateDebut"] = $chaineDateDebut;
                $tabNewPeriod["dateFin"] = $chaineDateFin;
                $tabNewPeriod["activité"] = $imputation;
                $tabNewPeriod["nbJours"] = $nbJours;
                //Enregistrement de la période
                array_push($tableauFinal, $tabNewPeriod);
                break;
            }
            //Ajouter la condition $value != 0.0 si on compte pas les jours non ouvrés
            else if($value != $imputation){
                //test si c'est la première imputation du mois
                if($chaineDateDebut == "" && $key == $indexPremierJourDuMois){
                    $chaineDateDebut = "Date début: 1/".$mois."/".$annee;
                    $nbJours ++;
                    $imputation = $value;
                }
                //Nouvelle période
                else if($key >= $indexPremierJourDuMois){
                    //Récupération du jours précédent
                    $chaineDateFin = "Date fin: ".($key-$indexPremierJourDuMois)."/".$mois."/".$annee;
                    $tabNewPeriod = array();
                    $tabNewPeriod["dateDebut"] = $chaineDateDebut;
                    $tabNewPeriod["dateFin"] = $chaineDateFin;
                    $tabNewPeriod["activité"] = $imputation;
                    $tabNewPeriod["nbJours"] = $nbJours;
                    //Enregistrement de la période
                    array_push($tableauFinal, $tabNewPeriod);

                    //Valorisation pour la nouvelle période
                    $chaineDateDebut = "Date début: ".($key-($indexPremierJourDuMois-1))."/".$mois."/".$annee;
                    $nbJours = 1;
                    $imputation = $value;
                }
            }
            //La période continue
            //Ajouter la condition $value != 0.0 si on compte pas les jours non ouvrés
            else if($value == $imputation && ($key >= $indexPremierJourDuMois)){
                $nbJours ++;
            }
        }
        $retour[0]["valeursSaisies"] = $tableauFinal;

        // Récupération du nombre de jours ouvrés dans le mois
        $retour[0]["NbJOuvres"] = strval(UtilsController::nbJoursOuvresParMois($mois,$annee));
            
        return new JsonResponse($retour);
    }

    /**
    *@Route("/CRA/{id}/{annee}", name="getListCraByCollaborateur")
    *@Route("/CRA/{id}"), name="getListCraByCollaborateur")
    *@Method("GET")
    */
    function getListCraByCollaborateur(Request $request, $id, $annee = -1 ){

        //Vérification token
        $log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }

        //Test si le paramètre année est valorisé, si non on le valorise par l'année en cours
        if($annee == -1)
        {
            $annee = date("Y");
        }

        $sql = "SELECT r.idUser, r.idRA, r.mois, r.annee, r.client, e.libelle FROM relevesactivites r INNER JOIN etatra e ON r.etat = e.id WHERE r.idUser = '$id' AND r.annee = '$annee' ORDER BY r.mois asc;";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour= $stmt->fetchAll();

        if(count($retour) == 0){
                $message = array('message' => "Aucun CRA trouvé pour l'idUtilisateur: ".$id. " et l'année: ".$annee);
                return new JsonResponse($message,400);
        }
        else{
            return new JsonResponse($retour);
        }        
    }

    
    function deleteCra($idRA){

        $sql = 'DELETE FROM relevesactivites WHERE idRA = '.$idRA.';';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $retour= $stmt->rowCount();

        if($retour == 0){
            $message = array('message' => "Erreur dans la suppression");
            return array('message' =>$message, 'code'=>400);
        }
        else{
            $message = array('message' => "Suppression reussie");
            return array('message' =>$message, 'code'=>200);
        }
    }

    /**
    *@Route("/CRA/RA/{idRA}", name="deleteCra")
    *@Method("DELETE")
    */
    function deleteCraAction(Request $request, $idRA){

        //Vérification token
        $log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }

        $retourDelete = $this->deleteCra($idRA);
        return new JsonResponse($retourDelete["message"], $retourDelete["code"]);
    }

    /**
    *@Route("/CRA/RA", name="addCra")
    *@Method("POST")
    */
    function addCraAction(Request $request){
        
        //Vérification token
        $log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }

        $retourAdd = $this->addCra($request);
        return new JsonResponse($retourAdd["message"], $retourAdd["code"]);
    }

    
    function addCra(Request $request){
        //Récupération des paramétres dans la requête
        $idCollab = $request->request->get("idCollab");
        $libelleEtat = $request->request->get("libelleEtat");
        $nbJTravail = $request->request->get("NbJTravail");
        $nbJAbsence = $request->request->get("NbJAbsence");
        $client = $request->request->get("Client");
        $responsable = $request->request->get("Responsable");
        $projet = $request->request->get("Projet");
        $commentaire = $request->request->get("Commentaire");
        $mois = $request->request->get("Mois");
        $tableauCRA = $request->request->get("TableauPeriodeActivite");

        $annee = date('Y');
        if(empty($mois)){
            $mois = date('m');
        }

        //Vérification des champs obligatoires
        if(empty($idCollab)){
            $message = array('message' => "Le champ idCollab est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($responsable)){
            $message = array('message' => "Le champ responsable est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($client)){
            $message = array('message' => "Le champ client est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($libelleEtat)){
            $message = array('message' => "Le champ libelleEtat est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($nbJAbsence)){
            $message = array('message' => "Le champ nbJourAbs est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($nbJTravail)){
            $message = array('message' => "Le champ nbJourTravailles est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }
        if(empty($tableauCRA)){
            $message = array('message' => "Le champ TableauPeriodeActivite est obligatoire");
            return array('message' =>$message, 'code'=>400);
        }

        if($libelleEtat == 'Brouillon'){
            $etat = '1';
        }
        else if($libelleEtat == 'Validé'){
            $etat = '3';
        }
        else{
            $etat = "0";
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////// Algorithme pour transformer les périodes des CRA en chaine de caractères pour la BDD /////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $ChaineCRAFinal = "";
        $premierJourDuMois = UtilsController::joursem($annee,$mois,1);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if($premierJourDuMois == 0){
            $premierJourDuMois = 7;
        }
        $dernierJourDuMois = UtilsController::joursem($annee,$mois,UtilsController::dernierJourMois($mois,$annee));
        //La fonction renvoie 0 si le premier jour est un dimanche
        if($dernierJourDuMois == 0){
            $dernierJourDuMois = 7;
        }

        // Création des imputations 0.0 avant le début du mois
        $ChaineCRAFinal .= str_repeat("0.0;", $premierJourDuMois-1);
        
        foreach ($tableauCRA as $index => $tab) {
            //Ajout des imputations pour chaque période
            $ChaineCRAFinal .= str_repeat($tab["activité"].";", $tab["nbJours"]);
        }

        $ChaineCRAFinal .= str_repeat("0.0;", 7 - $dernierJourDuMois);
        $ChaineCRAFinal = substr($ChaineCRAFinal,0,-1);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //Remplacement des "," par des "." pour l'insertion SQL
        $nbJAbsence = str_replace(',', '.', $nbJAbsence);
        $nbJTravail = str_replace(',', '.', $nbJTravail);

        $sql = "INSERT INTO relevesactivites (idUser, mois, annee, responsable, client, projet, etat, commentaires, nbJourAbs, nbJourTravailles, valeursSaisies) VALUES ({$idCollab},{$mois},{$annee},'{$responsable}','{$client}','{$projet}',{$etat},'{$commentaire}',{$nbJAbsence},{$nbJTravail},'{$ChaineCRAFinal}');";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour= $stmt->rowCount();

        if($retour == 0){
            $message = array('message' => "Erreur dans la création");
            return array('message' =>$message, 'code'=>400);
        }
        else{
            $message = array('message' => "Création réussie");
            return array('message' =>$message, 'code'=>200);
        }
    }

    /**
    *@Route("/CRA/RA/{idRA}", name="updateCra")
    *@Method("PUT")
    */
    function updateCra(Request $request, $idRA){

        //Vérification token
        $log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }

        //Suppression du CRA
        $retourDelete = $this->deleteCra($idRA);
         if($retourDelete['code']!=200){
          return new JsonResponse($retourDelete['message'],$retourDelete['code']);
        }

        //Création du CRA
        $retourAdd = $this->addCra($request);
        if($retourAdd["code"] != 200){
            return new JsonResponse($retourAdd["message"], $retourAdd["code"]);
        }

        //Si tout est ok on envoie un code HTTP 200
        if($retourDelete["code"] == 200 && $retourAdd["code"] == 200){
            $message = array('message' => "Modification réussie");
            return new JsonResponse($message, 200);
        }
    }
}
?>