<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Debug\Exception\ContextErrorException;
use AppBundle\Controller\UtilsController;
use AppBundle\Security\LoginController;

class UtilisateurController extends Controller
{
	/**
	* @Route("/utilisateur/{id}", name="utilisateur")
    * @Method({"GET"})
     */
    public function utilisateur(Request $request, $id)
    {
	       /*$log=new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,403);
          }*/
	   
	   if (UtilsController::isPositifInt($id)) {
			$id = (int) $id;

      $sql='select users.id as id,users.nom as nom,users.prenom,profils.libelle as profil,entitesjuridiques.nomEntite as entite,societeagence.nomSocieteAgence as agence from users, profils, entitesjuridiques,societeagence 
			where users.id = "'.$id.'" 
			and users.idprofil = profils.idProfil
			and users.idEntiteJuridique = entitesjuridiques.idEntite
			and users.idagence = societeagence.idSocieteAgence';

    	$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
       	$retour= $stmt->fetchAll();
		
		$manager = $this->getUserManager($id);
		//$nom=$retour['nom'];
		
		$retour[0]['responsable'] = $manager;
		
		
		//$retour=array('id'=>$id, 'nom' => $nom, 'responsable'=>$manager);
		
       	if(count($retour)==0){
         	$message=array('message'=>'Utilisateur non trouvé '.$id);
            return new JsonResponse($message,400);
       	}
       else 
	return new JsonResponse($retour);
    }
	else {

			$message = array('message' => 'Paramètre id incorrect: ' . $id);
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);

		}
	}
	
public function getUserManager($id)
    {
	   /*$log=new LoginController();
      $retourAuth = $log->checkAuthentification($this);
      if (array_key_exists("erreur", $retourAuth)) {
        return new JsonResponse($retourAuth,400);
      }*/

      $sql = 'SELECT idManager as manager FROM users WHERE id = '.$id;

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();
	  $retour= $stmt->fetch();
	  
	  if ($retour['manager'] == 0) {
			$retour="Non défini"; 
			return $retour;
		}
		else 
		{
			
	  $idManager=$retour['manager'];
	  
	  $sql = 'SELECT concat(prenom," ",nom) as manager FROM users WHERE id = '.$idManager;

      $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
      $stmt->execute();
	  $retour= $stmt->fetch();
	  
      return $retour['manager'];
	  }
    }

}
