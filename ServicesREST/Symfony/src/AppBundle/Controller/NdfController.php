<?php
/**
 * Created by Notepad++.
 * User: e.michel
 * Date: 18/10/2017
 */
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Security\LoginController;

class NdfController extends Controller
{
   
  /**
  * @Route("/ndf/{id}/{annee}/{mois}", name="ndf")
  * @Method("GET")
  */
  public function getNdf(Request $request,$id,$annee,$mois)
  {
    /*$log=new LoginController();
    $retourAuth = $log->checkAuthentification($this);
    if (array_key_exists("erreur", $retourAuth)) {
      return new JsonResponse($retourAuth,403);
    }*/
		
		if (ctype_digit($id) && ctype_digit($annee) && ctype_digit($mois)) 
		{
      $id = (int) $id;  
      $annee = (int) $annee;
      $mois = (int) $mois;

		  $sql ='SELECT idUser as id, CASE 
      when etat="3" then "A modifier"
      when etat="2" then "Validé" 
      when etat="1" then "En attente validation"
      when etat="0" then "Brouillon" 
      end as etat,jour, mois, annee, facturable,client, lieu, coalesce(forfait,0.00) as forfait, nbkms,coalesce(sncf,0.00) as sncf, coalesce(peages,0.00) as peages,essence, coalesce(parking,0.00) as parking,coalesce(taxi,0.00) as taxi,indemKM,notedefrais.nbzones,pourcentage,coalesce(hotel,0.00) as hotel,coalesce(repas,0.00) as repas,coalesce(invit,0.00) as invit, divers, libelle FROM notedefrais WHERE idUser = "'.$id.'" AND mois = "'.$mois.'" AND annee = "'.$annee.'"';

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();

      $list= $stmt->fetchAll();

      // si la note de frais existe, on recupere les valeurs
      if(count($list)!=0){
        $etat='';
        $annee='';
        $mois='';
        $id='';
        $listNdf=array();
        for($i=0; $i<count($list);$i++){
          $row=$list[$i];
          $etat=$row['etat'];
          $annee=$row['annee'];
          $mois=$row['mois'];
          $id=$row['id'];

          $rowNdf= array();
          $rowNdf['jour']=$row['jour'];
          $rowNdf['mois']=$row['mois'];
          $rowNdf['annee']=$row['annee'];
          $rowNdf['facturable']=$row['facturable'];
          $rowNdf['client']=$row['client'];
          $rowNdf['lieu']=$row['lieu'];
          $rowNdf['montantForfait']=$row['forfait'];
          $rowNdf['nbKM']=$row['nbkms'];
          $rowNdf['montantFraisSNCF']=$row['sncf'];
          $rowNdf['montantPeages']=$row['peages'];
          $rowNdf['montantEssence']=$row['essence'];
			    $rowNdf['montantParking']=$row['parking'];
          $rowNdf['montantTaxi']=$row['taxi'];
          $rowNdf['indemKM']=$row['indemKM'];
          $rowNdf['montantNbZone']=$row['nbzones'];
          $rowNdf['montantPourcentage']=$row['pourcentage'];
          $rowNdf['montantHotel']=$row['hotel'];
          $rowNdf['montantRepas']=$row['repas'];
          $rowNdf['montantInvitation']=$row['invit'];
          $rowNdf['montantDivers']=$row['divers'];
          $rowNdf['libelleDivers']=$row['libelle'];
          $listNdf[]=$rowNdf;
        }
        $retour=array('idUser'=>$id, 'mois'=>$mois,'annee'=>$annee,'etat'=>$etat, 'notesDeFrais'=>$listNdf);

        array_walk_recursive(
          $retour,
          function (&$entry) {
            $entry = mb_convert_encoding($entry, 'UTF-8', 'ISO-8859-1');
          }
        );
          
        return new JsonResponse($retour,Response::HTTP_OK);
       }
       else
       { 
          $message=array('message'=>'Pas de données');
          return new JsonResponse($message,Response::HTTP_NOT_FOUND);
       }
	 } 
	 else {
			$message = array('message' => 'Format parametres incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
    }
}	
  /**
  * @Route("/ndf/{id}/{annee}/{mois}", name="ndf2")
  * @Method("DELETE")
  */
  public function deleteNdfAction(request $delete,$id,$annee,$mois)
  {
    /*$log=new LoginController();
    $retourAuth = $log->checkAuthentification($this);
    if (array_key_exists("erreur", $retourAuth)) {
      return new JsonResponse($retourAuth,403);
    }*/

    if(ctype_digit($id) && ctype_digit($annee) && ctype_digit($mois)){
        $id = (int) $id;
        $annee = (int) $annee;
        $mois = (int) $mois;
        $retourdelete=$this->deleteNdf($id,$annee,$mois);  
        return new JsonResponse($retourdelete['message'],$retourdelete['code']);
    }
    else{
      $message = array('message' => 'Format parametres incorrect');
      return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
    }
    
  }

  public function deleteNdf($id,$annee,$mois)
  {

		//on commence par vérifier les variables en entrée de la request
		$etat = null;
		
		if (ctype_digit($id) && ctype_digit($annee) && ctype_digit($mois)) 
		{
      $id = (int) $id;
      $annee = (int) $annee;
      $mois = (int) $mois;
      //on vérifie si la ligne existe
      $sql ='select etat FROM notedefrais WHERE  idUser = "'.$id.'" AND mois = "'.$mois.'" AND annee = "'.$annee.'" group by etat' ;
      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();

      $list= $stmt->fetchAll();

      //si la ligne existe, alors on la supprime
		
      for($i=0; $i<count($list);$i++){
        $row=$list[$i];
        $etat=$row['etat'];
			}
		
			if($etat == '0' || $etat == '1' || $etat == '3'){
				/*
			 when etat="3" then "A modifier"
			 when etat="2" then "Validé" 
			 when etat="1" then "En attente validation"
			 when etat="0" then "Brouillon" */

			   $sql ='DELETE FROM notedefrais WHERE  idUser = "'.$id.'" AND mois = "'.$mois.'" AND annee = "'.$annee.'"';

			   $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			   $retour=$stmt->execute();
		   
			   $message=array('message'=>'Delete OK: Note de frais supprimee');
			
			   return  array('message'=>$message,'code'=>Response::HTTP_OK);
			}
			//si la ligne existe mais validee
			else if ($etat == 2)
			{
				$message=array('message'=>'Delete KO: La note de frais est validee');
				return  array('message'=>$message,'code'=>Response::HTTP_NOT_FOUND);
			}
			//si la ligne n'existe pas, alors on le dit et on ne supprime pas
			else
			{
				$message=array('message'=>'Delete KO: Pas de ligne à supprimer');
				return  array('message'=>$message,'code'=>Response::HTTP_NOT_FOUND);
			}
		}
		else {
				$message = array('message' => 'Delete KO: Format parametres incorrect');
				return array('message'=>$message,'code'=>Response::HTTP_BAD_REQUEST);
		}
  }
    
  /**
  * @Route("/ndf/{id}/{annee}/{mois}", name="ndf3")
  * @Method("PUT")
  */
  public function putNdfAction(Request $request,$id,$annee,$mois)
  {
    /*$log=new LoginController();
    $retourAuth = $log->checkAuthentification($this);
    if (array_key_exists("erreur", $retourAuth)) {
      return new JsonResponse($retourAuth,400);
    }*/  
		  
		/* Exemple de Jason
		{
			"idUser": "124124251",
			"mois": "9",
			"annee": "2017",
			"etat": "Brouillon",
			"notesDeFrais": [
				{
					"jour": "3",
					"mois": "9",
					"annee": "2017",
					"facturable": "0",
					"client": "CIMUT",
					"lieu": "Paris",
					"montantForfait": "00.00",
					"nbKM": "585",
					"montantFraisSNCF": "0.00",
					"montantPeages": "0.00",
					"montantParking": "0.00",
					"montantEssence": "0.00",
					"montantTaxi": "0.00",
					"montantNbZone": "0",
					"montantPourcentage": "0.00",
					"montantHotel": "0.00",
					"montantRepas": "18.40",
					"montantInvitation": "0.00",
					"montantDivers": "0.00",
					"libelleDivers": ""
				}	
			]
		}
		*/		 
		//on verifie que les données en entrée 
		// Get the entity manager
    if(ctype_digit($id) && ctype_digit($annee) && ctype_digit($mois)){
      $id = (int) $id;
      $annee = (int) $annee;
      $mois = (int) $mois;
      //on appelle la fonction deleteNDF
      $retourdelete=$this->deleteNdf($id,$annee,$mois);  
      if($retourdelete['code']!=200){
        return new JsonResponse($retourdelete['message'],$retourdelete['code']);
      }

      //on appelle la fonction postNDF
      $retourpost = $this->postNdfAction($request);     
      return $retourpost;

      if($retourpost['code']!=200){
        return new JsonResponse($retourpost['message'],$retourpost['code']);
      }
    }
    else{
        $message = array('message' => 'Delete KO: Format parametres incorrect');
        return array('message'=>$message,'code'=>Response::HTTP_BAD_REQUEST);
    } 	
  }

  /**
	* @Route("/ndf/{annee}/{idUser}", name="ndfByUser")
	* @Method({"GET"})
  */
	public function getNdfByUser(Request $request, $annee, $idUser)
  {
		/*$log=new LoginController();
    $retourAuth = $log->checkAuthentification($this);
    if (array_key_exists("erreur", $retourAuth)) {
      return new JsonResponse($retourAuth,400);
    }*/
		
    if(ctype_digit($annee) && ctype_digit($idUser)){
        $idUser = (int) $idUser;
        $annee = (int) $annee;
    }
    else{
        $message=array('message'=>'Format Paramètre incorrect');
        return new JsonResponse($message,Response::HTTP_BAD_REQUEST);
    }
        
    $sql='SELECT idUser,  mois, annee, COALESCE(ROUND(SUM(nbkms)*MIN(notedefrais.indemKM),2),0) + COALESCE(SUM(peages),0) + COALESCE(SUM(notedefrais.forfait),0) + COALESCE(SUM(sncf),0) + COALESCE(SUM(pourcentage),0) + COALESCE(SUM(hotel),0) + COALESCE(SUM(repas),0) + COALESCE(SUM(invit),0) + COALESCE(SUM(essence),0) + COALESCE(SUM(parking),0) + COALESCE(SUM(taxi),0) + COALESCE(SUM(divers),0) AS montantTotal, CASE etat WHEN 0 THEN "Brouillon" WHEN 1 THEN "En attente validation" WHEN 2 THEN "Validé" WHEN 2 THEN "A modifier" ELSE "Autre" END as etat, dateactionetat, CONCAT(valid.prenom," ", valid.nom) as valideur FROM notedefrais  left join users as valid on notedefrais.validateur = valid.id WHERE idUser = "'.$idUser.'" and annee = '.$annee.' GROUP BY idUser, mois, annee,etat, dateactionetat;';

    $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
    $stmt->execute();
    $retour= $stmt->fetchAll();
    if(count($retour)==0){
      $message=array('message'=>'Aucune note de frais trouvée');
      return new JsonResponse($message,Response::HTTP_NOT_FOUND);
    }
    else 
      return new JsonResponse($retour);
    }

  /**
  * @Route("/ndf/", name="ndfPost")
  * @Method({"POST"})
     */
    public function postNdfAction(Request $request)
    {
      /*$log=new LoginController();
      $retourAuth = $log->checkAuthentification($this);
      if (array_key_exists("erreur", $retourAuth)) {
        return new JsonResponse($retourAuth,400);
      }*/ 
		  
			/* Exemple de Jason
			{
				"idUser": "124124251",
				"mois": "9",
				"annee": "2017",
				"etat": "Brouillon",
				"notesDeFrais": [
					{
						"jour": "3",
						"mois": "9",
						"annee": "2017",
						"facturable": "0",
						"client": "CIMUT",
						"lieu": "Paris",
						"montantForfait": "00.00",
						"nbKM": "585",
						"montantFraisSNCF": "0.00",
						"montantPeages": "0.00",
						"montantParking": "0.00",
						"montantEssence": "0.00",
						"montantTaxi": "0.00",
						"montantNbZone": "0",
						"montantPourcentage": "0.00",
						"montantHotel": "0.00",
						"montantRepas": "18.40",
						"montantInvitation": "0.00",
						"montantDivers": "0.00",
						"libelleDivers": ""
					}
				]
			}
			*/  
		  
      $data = json_decode(file_get_contents('php://input'), true);
      try{
        $retour = $this->postNdf($data);
      }
      catch (\Symfony\Component\Debug\Exception\ContextErrorException $e) {
        return new JsonResponse("Problème de paramètres ", Response::HTTP_BAD_REQUEST);
      }
      return new JsonResponse($retour['message'],$retour['code']);
    }
    
    public function postNdf($data)
    {
      /*$log=new LoginController();
      $retourAuth = $log->checkAuthentification($this);
      if (array_key_exists("erreur", $retourAuth)) {
        return new JsonResponse($retourAuth,400);
      }*/
		
      $idUser = $data['idUser'];
      $mois = $data['mois'];
      $annee = $data['annee'];
      $etat = $data['etat']; //Revoir format

      switch ($data['etat']){
        case "Brouillon" :
          $etat = 0;
          break;
        case "En attente validation" :
          $etat = 1;
          break;
          //Etats validés ou A modifier interdits, autres états inconnus
        default :
          $retour=array('message'=>'Etat invalide','code'=>Response::HTTP_BAD_REQUEST);
          return $retour;
          break;       
      }
        
      //récupérer indemKM depuis table users
      $indemKM = number_format($this->getUserIndemKM($idUser), 3, '.','');
		  //echo $indemKM;
      $sql='INSERT into notedefrais (idUser, jour, mois, annee, etat, client, lieu, facturable, nbkms, peages, forfait, sncf, nbzones, pourcentage,fdr, hotel, repas, invit, essence, parking, taxi, divers, libelle, indemKM, validateur, dateactionetat) VALUES ';

      $listNdf=$data['notesDeFrais'];

      $i=0;
      foreach ($listNdf as $key => $row) {
        $jour = $row['jour'];
        $client = $row['client'];
        $lieu = $row['lieu'];
        $facturable = $row['facturable'];
        $nbKM = $row['nbKM'];
        //$indemKM = $row['indemKM']; //non saisi par l'utilisateur
        $montantPeages = $row['montantPeages'];
        $montantForfait = $row['montantForfait'];
        $montantFraisSNCF = $row['montantFraisSNCF'];
        $montantNbZone = $row['montantNbZone'];
        $montantPourcentage = $row['montantPourcentage'];
			  $montantFdr = '0'; // plus utilisé dans l'espace collab
        $montantHotel = $row['montantHotel'];
        $montantRepas = $row['montantRepas'];
        $montantInvitation = $row['montantInvitation'];
        $montantTaxi = $row['montantTaxi'];
        $montantEssence = $row['montantEssence'];
        $montantParking = $row['montantParking'];
        $montantDivers = $row['montantDivers'];
        $libelleDivers = $row['libelleDivers'];  

        if($i>0){
          $sql .=',';
        }

        $sql .= "('$idUser', '$jour', '$mois', '$annee', $etat, '$client', '$lieu', '$facturable', '$nbKM', '$montantPeages', '$montantForfait', '$montantFraisSNCF', '$montantNbZone', '$montantPourcentage','$montantFdr', '$montantHotel', '$montantRepas', '$montantInvitation', '$montantEssence', '$montantParking', '$montantTaxi', '$montantDivers', '$libelleDivers', $indemKM, '$idUser', now())"; 

        $i++;
      }

      $sql .= ';';

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();

      $retour=array('message'=>"La note de frais a ete creee/mise a jour",'code'=>Response::HTTP_OK );
      return $retour;
    }

    public function getUserIndemKM($idUser)
    {
	   /*$log=new LoginController();
      $retourAuth = $log->checkAuthentification($this);
      if (array_key_exists("erreur", $retourAuth)) {
        return new JsonResponse($retourAuth,400);
      }*/

      $sql = 'SELECT indemKM FROM users WHERE id = '.$idUser;

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();

      $retour= $stmt->fetch();
		
      return $retour['indemKM'];
    }
}