<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use AppBundle\Security\LoginController;

class AnnuaireController extends Controller
{


	/**
	* @Route("/annuaire/{idAgence}", name="annuaire")
  * @Method({"GET"})
     */
    public function annuaire(Request $request, $idAgence)
    {

	       /*$log=new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,403);
          }*/
       if((int)($idAgence)<=0){
           $message=array('message'=>'Paramètre idAgence incorrect');
            return new JsonResponse($message,400);
       }
        
      $sql='SELECT id, nom, prenom FROM users WHERE idAgence = "'.$idAgence.'" AND archive !="O" ORDER BY nom ASC, prenom ASC';

    	$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
       	$retour= $stmt->fetchAll();
       	if(count($retour)==0){
         	$message=array('message'=>'Agence non trouvée '.$idAgence);
            return new JsonResponse($message,400);
       	}
       else 
       	return new JsonResponse($retour);

    }

    /**
	  * @Route("/annuaire/user/{userId}", name="infos_collab")
    * @Method({"GET"})
     */
    public function infos_collab(Request $request, $userId)
    {
		       /*$log=new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,403);
          }*/
  
      if((int)($userId)<=0){
           $message=array('message'=>'Paramètre userId incorrect');
            return new JsonResponse($message,400);
       }

        $sql='SELECT id,nom,prenom,entitesjuridiques.nomEntite,users.idprofil,profils.libelle,telmobile,telclient,mail,mailclient from users,societeagence,entitesjuridiques,profils where idAgence = idSocieteAgence and users.identitejuridique = entitesjuridiques.idEntite and users.idprofil=profils.idprofil and users.archive !="O" and id = '.$userId;
        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

       $retour= $stmt->fetchAll();
       if(count($retour)==0){
           $message=array('message'=>'Utilisateur non trouvé '.$userId);
            return new JsonResponse($message,400);
       }
       else 
       return new JsonResponse($retour);

    }



}
