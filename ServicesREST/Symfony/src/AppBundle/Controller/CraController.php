<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Security\LoginController;


class CraController extends Controller
{
    /**
    *@Route("/CRA/RA/{idRA}", name="getCra")
    *@Method("GET")
    */
    function getCra(Request $request,$idRA){

        //Vérification token
        /*$log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }*/
    
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
		
		//on formate le mois pour qu'il soit plus joli
		$moisf=substr(("0".$mois),-2,2);
					
		
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
        //$indexPremierJourDuMois = $premierJourDuMois - 1;
        $dernierJourDuMois = UtilsController::dernierJourMois($mois,$annee);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if($dernierJourDuMois == 0){
            $dernierJourDuMois = 7;
        }
 		
		

		//on élague le tableau tabValeursSaisies, on enlève les jours du mois précédent qui viennent encombrer le tableau inutilement
		// on fait une boucle qui consiste à enlever n fois le premier element du tableau jusqu'à arriver au premier jour du mois, avec n = premier jour du mois
		for ($i = 0; $i < $premierJourDuMois-1; $i++) {
		unset ($tabValeursSaisies[0]);
		//on remet les index dans le tableau proprement
		$tabValeursSaisies = array_values($tabValeursSaisies);
		}
		
		
		//de ce fait notre tableau commence bien au premier jour du mois, il ne reste plus qu'à faire la boucle sur le nombre de jours du mois = $dernierJourDuMois
		for ($j = 0; $j < $dernierJourDuMois; $j++){
			
			$jour = $j+1;
			//on formate le jour afin qu'il soit plus joli
			$jourf= substr("0".($j+1),-2,2);
			
			$date = $jourf."/".$moisf."/".$annee;
			
			  $tabNewPeriod = array();
			  $tabNewPeriod["date"] = $date;
			$tabNewPeriod["activité"] = $tabValeursSaisies[$j];
			
			
				array_push($tableauFinal, $tabNewPeriod);
		}
		 
		
		$retour[0]["NbJOuvres"] = strval(UtilsController::nbJoursOuvresParMois($mois,$annee));
        $retour[0]["valeursSaisies"] = $tableauFinal;
		 
        // Récupération du nombre de jours ouvrés dans le mois
        
         
        return new JsonResponse($retour);
    }

    /**
    *@Route("/CRA/{id}/{annee}", name="getListCraByCollaborateur")
    *@Method("GET")
    */
     function getListCraByCollaborateur(Request $request, $id, $annee){

        
        //Vérification token
        /*$log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }*/
		//Test si le paramètre année est valorisé, si non on le valorise par l'année en cours

        $sql = "SELECT r.idUser as idUser, r.idRA as Id, r.mois,r.annee as annee, r.client, r.etat as status FROM relevesactivites r INNER JOIN etatra e ON r.etat = e.id WHERE r.idUser = '$id' AND r.annee = '$annee'  ORDER BY r.mois asc;";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        //$retour= $stmt->fetchAll();

		$retour= $stmt->fetchAll();
		$liste=array();
		for($i=0; $i<count($retour);$i++){
		
		
			$row=$retour[$i];
			$mois = $row['mois'];
			
			switch ($row['mois']){
				case "1" :
					$libelleMois = "Janvier";
					break;
				case "2" :
					$libelleMois = "Février";
					break;
				case "3" :
				$libelleMois = "Mars";
				break;
				case "4" :
				$libelleMois = "Avril";
				break;
				case "5" :
				$libelleMois = "Mai";
				break;
				case "6" :
				$libelleMois = "Juin";
				break;
				case "7" :
				$libelleMois = "Juillet";
				break;
				case "8" :
				$libelleMois = "Août";
				break;
				case "9" :
				$libelleMois = "Septembre";
				break;
				case "10" :
				$libelleMois = "Octobre";
				break;
				case "11" :
				$libelleMois = "Novembre";
				break;
				case "12" :
				$libelleMois = "Décembre";
				break;
					// Etats validés ou A modifier interdits, autres états inconnus
			}
			
			$idUser = $row['idUser'];
			$id = $row['Id'];
			$date = $libelleMois." ".$row['annee'];
			
			
			$client = $row['client'];
			$status = $row['status'];
			
			$moreThanOne = $this->getMoreThanOne($mois,$idUser);
			$hideDate =$this->getHideDate($id,$mois,$idUser);
			$manyElt =$moreThanOne;
			
			
			// on rajoute les éléments manquants
			$key = strval($i);
			
			$retour[$i]['key'] = $key;
			$retour[$i]['hideDate'] =$hideDate;
			$retour[$i]['moreThanOne'] = $moreThanOne;
			$retour[$i]['manyElt'] = $manyElt;
			
			
		$liste[] = array('key'=>$key,'Id'=>$id, 'date' => $date, 'client'=>$client, 'status'=>$status,'moreThanOne' => $moreThanOne,'hideDate' => $hideDate,'manyElt' => $manyElt);
			
		}
		  
          return new JsonResponse($liste,Response::HTTP_OK);
		 
		
        if(count($retour) == 0){
                $message = array('message' => "Aucun CRA trouvé pour l'idUtilisateur: ".$id. " et l'année: ".$annee);
                return new JsonResponse($message,400);
        }
        else{

            return new JsonResponse($retour);
        }        
    }

    
	public function getMoreThanOne($mois,$idUser)
    {

      $sql = "select count(idRA) as nb from relevesactivites where mois = '$mois' and idUser = '$idUser'";

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();
	  $retour= $stmt->fetch();
	  
	   if ($retour['nb'] == 1) {
			$retour=false; 
			return $retour;
		}
		else {
			$retour=true; 
			return $retour;
		}
	  }
	  
	  public function getHideDate($id,$mois,$idUser)
    {

      $sql = "select count(idRA) as nb from relevesactivites where mois = '$mois' and idUser = '$idUser'";
      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();
	  $retour= $stmt->fetch();
	  
	   if ($retour['nb'] == 1) {
			$retour=false; 
			return $retour;
		}
		else {
			
		$sql = "select min(idRA) as idRA  from relevesactivites where mois = '$mois' and idUser = '$idUser'";
		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();
		$retour= $stmt->fetch();

		if ($retour['idRA'] != $id) {
			$retour=true;
			return $retour;
		}
		else {
			$retour = false;
			return $retour;
		}
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
        /*$log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }*/

        $retourDelete = $this->deleteCra($idRA);
        return new JsonResponse($retourDelete["message"], $retourDelete["code"]);
    }

    /**
    *@Route("/CRA/RA", name="addCra")
    *@Method("POST")
    */
    function addCraAction(Request $request){
        
        //Vérification token
        /*$log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }*/

        $data = json_decode(file_get_contents('php://input'), true);
        try{
            $retourAdd = $this->addCra($data);
        }
        catch (\Symfony\Component\Debug\Exception\ContextErrorException $e) {
            return new JsonResponse("Problème de paramètres mon gars !".$e, Response::HTTP_BAD_REQUEST);
        }
        return new JsonResponse($retourAdd["message"], $retourAdd["code"]);
    }

    
    function addCra($data){
        
        $idCollab = $data['idCollab'];
        $libelleEtat = $data['libelleEtat'];
        $nbJTravail = $data['nbJTravail'];
        $nbJAbsence = $data['nbJAbsence'];
        $client = $data['client'];
        $responsable = $data['responsable'];
        $projet = $data['projet'];
        $commentaire = $data['commentaire'];
        $mois = $data['mois'];
        $tableauCRA = $data['tableauCRA'];

        $annee = date('Y');
        if(empty($mois)){
            $mois = date('m');
        }

        //Vérification des champs obligatoires
        /*if(empty($idCollab)){
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
        }*/

        /*if($libelleEtat == 'Brouillon'){
            $etat = '1';
        }
		else if($libelleEtat == 'En attente validation'){
            $etat = '2';
		 }
        else{
            $etat = "0";
        }*/
		
		switch ($libelleEtat){
            case "Brouillon" :
              $etat = 1;
              break;
            case "En attente validation" :
              $etat = 2;
              break;
            //Etats validés ou A modifier interdits, autres états inconnus
            default :
              $retour=array('message'=>'Etat invalide','code'=>Response::HTTP_BAD_REQUEST);
              return $retour;
              break;       
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
            $ChaineCRAFinal .= $tab["activité"].";";
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
        /*$log = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,400);
        }*/

        //Suppression du CRA
        $retourDelete = $this->deleteCra($idRA);
         if($retourDelete['code']!=200){
          return new JsonResponse($retourDelete['message'],$retourDelete['code']);
        }

	
		
        //Création du CRA
        $retourAdd = $this->addCraAction($request);
		return $retourAdd;
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
