<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{

    /**
    *@Route("/appli-mobile/example", name="homepage")
    */
    public function indexAction()
    {
        return $this->render('default/index.html.twig');
    }

	/**
	* @Route("/annuaire", name="annuaire")
     */
    public function annuaire(Request $request)
    {

        //$data = json_decode(file_get_contents('php://input'), true);
    	//$idAgence= $data['idAgence'];
        $idAgence = $request->query->get('idAgence');
        
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
	* @Route("/annuaire/user", name="infos_collab")
     */
    public function infos_collab(Request $request)
    {
  
    	$userId = $request->query->get('id');

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
